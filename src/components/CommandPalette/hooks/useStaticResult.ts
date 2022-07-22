import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { PageData } from '../../../../types/types';
import { filterValidQueries, Query } from '../constants/actions';
import { filterExternalLinks } from '../constants/externalLinks';
import { filterPages } from '../constants/pages';

type Params = {
  query: string;
};

export const useStaticResult = ({ query }: Params) => {
  const router = useRouter();
  const [actionQueries, setActionQueries] = useState<Query[]>([]);
  const [pageSearchResult, setPageSearchResult] = useState<PageData[]>([]);
  const [externalLinkResult, setExternalLinkResult] = useState<PageData[]>([]);

  const reset = useCallback(() => {
    setActionQueries([]);
    setPageSearchResult([]);
    setExternalLinkResult([]);
  }, []);

  useEffect(() => {
    if (query) {
      setActionQueries(query ? filterValidQueries(query, router) : []);
      setPageSearchResult(query ? filterPages(query) : []);
      setExternalLinkResult(query ? filterExternalLinks(query) : []);
    } else {
      reset();
    }
  }, [query, reset, router]);

  return {
    actionQueries,
    pageSearchResult,
    externalLinkResult,
  };
};
