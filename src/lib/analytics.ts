/**
 * Wrapper central de tracking.
 *
 * O Google Tag Manager (GTM-W2ZPVFPK, ver index.html) é quem gerencia GA4 e
 * Meta Pixel — este arquivo não carrega esses SDKs diretamente. Eventos
 * customizados são enviados via window.dataLayer.push(...), que o GTM lê.
 *
 * As funções track*() legadas abaixo (que chamam window.gtag/window.fbq)
 * ficam inertes enquanto esses SDKs não forem configurados como tags no
 * GTM — mantidas por compatibilidade, mas o caminho oficial agora é o
 * dataLayer.
 */

type Gtag = (...args: unknown[]) => void;
type Fbq = (...args: unknown[]) => void;
type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: Gtag;
    fbq?: Fbq;
    dataLayer?: DataLayerEvent[];
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

/**
 * Evento consumido pelo GTM/Google Ads para marcar a triagem como concluída.
 * Empurra direto pro dataLayer (em vez de passar por gtag/fbq) porque é o
 * GTM quem vai configurar o gatilho de conversão em cima desse evento.
 */
export function trackTriagemConcluida(areaInteresse: string, urgencia: string): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'triagem_concluida',
    area_interesse: areaInteresse,
    urgencia,
  });
  sessionStorage.setItem('triagem_ok', '1');

  if (import.meta.env.DEV) {
    console.debug('[dataLayer] triagem_concluida', { areaInteresse, urgencia });
  }
}
