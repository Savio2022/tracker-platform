'use client';

import { useState } from 'react';

function makeKey() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return 'tp_' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export default function ProjectsPage() {
  const [name, setName] = useState('');
  const [project, setProject] = useState<{ name: string; key: string } | null>(null);

  function createProject() {
    if (!name.trim()) return;
    setProject({ name: name.trim(), key: makeKey() });
    setName('');
  }

  return <main className="projects-page">
    <div className="projects-header"><div><p className="eyebrow">CONFIGURAÇÃO</p><h1>Projetos</h1><p>Separe cada oferta, site ou operação em um projeto independente.</p></div></div>
    <section className="project-card">
      <h2>Novo projeto</h2>
      <p>O projeto recebe uma chave pública usada pelo Tracker JavaScript.</p>
      <div className="form-row"><input value={name} onChange={e => setName(e.target.value)} placeholder="Ex.: Camisa Patriota" onKeyDown={e => e.key === 'Enter' && createProject()} /><button className="primary" onClick={createProject}>Criar projeto</button></div>
    </section>
    {project && <section className="project-card success"><div><p className="eyebrow">PROJETO CRIADO</p><h2>{project.name}</h2><p>Guarde esta chave. Ela identifica seu projeto no Tracker.</p></div><code>{project.key}</code><div className="install"><strong>Instalação</strong><pre>{`<script src="https://SEU-DOMINIO/tracker.js" data-project="${project.key}"></script>`}</pre></div></section>}
    <section className="project-card"><p className="eyebrow">ESTADO ATUAL</p><h2>Gerenciamento de projetos</h2><p>Esta primeira tela cria a identidade do projeto no navegador. Na próxima etapa, o formulário será conectado ao PostgreSQL e a chave será persistida no banco.</p></section>
  </main>;
}
