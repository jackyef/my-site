import { useUrlMetadata } from './useUrlMetadata';

interface Props {
  href: string;
}

export const LinkPreview = ({ href }: Props) => {
  const { data, isLoading, isError } = useUrlMetadata(href);

  if (!data || isLoading || isError) return null;

  return (
    <span
      className="flex flex-col gap-2 w-[300px] max-w-full mx-auto rounded-2xl p-3 bg-(--color-bg-panel) shadow-md text-sm font-normal animate-[pop-in_0.3s_both]"
      style={{
        transformOrigin: 'var(--radix-tooltip-content-transform-origin)',
      }}
    >
      {Boolean(data.image) && (
        <img
          src={data.image}
          alt={String(data.title || data.siteName || '')}
          className="rounded-lg h-[150px] object-contain w-full mb-0.5"
          height={150}
        />
      )}
      <span className="text-[14px] font-bold text-(--color-ink)">
        {data.title}
      </span>
      <span className="text-(--color-ink-3)">{data.description}</span>
    </span>
  );
};
