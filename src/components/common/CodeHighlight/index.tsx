import { Fragment, type ReactNode } from 'react';

import { Prism, type SnippetLanguage } from '@/lib/prism';
import { prismTokenMap } from '@/lib/prismTokenMap';

type PrismToken = ReturnType<typeof Prism.tokenize>[number];

/**
 * Prism gives a token a `type` plus optional `alias`es. The alias is often the
 * more specific one (a `class-name` aliased from `class-name` inside tsx, say),
 * so prefer whichever the map actually knows about.
 */
function classFor(token: Exclude<PrismToken, string>): string {
  const aliases =
    typeof token.alias === 'string' ? [token.alias] : (token.alias ?? []);

  for (const name of [...aliases, token.type]) {
    const cls = prismTokenMap[name as keyof typeof prismTokenMap];
    if (cls) return cls;
  }

  return '';
}

function render(tokens: PrismToken[], keyPrefix = ''): ReactNode[] {
  return tokens.map((token, i) => {
    const key = `${keyPrefix}${i}`;

    if (typeof token === 'string') {
      return <Fragment key={key}>{token}</Fragment>;
    }

    const { content } = token;
    const children: ReactNode = Array.isArray(content)
      ? render(content as PrismToken[], `${key}-`)
      : typeof content === 'string'
        ? content
        : render([content as PrismToken], `${key}-`);

    return (
      <span key={key} className={classFor(token)}>
        {children}
      </span>
    );
  });
}

/**
 * Colours a code string with the same tokenizer and the same `--code-*` classes
 * the blog's build-time highlighting uses, so a snippet here and a code block in
 * a post are coloured by one system rather than two.
 *
 * Returns React elements rather than an HTML string — no dangerouslySetInnerHTML,
 * and no regex pass over the markup to swap class names in.
 */
export function highlight(code: string, lang: SnippetLanguage): ReactNode {
  const grammar = Prism.languages[lang] ?? Prism.languages.javascript;

  return render(Prism.tokenize(code, grammar));
}
