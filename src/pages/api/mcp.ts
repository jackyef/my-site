import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { buildMcpServer } from '@/lib/mcp/server';

/**
 * MCP endpoint (Streamable HTTP) served from the Pages Router.
 *
 * The SDK's StreamableHTTPServerTransport is built against Node's
 * IncomingMessage/ServerResponse, which is exactly what a Pages Router API
 * route provides — so no Web-Request adapter (`mcp-handler`) is needed here.
 *
 * Runs stateless: a fresh server + transport per request, no session store.
 *
 * This endpoint is public — there is no authentication. Everything it exposes
 * is either static or an ephemeral in-memory list that is capped and wiped on
 * restart, so the blast radius is small. Add a token check before wiring it to
 * anything durable.
 */

function sendJsonRpcError(
  res: NextApiResponse,
  status: number,
  code: number,
  message: string,
) {
  res.status(status).json({
    jsonrpc: '2.0',
    error: { code, message },
    id: null,
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Stateless mode: no SSE stream to resume and no session to delete. Answer
  // GET/DELETE explicitly so clients get a clear signal instead of a hang.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');

    return sendJsonRpcError(
      res,
      405,
      -32000,
      `${req.method} is not supported: this server runs in stateless mode.`,
    );
  }

  const server = buildMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    // Plain JSON responses rather than an SSE stream: simpler, and it avoids
    // long-lived connections on serverless.
    enableJsonResponse: true,
  });

  // Release the per-request server/transport once the response is done.
  res.on('close', () => {
    void transport.close();
    void server.close();
  });

  try {
    await server.connect(transport);

    // Next has already parsed the JSON body, so hand it over directly instead
    // of letting the transport re-read an exhausted stream.
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('[mcp] request failed:', error);

    if (!res.headersSent) {
      sendJsonRpcError(res, 500, -32603, 'Internal server error');
    }
  }
}
