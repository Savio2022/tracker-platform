const metrics = [
  ['Visitantes', '0', 'Nenhum evento recebido ainda'],
  ['Sessões', '0', 'Aguardando tráfego'],
  ['Eventos', '0', 'Tracker pronto para conexão'],
  ['Vendas', 'R$ 0,00', 'Nenhuma conversão registrada'],
  ['ROAS', '0,00x', 'Configure o investimento'],
  ['Conversão', '0,00%', 'Sem dados suficientes']
];

const channels = [
  ['Meta Ads', '0 visitas', 'R$ 0,00'],
  ['Google Ads', '0 visitas', 'R$ 0,00'],
  ['Orgânico', '0 visitas', 'R$ 0,00'],
  ['Direto', '0 visitas', 'R$ 0,00']
];

export default function Dashboard() {
  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span>TP</span><div><strong>Tracker</strong><small>Platform</small></div></div>
        <nav>
          <a className="active">Visão geral</a><a>Projetos</a><a>Campanhas</a><a>Conversões</a><a>Atribuição</a><a>Integrações</a><a>Alertas</a>
        </nav>
        <div className="sidebar-bottom"><a>Configurações</a><a>Documentação</a></div>
      </aside>
      <section className="content">
        <header className="topbar"><div><p className="eyebrow">PAINEL</p><h1>Visão geral</h1></div><button className="primary">+ Novo projeto</button></header>
        <div className="toolbar"><button className="period active">Hoje</button><button className="period">7 dias</button><button className="period">30 dias</button><button className="period">Personalizado</button></div>
        <section className="grid">
          {metrics.map(([label, value, hint]) => <article className="card" key={label}><span>{label}</span><strong>{value}</strong><small>{hint}</small></article>)}
        </section>
        <section className="columns">
          <article className="panel"><div className="panel-head"><div><p className="eyebrow">AQUISIÇÃO</p><h2>Origem do tráfego</h2></div><span className="muted">Hoje</span></div><div className="empty">Ainda não há dados de tráfego.<br/><small>Instale o Tracker JS em uma página para começar.</small></div></article>
          <article className="panel"><div className="panel-head"><div><p className="eyebrow">CANAIS</p><h2>Performance</h2></div></div><div className="channels">{channels.map(([name, visits, revenue]) => <div className="channel" key={name}><div><strong>{name}</strong><small>{visits}</small></div><b>{revenue}</b></div>)}</div></article>
        </section>
        <section className="panel setup"><div><p className="eyebrow">PRÓXIMO PASSO</p><h2>Conecte seu primeiro projeto</h2><p>Crie um projeto, copie a chave pública e instale o tracker na sua página de vendas.</p></div><button className="primary">Criar projeto</button></section>
      </section>
    </main>
  );
}
