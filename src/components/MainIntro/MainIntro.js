import React from 'react';

const MainIntro = ({ theme }) => {
  return (
    <React.Fragment>
      <main className="main">
        <h1>What I do</h1>
        <h2>I work with web-related stuffs 🌐</h2>
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
          I have always liked to learn things and understand how they work. Sometimes if I find the
          discovery interesting, I try to write an article about them to share them!{' '}
        </p>

        <p>
          Consider checking me out on{' '}
          <a href="https://medium.com/@jackyef" target="_blank" rel="noopener noreferrer">
            Medium
          </a>!
        </p>

        <hr />

        <h2>I build stuffs 🛠</h2>
        <p>
          I try to build things to help making my life easier. Some of them I published as an open
          source project on{' '}
          <a href="https://github.com/jackyef" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>.
        </p>
      </main>

      <style jsx>
        {`
          .main {
            padding: 0 ${theme.space.inset.default};
            margin: ${theme.space.l} auto;
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
              padding: 0 ${`0 calc(${theme.space.default} * 1.5)`};
            }
            ul {
              max-width: ${theme.text.maxWidth.tablet};
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

export default MainIntro;
