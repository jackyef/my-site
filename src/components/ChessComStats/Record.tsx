import { MinusSquareIcon, PlusSquareIcon, SquareEqualIcon } from 'lucide-react';

type Props = {
  title: string;
  label: string;
  counts: {
    win: number;
    draw: number;
    loss: number;
  };
};

export const Record = ({
  title,
  label,
  counts: { win, draw, loss },
}: Props) => {
  return (
    <dl>
      <dt
        aria-label={label}
        className="text-sm font-light uppercase tracking-wider text-(--color-ink-3)"
      >
        {title}
      </dt>
      <dd className="flex gap-2 text-lg font-bold">
        <div className="flex gap-1 items-center text-(--color-success)">
          <span className="font-light">
            <PlusSquareIcon size={16} />
          </span>
          {win}
        </div>
        <div className="flex gap-1 items-center text-(--color-ink-3)">
          <span className="font-light">
            <SquareEqualIcon size={16} />
          </span>
          {draw}
        </div>
        <div className="flex gap-1 items-center text-(--color-danger)">
          <span className="font-light">
            <MinusSquareIcon size={16} />
          </span>
          {loss}
        </div>
      </dd>
    </dl>
  );
};
