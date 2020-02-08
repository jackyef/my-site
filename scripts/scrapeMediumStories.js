const fs = require('fs');
const scrapeIt = require('scrape-it');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');

/**
 * Very crude medium scraper. Good enough for my usage.
 * It gets:
 * - Title
 * - Cover Image URL
 * - Story URL
 * - Time to Read
 * - Claps
 *
 * Had to made one because medium's RSS and API are just not good enough.
 */

const mediumPath = path.join(__dirname, '../src/components/Medium/medium-stories.json');
const username = '@jackyef';
const mediumUrl = `https://www.medium.com/${username}`;

const spinnerNext = (spinner, message) => {
  spinner.stopAndPersist({
    prefixText: '✅ ',
  });

  if (message) {
    return ora(message).start();
  }
};

const isPrettifiedNumber = string => {
  return /[kKmM]$/.test(string);
};

console.info(chalk.blue('👋  Hi! I will start scraping your latest medium stories!'));
const start = process.hrtime();

let spinner = ora('Scraping in progress...').start();

(async () => {
  const json = await scrapeIt(mediumUrl, {
    stories: {
      listItem: 'div',
      data: {
        title: 'h1',
        url: {
          selector: 'a[rel="noopener"]',
          attr: 'href',
        },
        coverImage: {
          selector: 'img[role="presentation"]',
          attr: 'src',
        },
        timeToRead: {
          selector: 'div',
          convert: a => {
            if (a.includes('min read')) {
              const splitted = a.split(' ');
              const indexOfMin = splitted.findIndex(c => c === 'min');

              return `${splitted[indexOfMin - 1]} ${splitted[indexOfMin]} read`;
            }

            return a;
          },
        },
        claps: {
          selector: 'h4',
        },
      },
    },
  }).then(({ data, response }) => {
    console.log(`Status Code: ${response.statusCode}`);
    // console.log(data);

    return data;
  });

  spinner = spinnerNext(spinner, 'Creating mappings for `time to read`...');
  // maps title: <timeToRead>
  const timeToReadMap = {};
  json.stories.forEach(s => {
    if (s.timeToRead.includes('min read')) {
      timeToReadMap[s.title] = s.timeToRead;
    }
  });

  spinner = spinnerNext(spinner, 'Creating mappings for `claps`...');
  // maps title: <claps>
  const clapsMap = {};
  json.stories.forEach(s => {
    if (Number(s.claps) || isPrettifiedNumber(s.claps)) {
      clapsMap[s.title] = s.claps;
    }
  });

  spinner = spinnerNext(spinner, 'Filtering stuffs...');
  const stories = json.stories.filter(j => {
    const conditions = [
      !(!j.title || !j.url || !j.coverImage), // any of the field is empty
      j.url.split('/').length > 2, // must have more than 1 '/' in it
    ];

    return conditions.every(c => c);
  });

  spinner = spinnerNext(spinner, 'Just a little bit more...');
  stories.forEach(s => {
    s.timeToRead = timeToReadMap[s.title];
    s.url = `https://medium.com${s.url}`;
    s.claps = clapsMap[s.title];

    // I want better quality images
    s.coverImage = s.coverImage.replace('max/60', 'max/600');
    s.coverImage = s.coverImage.replace('?q=20', '?q=75');
  });

  spinner = spinnerNext(spinner, 'Updating our medium-stories.json...');
  // eslint-disable-next-line
  const existingStories = require(mediumPath);

  existingStories.forEach(s => {
    let freshlyScrapedStory = stories.find(e => e.title === s.title);

    if (!freshlyScrapedStory) {
      // this new story does not exist in the existing json.
      // let's add our old story to the new json!
      stories.push(s);
    }
  });
  fs.writeFileSync(mediumPath, JSON.stringify(stories, null, 2));

  spinnerNext(spinner);

  let finish = process.hrtime(start);
  finish = finish[0] + finish[1] / 1e9;
  console.info(chalk.green(`All done! (${finish}s)`));
})();
