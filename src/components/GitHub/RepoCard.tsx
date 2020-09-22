import React from 'react';
import Tag from '../common/Tag';
import { ExternalLink } from '../Typography/ExternalLink';

interface Props {
  title: string;
  description: string;
  starCount?: number;
  url: string;
  tags: string[];
}

const GitHubRepoCard = ({
  title,
  description,
  starCount = 0,
  url,
  tags = [],
}: Props) => {
  return (
    <>
      <div 
       className="inline-block relative rounded-md mx-2 mt-4 mb-0 shadow-md whitespace-normal align-top last:mr-0 md:inline-flex md:flex-col md:self-start md:content-start md:w-60 max-w-sm scroll-snap-align-start"
       style={{
          width: `calc(100% - 1rem * 2)`,
        }}  
      >
        <h3 className="px-4 py-2 text-lg font-bold">
          <ExternalLink href={url} className="text-gray-900">
            {title}
          </ExternalLink>{' '}
        </h3>
        <p className="px-4 py-2 pt-0 text-sm">{description}</p>
        {tags.length ? (
          <div className="px-4 py-2">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}
        {starCount > 0 ? <span className="items-center flex p-2 pt-0 text-xs">{starCount} stars</span> : null}
      </div>
    </>
  );
};

export default GitHubRepoCard;
