# Tracker Platform

Plataforma própria de tracking, atribuição e analytics para campanhas de marketing e vendas.

## Objetivo

Construir uma plataforma completa para rastrear visitantes, sessões, UTMs, cliques, eventos, checkouts e vendas, atribuir conversões às campanhas e apresentar métricas financeiras em um dashboard.

## Arquitetura inicial

- `apps/dashboard` — painel web
- `apps/tracker` — biblioteca JavaScript instalada nas páginas
- `services/tracking-api` — ingestão de eventos
- `services/attribution` — atribuição de conversões
- `services/webhooks` — recebimento de vendas e pagamentos
- `packages/database` — camada de banco
- `packages/types` — tipos compartilhados
- `packages/analytics` — cálculos e métricas
- `packages/ui` — componentes compartilhados

## Roadmap

1. Fundação do monorepo e padrões de código
2. Modelo de dados e banco
3. Tracker JavaScript
4. API de eventos
5. Sessões e visitantes
6. UTMs e identificadores de anúncios
7. Atribuição de conversões
8. Webhooks de checkout
9. Dashboard de métricas
10. Integrações de mídia paga
11. Alertas e automações
12. Multiusuário e SaaS

## Privacidade

O projeto deve ser desenvolvido considerando consentimento, minimização de dados, segurança e requisitos aplicáveis da LGPD.