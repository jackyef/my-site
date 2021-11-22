interface Props {
  query: string;
  userSubmittedQuery: string;
}

export const HighlightedQuery = ({ query, userSubmittedQuery }: Props) => {
  const words = userSubmittedQuery.split(' ').join('|');

  const __html = query.replace(
    new RegExp(`(${words})`, 'gi'),
    '<span class="font-extrabold">$1</span>',
  );

  return <span dangerouslySetInnerHTML={{ __html }} />;
};
