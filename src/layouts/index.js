import FontFaceObserver from 'fontfaceobserver';
import React from 'react';
import { graphql, StaticQuery } from 'gatsby';

import { getScreenWidth, timeoutThrottlerHandler } from '../utils/helpers';
import Footer from '../components/Footer/';
import Header from '../components/Header';

const canUseDOM = typeof window !== 'undefined';

export const ThemeContext = React.createContext(null);
export const DarkModeContext = React.createContext(null);
export const ScreenWidthContext = React.createContext(0);
export const FontLoadedContext = React.createContext(false);

import themeObjectFromYaml from '../theme/theme.yaml';
import fontStylesheet from './fontStylesheet';

class Layout extends React.Component {
  constructor() {
    super();

    this.state = {
      font400loaded: false,
      font600loaded: false,
      screenWidth: 0,
      headerMinimized: false,
      theme: themeObjectFromYaml,
      darkMode: canUseDOM ? (localStorage.getItem('dark-mode') === 'true' ? true : false) : false,
    };

    if (typeof window !== `undefined`) {
      this.loadFont('font400', 'Open Sans', 400);
      this.loadFont('font600', 'Open Sans', 600);
    }
  }

  timeouts = {};

  componentDidMount() {
    this.setState({
      screenWidth: getScreenWidth(),
    });
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.resizeThrottler, false);
    }
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
      localStorage.setItem('dark-mode', false);
    } else {
      localStorage.setItem('dark-mode', true);
    }

    this.setState(prev => ({ darkMode: !prev.darkMode }));
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
                      <style jsx>{`
                        main {
                          min-height: 80vh;
                        }
                      `}</style>
                      <style>{fontStylesheet}</style>
                      <style jsx global>{`
                        html {
                          box-sizing: border-box;
                        }
                        *,
                        *:after,
                        *:before {
                          box-sizing: inherit;
                          margin: 0;
                          padding: 0;
                        }
                        body {
                          font-family: 'Open Sans', Arial, sans-serif;
                        }
                        h1,
                        h2,
                        h3 {
                          font-weight: ${font600loaded ? 600 : 400};
                          line-height: 1.1;
                          letter-spacing: -0.03em;
                          margin: 0;
                        }
                        h1 {
                          letter-spacing: -0.04em;
                        }
                        p {
                          margin: 0;
                        }
                        strong {
                          font-weight: ${font600loaded ? 600 : 400};
                        }
                        a {
                          text-decoration: none;
                          color: #666;
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
