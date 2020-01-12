import React from 'react';
import { ThemeContext } from '../../layouts';

const GitHubRepoCard = ({ title, description, starCount, url }) => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <div>
            <h3>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
              </a>{' '}
            </h3>
            <p>{description}</p>
            {starCount > 0 ? <span>{starCount} stars</span> : null}
          </div>

          <style jsx>{`
            div {
              display: inline-block;
              border-radius: ${theme.size.radius.default};
              margin: ${theme.space.s} ${theme.space.default} ${theme.space.s} 0;
              box-shadow: 0px 3px 9px -5px rgba(0, 0, 0, 0.3);
              width: ${`calc(100% - ${theme.space.default} * 2)`};
              white-space: normal;
              vertical-align: top;
              scroll-snap-align: start;
            }

            h3 {
              padding: ${theme.space.inset.s};
              font-size: ${theme.font.size.s};
            }

            h3 > a {
              color: ${theme.color.neutral.black};
            }

            p {
              padding: 0 ${theme.space.inset.s} ${theme.space.inset.s};
              font-size: ${theme.font.size.xxs};
              color: ${theme.color.neutral.gray.h};
            }

            span {
              align-items: center;
              display: flex;
              padding: 0 ${theme.space.inset.s} ${theme.space.inset.s};
              font-size: ${theme.font.size.xxs};
              color: ${theme.color.neutral.gray.g};
            }

            @above tablet {
              div {
                display: inline-flex;
                flex-direction: column;
                align-self: flex-start;
                justify-content: flex-start;
                width: ${`calc(${theme.text.maxWidth.tablet} * 0.5 - ${theme.space.default} * 2)`};
              }

              div:last-child {
                margin-right: 0;
              }
            }

            @above desktop {
              div {
                width: ${`calc(${theme.text.maxWidth.desktop} * 0.5 - ${theme.space.default} * 2)`};
              }
            }
          `}</style>
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
};

export default GitHubRepoCard;
