(function () {
  'use strict';

  const script = document.currentScript;
  const projectKey = script && (script.dataset.project || script.getAttribute('data-project'));
  const endpoint = (script && script.dataset.endpoint) || 'https://YOUR-TRACKER-API.example.com/v1/events';

  if (!projectKey) return;

  const storage = window.localStorage;
  const visitorKey = '__tp_visitor_id';
  const sessionKey = '__tp_session_id';
  const visitorId = storage.getItem(visitorKey) || crypto.randomUUID();
  const sessionId = storage.getItem(sessionKey) || crypto.randomUUID();
  storage.setItem(visitorKey, visitorId);
  storage.setItem(sessionKey, sessionId);

  const params = new URLSearchParams(window.location.search);
  const context = {
    visitorId,
    sessionId,
    pageUrl: window.location.href,
    referrer: document.referrer || undefined,
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined
  };

  function send(name, properties) {
    const payload = {
      eventId: crypto.randomUUID(),
      projectKey,
      name,
      occurredAt: new Date().toISOString(),
      context,
      properties: properties || undefined
    };

    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'omit'
      }).catch(function () {});
    }
  }

  window.TrackerPlatform = {
    track: send,
    visitorId,
    sessionId
  };

  send('page_view');

  window.addEventListener('load', function () {
    send('landing_view');
  }, { once: true });
})();
