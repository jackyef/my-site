import React from 'react';
import PropTypes from 'prop-types';

export default class HTML extends React.Component {
  render() {
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          {this.props.headComponents}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="#D0E0D8" />
          <meta name="apple-mobile-web-app-title" content="Lazywill" />
          <link rel="apple-touch-icon" href="/icons/57x57.png" sizes="57x57" />
          <link rel="apple-touch-icon" href="/icons/60x60.png" sizes="60x60" />
          <link rel="apple-touch-icon" href="/icons/72x72.png" sizes="72x72" />
          <link rel="apple-touch-icon" href="/icons/76x76.png" sizes="76x76" />
          <link rel="apple-touch-icon" href="/icons/114x114.png" sizes="114x114" />
          <link rel="apple-touch-icon" href="/icons/120x120.png" sizes="120x120" />
          <link rel="apple-touch-icon" href="/icons/144x144.png" sizes="144x144" />
          <link rel="apple-touch-icon" href="/icons/152x152.png" sizes="152x152" />
          <link rel="apple-touch-icon" href="/icons/180x180.png" sizes="180x180" />
          <link rel="shortcut icon" href="/icons/48x48.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/16x16.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/icons/96x96.png" />
          {/* Open Sans Latin 400 Font */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0bf8pkAg.woff2"
            as="font"
            crossOrigin="true"
          />
          {/* Open Sans Latin 600 Font */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/opensans/v17/mem5YaGs126MiZpBA-UNirkOUuhpKKSTjw.woff2"
            as="font"
            crossOrigin="true"
          />
        </head>
        <body {...this.props.bodyAttributes} className="light">
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                var __metaTheme = document.querySelector("meta[name='theme-color']");
                var __metaThemeColor = { light: __metaTheme.getAttribute('content'), dark: '#222' };

                window.__onThemeChange = function() {};
                function setTheme(newTheme) {
                  window.__theme = newTheme;
                  preferredTheme = newTheme;
                  document.body.className = newTheme;
                  __metaTheme.setAttribute('content', __metaThemeColor[newTheme]);
                  window.__onThemeChange(newTheme);
                }
                var preferredTheme;
                try {
                  preferredTheme = localStorage.getItem('theme');
                } catch (err) { }
                window.__setPreferredTheme = function(newTheme) {
                  setTheme(newTheme);
                  try {
                    localStorage.setItem('theme', newTheme);
                  } catch (err) {}
                }
                var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkQuery.addListener(function(e) {
                  window.__setPreferredTheme(e.matches ? 'dark' : 'light')
                });
                setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
              })();
            `,
            }}
          />
          {this.props.preBodyComponents}
          <div key={`body`} id="___gatsby" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
