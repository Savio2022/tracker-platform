import http from 'node:http';
import { randomUUID } from 'node:crypto';

const port = Number(process.env.PORT || 4000);

function json(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readBody(req: http.IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return json(res, 200, { ok: true, service: 'tracking-api' });
  }

  if (req.method === 'POST' && req.url === '/v1/events') {
    try {
      const raw = await readBody(req);
      const event = JSON.parse(raw);
      if (!event.projectKey || !event.name || !event.eventId) {
        return json(res, 400, { error: 'invalid_event' });
      }

      // TODO: persist event with Prisma after database bootstrap.
      console.log(JSON.stringify({ receivedAt: new Date().toISOString(), event }));
      return json(res, 202, { accepted: true, eventId: event.eventId || randomUUID() });
    } catch {
      return json(res, 400, { error: 'invalid_json' });
    }
  }

  return json(res, 404, { error: 'not_found' });
});

server.listen(port, () => {
  console.log(`tracking-api listening on :${port}`);
});
