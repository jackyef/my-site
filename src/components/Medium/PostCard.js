import React from 'react';
import { ThemeContext } from '../../layouts';
import Image from '../Image';
import MediumLogo from '!svg-react-loader!../../images/svg-icons/medium.svg?name=MediumLogo';

const MediumPostCard = ({ title, timeToRead, coverImage, url }) => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <div className="container">
            <Image
              src={coverImage}
              alt={title}
              width="100%"
              height="300px"
              style={{
                borderRadius: `${theme.size.radius.default} ${theme.size.radius.default}`,
                objectFit: `cover`,
              }}
            />
            <div className="meta">
              <h3>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {title}
                </a>{' '}
              </h3>
              <span>
                <MediumLogo width={theme.font.size.s} height={theme.font.size.s} />&nbsp;&middot;{' '}
                {timeToRead}
              </span>
            </div>
          </div>

          <style jsx>{`
            .container {
              display: inline-block;
              position: relative;
              border-radius: ${theme.size.radius.default};
              margin: ${theme.space.s} ${theme.space.default} ${theme.space.s} 0;
              box-shadow: 0px 3px 9px -5px rgba(0, 0, 0, 0.3);
              width: ${`calc(100% - ${theme.space.default} * 2)`};
              white-space: normal;
              vertical-align: top;
              scroll-snap-align: start;
            }

            .meta {
              position: absolute;
              padding-top: ${theme.space.default};
              bottom: 0;
              background: linear-gradient(0deg, rgba(8, 8, 8, 0.9), rgba(8, 8, 8, 0.01));
              border-radius: 0 0 ${theme.size.radius.default} ${theme.size.radius.default};
              width: 100%;
            }

            h3 {
              padding: ${theme.space.inset.s};
              font-size: ${theme.font.size.s};
            }

            h3 > a {
              color: ${theme.color.neutral.gray.a};
              text-shadow: 0px 0px 5px #333;
            }

            span {
              align-items: center;
              display: flex;
              padding: 0 ${theme.space.inset.s} ${theme.space.inset.s};
              font-size: ${theme.font.size.xxs};
              color: ${theme.color.neutral.gray.e};
            }

            @above tablet {
              .container {
                display: inline-flex;
                flex-direction: column;
                align-self: flex-start;
                justify-content: flex-start;
                width: ${`calc(${theme.text.maxWidth.tablet} * 0.6)`};
              }

              .container:last-child {
                margin-right: 0;
              }
            }

            @above desktop {
              .container {
                width: ${`calc(${theme.text.maxWidth.desktop} * 0.6)`};
              }
            }
          `}</style>
        </React.Fragment>
      )}
    </ThemeContext.Consumer>
  );
};

export default MediumPostCard;
