interface Props {
  value?: number;
}

export const ProgressBar = ({ value = 0 }: Props) => {
  const ariaProps = {
    'aria-valuemax': 100,
    'aria-valuemin': 0,
    'aria-valuenow': value || 0,
  };

  return (
    <div
      className="overflow-hidden h-2 text-xs flex w-full rounded bg-theme-background"
      role="progressbar"
      {...ariaProps}
    >
      <div
        style={{
          width: `${value || 0}%`,
          willChange: 'width',
        }}
        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-theme-link"
      ></div>
    </div>
  );
};
