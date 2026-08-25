import { db } from '@tracker-platform/database/client';

export async function getProjectAnalytics(projectId: string, days = 7) {
  const since = new Date(Date.now() - days * 86400000);
  const [visitors, sessions, events, orders, revenue] = await Promise.all([
    db.visitor.count({ where: { projectId, firstSeen: { gte: since } } }),
    db.session.count({ where: { projectId, startedAt: { gte: since } } }),
    db.event.count({ where: { projectId, occurredAt: { gte: since } } }),
    db.order.count({ where: { projectId, occurredAt: { gte: since }, status: 'paid' } }),
    db.order.aggregate({ where: { projectId, occurredAt: { gte: since }, status: 'paid' }, _sum: { amount: true } })
  ]);
  return { periodDays: days, visitors, sessions, events, orders, revenue: Number(revenue._sum.amount || 0) };
}
