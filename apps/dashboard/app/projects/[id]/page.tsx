'use client';
import { useEffect, useState } from 'react';

type A = { periodDays:number; visitors:number; sessions:number; events:number; orders:number; revenue:number };
export default function ProjectDashboard({ params }: { params: Promise<{ id:string }> }) {
  const [id,setId]=useState(''); const [a,setA]=useState<A|null>(null); const [error,setError]=useState('');
  useEffect(()=>{ params.then(p=>{setId(p.id); return fetch(`/api/projects/${p.id}/analytics?days=7`)}).then(async r=>{const d=await r.json(); if(!r.ok) throw new Error(d.error); setA(d)}).catch(()=>setError('Não foi possível carregar as métricas.')); },[params]);
  const money=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  return <main className="project-dashboard"><header><div><p className="eyebrow">PROJETO</p><h1>Analytics</h1><p>ID: {id || 'carregando...'}</p></div><a href="/projects">← Projetos</a></header><div className="period">Últimos 7 dias</div>{error?<div className="error-box">{error}</div>:!a?<div className="loading">Carregando métricas...</div>:<><section className="metric-grid">{[['Visitantes',a.visitors],['Sessões',a.sessions],['Eventos',a.events],['Pedidos',a.orders],['Faturamento',money(a.revenue)],['Conversão',a.sessions?`${((a.orders/a.sessions)*100).toFixed(2)}%`:'0,00%']].map(([n,v])=><article key={String(n)}><span>{n}</span><strong>{v}</strong></article>)}</section><section className="panel"><p className="eyebrow">STATUS</p><h2>Tracking conectado ao banco</h2><p>Os eventos recebidos pelo Tracker são contabilizados neste projeto. A próxima camada será detalhar campanhas, UTMs e atribuição por conversão.</p></section></>}</main>;
}
