import React from 'react';
import { ThemeContext } from '../../layouts';
import Image from '../Image';
import MediumLogo from '!svg-react-loader!../../images/svg-icons/medium.svg?name=MediumLogo';

const MediumPostCard = ({ title, timeToRead, coverImage, url }) => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <React.Fragment>
          <div>
            <Image
              src={coverImage}
              alt={title}
              width="100%"
              height="205px"
              style={{
                borderRadius: `${theme.size.radius.default} ${theme.size.radius.default} 0 0`,
                objectFit: `cover`,
              }}
            />
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

          <style jsx>{`
            div {
              display: inline-block;
              border-radius: ${theme.size.radius.default};
              margin: ${theme.space.s} ${theme.space.default} ${theme.space.s} 0;
              box-shadow: 0px 3px 9px -5px rgba(0, 0, 0, 0.3);
              width: ${`calc(100% - ${theme.space.default} * 2)`};
              white-space: normal;
              vertical-align: top;
            }

            h3 {
              padding: ${theme.space.inset.s};
              font-size: ${theme.font.size.s};
            }

            h3 > a {
              color: ${theme.color.neutral.black};
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

export default MediumPostCard;
