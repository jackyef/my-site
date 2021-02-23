import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { getQueryParam } from '@/utils/getQueryParam';
import { SectionTitle } from '@/components/Typography/SectionTitle';
import { Paragraph } from '@/components/Typography/Paragraph';

type Props = {
  statusCode: number;
  errorMessage?: string;
};

export const ErrorPage: NextPage<Props> = ({ statusCode, errorMessage }) => {
  const { query } = useRouter();
  const isDebugging = Boolean(getQueryParam(query, 'debug')); // add ?debug=1 to show errorMessage

  return (
    <div>
      <SectionTitle>Whoops, seems like you found an error!</SectionTitle>
      <Paragraph>Error code: {statusCode}</Paragraph>
      {isDebugging && errorMessage && (
        <div>
          <pre>{errorMessage}</pre>
        </div>
      )}
    </div>
  );
};

ErrorPage.getInitialProps = ({ err, query }) => {
  // Used if a page throws an error during SSR
  // Reference: https://nextjs.org/docs/advanced-features/custom-error-page
  const errStatusCode = err?.statusCode;
  const errorMessage = err?.message;

  // Used when rendered as regular Next.js page
  const queryStatusCode = getQueryParam(query, 'statusCode')
    ? Number(getQueryParam(query, 'statusCode'))
    : null;

  const statusCode = errStatusCode ?? queryStatusCode ?? 500;

  return {
    statusCode,
    errorMessage,
  };
};

export default ErrorPage;
