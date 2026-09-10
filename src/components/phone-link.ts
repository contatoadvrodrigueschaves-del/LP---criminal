import { trackCliqueLigacao, type OrigemLigacao } from '../lib/tracking';

export const PHONE_HREF = 'tel:+5511978651383';
export const PHONE_DISPLAY = '(11) 97865-1383';

/**
 * Escuta cliques em qualquer `a[href^="tel:"]` via delegação no document.
 * Como o conteúdo é estático e o modal é criado sob demanda, a delegação
 * garante que links de telefone adicionados depois também sejam rastreados.
 *
 * A origem do clique vem de `data-tel-source` no próprio link.
 */
export function initTelTracking(): void {
  document.addEventListener('click', (event) => {
    const alvo = event.target;
    if (!(alvo instanceof Element)) return;

    const link = alvo.closest<HTMLAnchorElement>('a[href^="tel:"]');
    if (!link) return;

    trackCliqueLigacao(link.dataset.telSource as OrigemLigacao);
  });
}
