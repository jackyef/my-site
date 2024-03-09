import { ChevronRightIcon } from 'lucide-react';

import { InternalLink } from '@/components/Typography/InternalLink';

type Page = { name: string; href: string; current?: boolean };

type Props = {
  pages?: Page[];
};

export default function Breadcrumbs({ pages = [] }: Props) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        {pages.map((page, index) => (
          <li key={page.name}>
            <div className="flex items-center">
              {index !== 0 && (
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-theme-subtitle"
                  aria-hidden="true"
                />
              )}
              <InternalLink
                href={page.href}
                isNotFancy
                className="ml-4 text-sm font-medium text-theme-subtitle hover:text-theme-heading"
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </InternalLink>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
