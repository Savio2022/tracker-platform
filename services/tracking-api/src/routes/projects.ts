import { randomBytes } from 'node:crypto';
import { db } from '@tracker-platform/database/client';

export async function createProject(name: string) {
  const publicKey = `tp_${randomBytes(18).toString('hex')}`;
  return db.project.create({ data: { name: name.trim(), publicKey } });
}

export async function listProjects() {
  return db.project.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, publicKey: true, active: true, createdAt: true }
  });
}
