import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createAvenaServer } from '@/mcp/server';

export const dynamic = 'force-dynamic';

// Stateless MCP transport — each request is self-contained
// No session management needed for read-only property data
async function handleMcpRequest(req: Request): Promise<Response> {
  const server = createAvenaServer();

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
    enableJsonResponse: true,      // JSON responses instead of SSE
  });

  await server.connect(transport);

  try {
    const response = await transport.handleRequest(req);
    return response;
  } catch (error) {
    console.error('MCP request error:', error);
    return new Response(
      JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' } }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(req: Request) {
  return handleMcpRequest(req);
}

export async function GET() {
  return new Response(
    JSON.stringify({
      name: 'avena-terminal',
      version: '1.0.0',
      description: "Avena Terminal MCP Server — Live scored data for 1,881 new build properties in Spain. Search, filter, and analyze properties by investment score, rental yield, region, and price.",
      tools: ['search_properties', 'get_property', 'get_market_stats', 'get_top_deals'],
      documentation: 'https://avenaterminal.com/mcp-server',
      source: 'https://avenaterminal.com',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
  );
}

export async function DELETE() {
  return new Response(null, { status: 405 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, mcp-session-id, mcp-protocol-version',
    },
  });
}
