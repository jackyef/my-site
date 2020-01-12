import React from 'react';
import { ThemeContext } from '../../layouts';

const MediumPostCard = ({ title, timeToRead, coverImage, url }) => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <div>
            <img src={coverImage} alt={title} />
            <h3>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
              </a>{' '}
            </h3>
            <span>{timeToRead}</span>
          </div>

          <style jsx>{`
            div {
              display: inline-block;
              border-radius: ${theme.size.radius.default};
              margin: ${theme.space.default} 0;
              box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
              width: 100%;
              white-space: normal;
              vertical-align: top;
            }

            img {
              width: 100%;
              border-radius: ${theme.size.radius.default} ${theme.size.radius.default} 0 0;
              height: 205px;
              object-fit: contain;
            }

            h3 {
              padding: ${theme.space.inset.s};
              font-size: ${theme.font.size.s};
            }

            h3 > a {
              color: ${theme.color.neutral.black};
            }

            span {
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
                margin-right: ${theme.space.default};
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

export default MediumPostCard;
