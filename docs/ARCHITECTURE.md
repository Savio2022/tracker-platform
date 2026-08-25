# Arquitetura

## Domínios principais

### Tracking
Recebe eventos do navegador e cria/atualiza visitante e sessão.

### Attribution
Relaciona conversões aos touchpoints de marketing usando identificadores persistentes e modelos de atribuição configuráveis.

### Commerce
Recebe eventos de checkout/pagamento por webhooks e normaliza pedidos, receita, reembolsos e chargebacks.

### Analytics
Agrega eventos e vendas para calcular visitas, sessões, CTR, CPC, CPA, conversão, receita, custo, ROAS, ROI e lucro.

### Integrations
Conecta fontes de mídia e plataformas de checkout sem acoplar o núcleo do sistema a um fornecedor específico.

## Evento canônico

Todo evento deverá possuir, no mínimo:

- `event_id`
- `project_id`
- `event_name`
- `occurred_at`
- `visitor_id`
- `session_id`
- `page_url`
- `referrer`
- `utm_*`
- identificadores de campanha quando disponíveis e permitidos
- contexto básico de dispositivo

Eventos financeiros devem possuir idempotência para impedir vendas duplicadas.

## Princípios

- API-first
- multi-tenant desde a fundação
- segurança por padrão
- idempotência em ingestão e webhooks
- dados brutos preservados para auditoria
- agregações separadas de eventos brutos
- privacidade e consentimento incorporados ao tracker
