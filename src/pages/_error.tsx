import { NextPage } from 'next';

import { Error404View } from '@/components/ErrorView/Error404View';
import { ErrorView } from '@/components/ErrorView/ErrorView';

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
  if (statusCode === 404) {
    return <Error404View />;
  }

  return <ErrorView />;
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode };
};

export default Error;
