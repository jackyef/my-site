import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { addEntry, getEntries, getEntryCount } from './guestbook';
import { isSafeHttpUrl, toPlainText } from './sanitize';

export const SERVER_NAME = 'jackyef-site';
export const SERVER_VERSION = '1.0.0';

const ABOUT = {
  name: 'Jacky Efendi',
  title: 'Senior Software Engineer',
  site: 'https://jackyef.com',
  focus: [
    'Web platform and performance',
    'Frontend architecture',
    'Design engineering',
  ],
} as const;

const ABOUT_TEXT = [
  `${ABOUT.name} — ${ABOUT.title}`,
  `Site: ${ABOUT.site}`,
  `Focus: ${ABOUT.focus.join(', ')}`,
].join('\n');

function textResult(text: string, isError = false) {
  return {
    content: [{ type: 'text' as const, text }],
    ...(isError ? { isError: true } : {}),
  };
}

export function buildMcpServer(): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: { tools: {}, resources: {} },
      instructions:
        'Tools for jackyef.com. Use `about` for background on Jacky, ' +
        '`sign_guestbook` to leave a public note, and `get_guestbook` to read ' +
        'recent notes.',
    },
  );

  server.registerResource(
    'about',
    'https://jackyef.com/about',
    {
      title: 'About Jacky Efendi',
      description: 'Static background information about the site owner.',
      mimeType: 'text/plain',
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: 'text/plain', text: ABOUT_TEXT }],
    }),
  );

  server.registerTool(
    'about',
    {
      title: 'About Jacky',
      description: 'Returns static background information about Jacky Efendi.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => textResult(ABOUT_TEXT),
  );

  server.registerTool(
    'echo',
    {
      title: 'Echo',
      description:
        'Returns the provided message unchanged. Useful for testing.',
      inputSchema: {
        message: z.string().max(2000).describe('Text to echo back'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ message }) => textResult(message),
  );

  server.registerTool(
    'sign_guestbook',
    {
      title: 'Sign the guestbook',
      description:
        'Adds a short public note to the guestbook. Input is sanitized to ' +
        'plain text before it is stored.',
      inputSchema: {
        name: z
          .string()
          .trim()
          .min(1, 'name is required')
          .max(80, 'name must be 80 characters or fewer')
          .describe('Display name of the signer'),
        message: z
          .string()
          .trim()
          .min(1, 'message is required')
          .max(500, 'message must be 500 characters or fewer')
          .describe('The note to leave'),
        url: z
          .string()
          .trim()
          .max(2048)
          .refine(isSafeHttpUrl, 'url must be a valid http(s) URL')
          .optional()
          .describe('Optional link to the signer’s site'),
      },
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false,
      },
    },
    async ({ name, message, url }) => {
      // Validation already guaranteed non-empty input, but sanitizing can empty
      // a string that was entirely markup (e.g. "<script></script>"). Reject
      // rather than store a blank entry.
      const safeName = toPlainText(name);
      const safeMessage = toPlainText(message);

      if (!safeName || !safeMessage) {
        return textResult(
          'After removing markup there was no text left to store. ' +
            'Please provide a plain-text name and message. Nothing was saved.',
          true,
        );
      }

      const entry = addEntry({
        name: safeName,
        message: safeMessage,
        url,
        timestamp: new Date().toISOString(),
      });

      const wasSanitized = safeName !== name || safeMessage !== message;

      return textResult(
        [
          `Thanks ${entry.name}, your note was added to the guestbook.`,
          wasSanitized
            ? 'Note: markup was stripped, so the stored text differs from what you sent.'
            : null,
          '',
          `Stored: "${entry.message}"`,
          entry.url ? `Link: ${entry.url}` : null,
          `At: ${entry.timestamp}`,
          `Total entries: ${getEntryCount()}`,
        ]
          .filter(Boolean)
          .join('\n'),
      );
    },
  );

  server.registerTool(
    'get_guestbook',
    {
      title: 'Read the guestbook',
      description: 'Returns recent guestbook entries, newest first.',
      inputSchema: {
        limit: z
          .number()
          .int()
          .min(1)
          .max(100)
          .default(20)
          .describe('How many entries to return (1-100, default 20)'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ limit }) => {
      const recent = getEntries(limit ?? 20);

      if (recent.length === 0) {
        return textResult('The guestbook is empty. Be the first to sign it.');
      }

      const rendered = recent
        .map((entry, index) => {
          const header = `${index + 1}. ${entry.name}${
            entry.url ? ` (${entry.url})` : ''
          } — ${entry.timestamp}`;

          return `${header}\n   ${entry.message}`;
        })
        .join('\n\n');

      return textResult(
        `${recent.length} most recent entr${
          recent.length === 1 ? 'y' : 'ies'
        }:\n\n${rendered}`,
      );
    },
  );

  return server;
}
