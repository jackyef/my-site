interface Props {
  renderer: () => string;
}

/**
 * This component is used to render the returned string of a function in MDX files
 */
export const FunctionRenderer = ({ renderer }: Props) => {
  return <>{renderer()}</>;
};
