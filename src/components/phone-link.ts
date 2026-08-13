import { trackCliqueLigacao, type OrigemLigacao } from '../lib/tracking';

export const PHONE_HREF = 'tel:+5511978651383';
export const PHONE_DISPLAY = '(11) 97865-1383';

/**
 * Escuta cliques em qualquer `a[href^="tel:"]` da página via delegação no
 * document, em vez de anexar listener link a link como o attachWhatsAppTracking.
 * Como as seções são montadas em momentos diferentes (e o modal da triagem é
 * criado sob demanda), a delegação garante que links de telefone adicionados
 * depois também sejam rastreados, sem precisar lembrar de registrá-los.
 *
 * A origem do clique vem de `data-tel-source` no próprio link.
 */
export function initTelTracking(): void {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
    if (!link) return;

    trackCliqueLigacao(link.dataset.telSource as OrigemLigacao);
  });
}

/** Ícone de telefone (outline), no mesmo estilo minimalista dos demais. */
export const PHONE_ICON_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1l-2.2 2.2Z" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
`;
