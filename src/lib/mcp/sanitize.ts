/**
 * Input hardening for MCP tool arguments.
 *
 * These values arrive "from Claude", but Claude may be relaying content it read
 * from a webpage, an email, or another tool's output. Treat every argument as
 * untrusted user input from the open internet.
 */

// Matches anything that looks like an HTML/XML tag, including unclosed ones.
const HTML_TAG = /<[^>]*>?/g;

// C0/C1 control characters are invisible in most renderers but can break log
// parsing and terminal output. Tab (0x09) and newline (0x0A) are kept.
// Expressed as codepoint ranges rather than a regex character class so the
// source stays free of literal control bytes.
function isControlChar(code: number): boolean {
  return (
    code <= 0x08 ||
    code === 0x0b ||
    code === 0x0c ||
    (code >= 0x0e && code <= 0x1f) ||
    code === 0x7f
  );
}

function stripControlChars(input: string): string {
  const out: string[] = [];

  for (const char of input) {
    const code = char.codePointAt(0);

    if (code === undefined || !isControlChar(code)) {
      out.push(char);
    }
  }

  return out.join('');
}

/**
 * Reduces a string to inert plain text.
 *
 * Note: this deliberately does NOT HTML-escape the result. The stored value is
 * plain text, and React escapes on render. Escaping here as well would produce
 * visible `&lt;` double-escaping downstream. Safety instead comes from removing
 * every `<` and `>`, so the stored string can never re-form an HTML tag no
 * matter where it is interpolated.
 */
export function toPlainText(input: string): string {
  return (
    stripControlChars(input)
      .replace(HTML_TAG, '')
      // Any angle brackets that survived tag-stripping (e.g. a bare `<`) are
      // dropped too, so no consumer can reconstruct markup from this value.
      .replace(/[<>]/g, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  );
}

/**
 * True when the URL parses and uses a protocol that is safe to render as a
 * link. Blocks `javascript:`, `data:`, `vbscript:` and friends.
 */
export function isSafeHttpUrl(value: string): boolean {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  return parsed.protocol === 'http:' || parsed.protocol === 'https:';
}
