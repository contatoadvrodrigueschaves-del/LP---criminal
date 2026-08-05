/**
 * Wrapper central de tracking. Os SDKs do GA4 e do Meta Pixel são carregados
 * via <script> no index.html (ver comentários TODO lá) — aqui apenas
 * despachamos os eventos, sem depender de os SDKs estarem presentes.
 *
 * TODO(analytics): depois de habilitar os SDKs no index.html, validar os
 * eventos no GA4 DebugView e no Meta Pixel Helper.
 */

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
  }
}

function track(eventName: string, params: Record<string, unknown> = {}): void {
  window.gtag?.('event', eventName, params);
  window.fbq?.('trackCustom', eventName, params);

  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${eventName}`, params);
  }
}

export function trackWhatsAppClick(source: string): void {
  track('whatsapp_click', { source });
}

export function trackTriagemStart(): void {
  track('triagem_start');
}

export function trackTriagemStepComplete(step: number, stepName: string): void {
  track('triagem_step_complete', { step, step_name: stepName });
}

export function trackTriagemComplete(situacao: string, urgencia: string): void {
  track('triagem_complete', { situacao, urgencia });
}
