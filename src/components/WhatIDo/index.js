import React from 'react';
import MediumList from '../Medium/List';
import GitHubList from '../GitHub/List';

const WhatIDo = ({ theme }) => {
  return (
    <React.Fragment>
      <main className="main">
        <h1>What I do</h1>
        <h2>I work with web stuffs 🌐</h2>
        <p>
          I mainly work with JavaScript and all things related to the web ecosystem. Currently, I am
          working at{' '}
          <a href="https://www.tokopedia.com" target="_blank" rel="noopener noreferrer">
            Tokopedia
          </a>{' '}
          in the web platform team.
        </p>

        <hr />

        <h2>I write (kinda) 🗒</h2>
        <p>
          I have always been a curious person. I liked to learn things and understand how they work.
          Sometimes if I find the discovery interesting, I try to write an article about them to
          share them!{' '}
        </p>

        <MediumList />

        <p>
          Consider checking me out on{' '}
          <a href="https://medium.com/@jackyef" target="_blank" rel="noopener noreferrer">
            Medium
          </a>!
        </p>

        <hr />

        <h2>I build stuffs 🛠</h2>
        <p>
          Sometimes I am motivated to build stuffs. Some are just for fun and learning, some are
          actually kind of helpful. A lot are abandoned because I got sidetracked (don&rsquo;t we
          all? 😅). I published them as open source projects on{' '}
          <a href="https://github.com/jackyef" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>. I also contribute to open source libraries when I could.
        </p>

        <GitHubList />
      </main>

      <style jsx>
        {`
          .main {
            padding: 0 ${theme.space.inset.default};
            margin: ${theme.space.m} auto;
          }

          a {
            font-weight: ${theme.font.weight.bold};
            color: ${theme.color.brand.primary};
            text-decoration: underline;
          }

          h1 {
            margin-bottom: ${theme.space.default};
          }

          h2 {
            margin: ${theme.space.s} 0;
          }

          hr {
            margin: ${theme.space.default};
          }

          @above tablet {
            .main {
              padding: 0 ${`calc(${theme.space.default} * 1.5)`};
            }
          }

          @above desktop {
            .main {
              max-width: ${theme.text.maxWidth.desktop};
            }
          }
        `}
      </style>
    </React.Fragment>
  );
};

export default WhatIDo;
