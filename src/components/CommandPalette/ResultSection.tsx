import { PageData } from '../../../types/types';

import { Action } from './Actions/Action';
import { Query } from './constants/actions';
import { ResultSectionHeading } from './ResultSectionHeading';
import { ResultSectionSeparator } from './ResultSectionSeparator';

interface CommonProps {
  heading: string;
  query: string;
  onResultClick?: () => void;
}

interface PageResultProps extends CommonProps {
  results: PageData[];
  type: 'navigation';
}

interface ExternalLinkResultProps extends CommonProps {
  results: PageData[];
  type: 'navigation-external';
}

interface ActionResultProps extends CommonProps {
  results: Query[];
  type: 'action';
}

type Props = PageResultProps | ExternalLinkResultProps | ActionResultProps;

export const ResultSection = (props: Props) => {
  const { heading, onResultClick } = props;
  const hasResults = props.results.length > 0;

  const renderResults = () => {
    if (props.type === 'action') {
      const { results, query, type } = props;

      return results.map((item) => {
        return (
          <Action
            key={item}
            query={item}
            userSubmittedQuery={query}
            onClick={onResultClick}
            type={type}
          />
        );
      });
    } else {
      const { results, query, type } = props;

      return results.map((item) => {
        return (
          <Action
            key={item.link}
            query={item.title}
            href={item.link}
            description={item.description}
            userSubmittedQuery={query}
            onClick={onResultClick}
            type={type}
          />
        );
      });
    }
  };

  return (
    <>
      {hasResults && <ResultSectionHeading>{heading}</ResultSectionHeading>}
      {renderResults()}
      {hasResults && <ResultSectionSeparator />}
    </>
  );
};
