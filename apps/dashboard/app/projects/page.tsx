'use client';

import { useEffect, useState } from 'react';

type Project = { id: string; name: string; publicKey: string; active: boolean; createdAt: string };

export default function ProjectsPage() {
  const [name, setName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [created, setCreated] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try { const r = await fetch('/api/projects'); const d = await r.json(); if (!r.ok) throw new Error(d.error); setProjects(d.projects || []); }
    catch { setError('Não foi possível carregar os projetos.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function createProject() {
    if (!name.trim() || saving) return;
    setSaving(true); setError('');
    try {
      const r = await fetch('/api/projects', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCreated(d.project); setName(''); await load();
    } catch { setError('Não foi possível criar o projeto. Verifique a API e o banco.'); }
    finally { setSaving(false); }
  }

  return <main className="projects-page">
    <div className="projects-header"><div><p className="eyebrow">CONFIGURAÇÃO</p><h1>Projetos</h1><p>Separe cada oferta, site ou operação em um projeto independente.</p></div></div>
    <section className="project-card"><h2>Novo projeto</h2><p>A chave pública é gerada no servidor e persistida no PostgreSQL.</p><div className="form-row"><input value={name} onChange={e => setName(e.target.value)} placeholder="Ex.: Camisa Patriota" onKeyDown={e => e.key === 'Enter' && createProject()} /><button className="primary" onClick={createProject}>{saving ? 'Criando...' : 'Criar projeto'}</button></div>{error && <p className="error">{error}</p>}</section>
    {created && <section className="project-card success"><p className="eyebrow">PROJETO CRIADO</p><h2>{created.name}</h2><p>Chave pública:</p><code>{created.publicKey}</code><div className="install"><strong>Instalação</strong><pre>{`<script src="https://SEU-DOMINIO/tracker.js" data-project="${created.publicKey}"></script>`}</pre></div></section>}
    <section className="project-card"><p className="eyebrow">PROJETOS CADASTRADOS</p><h2>Seus projetos</h2>{loading ? <p>Carregando...</p> : projects.length === 0 ? <p>Nenhum projeto criado ainda.</p> : <div className="project-list">{projects.map(p => <div className="project-item" key={p.id}><div><strong>{p.name}</strong><small>{p.publicKey}</small></div><span>{p.active ? 'Ativo' : 'Inativo'}</span></div>)}</div>}</section>
  </main>;
}
