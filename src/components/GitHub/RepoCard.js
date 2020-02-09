import React from 'react';
import { ThemeContext } from '../../layouts';
import Tag from '../common/Tag';

const GitHubRepoCard = ({ title, description, starCount, url, tags = [] }) => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <div className="container">
            <h3>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
              </a>{' '}
            </h3>
            <p>{description}</p>
            {tags.length ? (
              <div className="taglist">{tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div>
            ) : null}
            {starCount > 0 ? <span>{starCount} stars</span> : null}
          </div>

          <style jsx>{`
            .container {
              display: inline-block;
              border-radius: ${theme.size.radius.default};
              margin: ${theme.space.s} ${theme.space.default} ${theme.space.s} 0;
              box-shadow: 0px 3px 9px -5px rgba(0, 0, 0, 0.3);
              box-shadow: var(--shadow);
              width: ${`calc(100% - ${theme.space.default} * 2)`};
              white-space: normal;
              vertical-align: top;
              scroll-snap-align: start;
            }

            .taglist {
              display: block;
              padding: ${theme.space.s};
            }

            h3 {
              padding: ${theme.space.inset.s};
              font-size: ${theme.font.size.s};
            }

            a {
              color: var(--textNormal);
            }

            p {
              padding: 0 ${theme.space.inset.s} ${theme.space.inset.s};
              font-size: ${theme.font.size.xxs};
            }

            span {
              align-items: center;
              display: flex;
              padding: 0 ${theme.space.inset.s} ${theme.space.inset.s};
              font-size: ${theme.font.size.xxs};
            }

            @above tablet {
              .container {
                display: inline-flex;
                flex-direction: column;
                align-self: flex-start;
                justify-content: flex-start;
                width: ${`calc(${theme.text.maxWidth.tablet} * 0.5 - ${theme.space.default} * 2)`};
              }

              .container:last-child {
                margin-right: 0;
              }
            }

            @above desktop {
              .container {
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
