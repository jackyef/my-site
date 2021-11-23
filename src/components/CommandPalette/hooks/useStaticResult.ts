import { useEffect, useState } from 'react';
import { PageData } from '../../../../types/types';

import { filterValidQueries, Query } from '../constants/actions';
import { filterExternalLinks } from '../constants/externalLinks';
import { filterPages } from '../constants/pages';

type Params = {
  query: string;
};

export const useStaticResult = ({ query }: Params) => {
  const [actionQueries, setActionQueries] = useState<Query[]>([]);
  const [pageSearchResult, setPageSearchResult] = useState<PageData[]>([]);
  const [externalLinkResult, setExternalLinkResult] = useState<PageData[]>([]);

  useEffect(() => {
    if (query) {
      setActionQueries(query ? filterValidQueries(query) : []);
      setPageSearchResult(query ? filterPages(query) : []);
      setExternalLinkResult(query ? filterExternalLinks(query) : []);
    }
  }, [query]);

  return {
    actionQueries,
    pageSearchResult,
    externalLinkResult,
  };
};
