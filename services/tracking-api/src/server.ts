import http from 'node:http';
import { db } from '@tracker-platform/database/client';
import { createProject, listProjects } from './routes/projects.js';
import { getProjectAnalytics } from './routes/analytics.js';

const port = Number(process.env.PORT || 4000);
const maxBodyBytes = 128 * 1024;
function json(res: http.ServerResponse, status: number, body: unknown) { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(body)); }
async function readBody(req: http.IncomingMessage): Promise<string> { const chunks: Buffer[] = []; let size = 0; for await (const chunk of req) { const b = Buffer.from(chunk); size += b.length; if (size > maxBodyBytes) throw new Error('body_too_large'); chunks.push(b); } return Buffer.concat(chunks).toString('utf8'); }

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'POST,GET,OPTIONS', 'access-control-allow-headers': 'content-type' }); return res.end(); }
  if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true, service: 'tracking-api' });
  if (req.method === 'GET' && req.url === '/v1/projects') { try { return json(res, 200, { projects: await listProjects() }); } catch { return json(res, 500, { error: 'database_error' }); } }
  if (req.method === 'POST' && req.url === '/v1/projects') { try { const body = JSON.parse(await readBody(req)); if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 100) return json(res, 400, { error: 'invalid_name' }); return json(res, 201, { project: await createProject(body.name) }); } catch (e) { if (e instanceof Error && e.message === 'body_too_large') return json(res, 413, { error: 'body_too_large' }); return json(res, 500, { error: 'database_error' }); } }
  const analytics = req.url?.match(/^\/v1\/projects\/([^/]+)\/analytics(?:\?days=(\d+))?$/);
  if (req.method === 'GET' && analytics) { try { const days = Math.min(Number(analytics[2] || 7), 90); return json(res, 200, await getProjectAnalytics(analytics[1], days)); } catch { return json(res, 500, { error: 'analytics_error' }); } }
  if (req.method === 'POST' && req.url === '/v1/events') {
    try {
      const event = JSON.parse(await readBody(req)); const context = event.context;
      if (!event.projectKey || !event.name || !event.eventId || !context?.visitorId || !context?.sessionId) return json(res, 400, { error: 'invalid_event' });
      const project = await db.project.findUnique({ where: { publicKey: event.projectKey } }); if (!project || !project.active) return json(res, 401, { error: 'invalid_project' });
      const visitor = await db.visitor.upsert({ where: { id: context.visitorId }, create: { id: context.visitorId, projectId: project.id }, update: { lastSeen: new Date() } });
      await db.session.upsert({ where: { id: context.sessionId }, create: { id: context.sessionId, projectId: project.id, visitorId: visitor.id, landingUrl: context.pageUrl, referrer: context.referrer, utmSource: context.utmSource, utmMedium: context.utmMedium, utmCampaign: context.utmCampaign, utmContent: context.utmContent, utmTerm: context.utmTerm, gclid: context.gclid, fbclid: context.fbclid }, update: { endedAt: null } });
      await db.event.create({ data: { id: event.eventId, projectId: project.id, visitorId: visitor.id, sessionId: context.sessionId, name: event.name, occurredAt: new Date(event.occurredAt || Date.now()), pageUrl: context.pageUrl, referrer: context.referrer, properties: event.properties || undefined } });
      return json(res, 202, { accepted: true, eventId: event.eventId });
    } catch (e) { if (e instanceof Error && e.message === 'body_too_large') return json(res, 413, { error: 'body_too_large' }); console.error(e); return json(res, 400, { error: 'invalid_event' }); }
  }
  return json(res, 404, { error: 'not_found' });
});
server.listen(port, () => console.log(`tracking-api listening on :${port}`));
