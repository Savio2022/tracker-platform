export type TrackingEventName =
  | 'page_view'
  | 'landing_view'
  | 'button_click'
  | 'checkout_view'
  | 'checkout_start'
  | 'pix_generated'
  | 'purchase'
  | 'refund'
  | 'chargeback'
  | (string & {});

export interface TrackingContext {
  visitorId: string;
  sessionId: string;
  pageUrl?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
}

export interface TrackingEvent {
  eventId: string;
  projectKey: string;
  name: TrackingEventName;
  occurredAt: string;
  context: TrackingContext;
  properties?: Record<string, unknown>;
}
