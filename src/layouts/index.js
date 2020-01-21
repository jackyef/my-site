import FontFaceObserver from 'fontfaceobserver';
import React from 'react';
import { graphql, StaticQuery } from 'gatsby';

import { getScreenWidth, timeoutThrottlerHandler } from '../utils/helpers';
import Footer from '../components/Footer/';
import Header from '../components/Header';
import fontStylesheet from './fontStylesheet';

const canUseDOM = typeof window !== 'undefined';

export const ThemeContext = React.createContext(null);
export const DarkModeContext = React.createContext(null);
export const ScreenWidthContext = React.createContext(0);
export const FontLoadedContext = React.createContext(false);

import themeObjectFromYaml from '../theme/theme.yaml';

class Layout extends React.Component {
  constructor() {
    super();

    this.state = {
      font400loaded: false,
      font600loaded: false,
      screenWidth: 0,
      headerMinimized: false,
      theme: themeObjectFromYaml,
      darkMode: canUseDOM ? (localStorage.getItem('theme') === 'dark' ? true : false) : false,
    };

    if (typeof window !== `undefined`) {
      this.loadFont('font400', 'Open Sans', 400);
      this.loadFont('font600', 'Open Sans', 600);
    }
  }

  timeouts = {};

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeThrottler, false);
    }

    this.setState({
      screenWidth: getScreenWidth(),
      darkMode: window.__theme === 'dark',
    });

    window.__onThemeChange = newTheme => {
      this.setState({ darkMode: newTheme === 'dark' });
    };
  }

  resizeThrottler = () => {
    return timeoutThrottlerHandler(this.timeouts, 'resize', 100, this.resizeHandler);
  };

  resizeHandler = () => {
    this.setState({ screenWidth: getScreenWidth() });
  };

  isHomePage = () => {
    if (this.props.location.pathname === '/') {
      return true;
    }

    return false;
  };

  loadFont = (name, family, weight) => {
    const font = new FontFaceObserver(family, {
      weight: weight,
    });

    font.load(null, 10000).then(
      () => {
        console.log(`${name} is available`);
        this.setState({ [`${name}loaded`]: true });
      },
      () => {
        console.log(`${name} is not available`);
      },
    );
  };

  toggleDarkMode = () => {
    if (this.state.darkMode) {
      window.__setPreferredTheme('light');
    } else {
      window.__setPreferredTheme('dark');
    }
  };

  render() {
    return (
      <StaticQuery
        query={graphql`
          query LayoutQuery {
            pages: allMarkdownRemark(
              filter: { fileAbsolutePath: { regex: "//pages//" }, fields: { prefix: { regex: "/^\\d+$/" } } }
              sort: { fields: [fields___prefix], order: ASC }
            ) {
              edges {
                node {
                  fields {
                    slug
                    prefix
                  }
                  frontmatter {
                    title
                    menuTitle
                  }
                }
              }
            }
            footnote: markdownRemark(fileAbsolutePath: { regex: "/footnote/" }) {
              id
              html
            }
          }
        `}
        render={data => {
          const { children } = this.props;
          const {
            footnote: { html: footnoteHTML },
            pages: { edges: pages },
          } = data;
          const { theme, font400loaded, font600loaded, screenWidth, darkMode } = this.state;

          return (
            <ThemeContext.Provider value={theme}>
              <FontLoadedContext.Provider value={font400loaded}>
                <ScreenWidthContext.Provider value={screenWidth}>
                  <DarkModeContext.Provider
                    value={{ darkMode: darkMode, toggle: this.toggleDarkMode }}
                  >
                    <React.Fragment>
                      <Header path={this.props.location.pathname} pages={pages} theme={theme} />
                      <main>{children}</main>
                      <Footer html={footnoteHTML} theme={theme} />

                      {/* --- STYLES --- */}
                      <style>{fontStylesheet}</style>
                      {/* https://github.com/gaearon/overreacted.io/blob/a1bac20ea689e31a5e7a0be2e9d56bbf74806c5f/src/utils/global.css */}
                      <style>{`
                        body.light {
                          --light-mode-enabled: 1;
                          --dark-mode-enabled: 0;
                          --dark-mode-toggle-rotation: 0deg;

                          --bgPrimary: #fff;

                          --textNormal: #2b2826;
                          --textTitle: #2b2826;
                          --textLink: #0959A7;

                          --lineColor: #0959A7;

                          --shadow: 0px 3px 9px -5px rgba(0, 0, 0, 0.3);

                          --imageFilter: none;
                        }

                        body.dark {
                          -webkit-font-smoothing: antialiased;
                          --dark-mode-enabled: 1;
                          --light-mode-enabled: 0;
                          --dark-mode-toggle-rotation: 180deg;

                          --bgPrimary: #161616;

                          --textNormal: #fafaf9;
                          --textTitle: #fafaf9;
                          --textLink: #f2fafe;

                          --lineColor: #333;

                          --shadow: 0px 3px 9px -5px rgba(200, 200, 200, 0.3);

                          --imageFilter: brightness(0.8);
                        }
                      `}</style>
                      <style jsx>{`
                        main {
                          min-height: 80vh;
                        }
                      `}</style>
                      <style jsx global>{`
                        html {
                          box-sizing: border-box;
                          color: var(--textNormal);
                        }
                        *,
                        *:after,
                        *:before {
                          box-sizing: inherit;
                          margin: 0;
                          padding: 0;
                          transition: color 0.3s, background 0.3s;
                        }
                        body {
                          font-family: 'Open Sans', Arial, sans-serif;
                          background: var(--bgPrimary);
                          overflow-x: hidden;
                        }
                        h1,
                        h2,
                        h3 {
                          font-weight: ${font600loaded ? 600 : 400};
                          line-height: 1.1;
                          letter-spacing: -0.03em;
                          margin: 0;
                          color: var(--textTitle);
                        }
                        h1 {
                          letter-spacing: -0.04em;
                        }
                        p {
                          margin: 0;
                          color: var(--textNormal);
                        }

                        ol,
                        ul,
                        li {
                          color: var(--textNormal);
                        }

                        strong {
                          font-weight: ${font600loaded ? 600 : 400};
                        }
                        a {
                          text-decoration: none;
                          color: #666;
                          color: var(--textLink);
                        }
                        main {
                          width: auto;
                          display: block;
                        }
                      `}</style>
                    </React.Fragment>
                  </DarkModeContext.Provider>
                </ScreenWidthContext.Provider>
              </FontLoadedContext.Provider>
            </ThemeContext.Provider>
          );
        }}
      />
    );
  }
}

export default Layout;
