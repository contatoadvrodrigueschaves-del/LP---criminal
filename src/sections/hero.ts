import { attachWhatsAppTracking, buildWhatsAppLink } from '../components/whatsapp-button';
import { openTriagemModal } from '../triagem/triagem';
import { SITUACAO_OPTIONS } from '../triagem/steps';
import type { SituacaoValue } from '../types/triagem';

/**
 * O hero é o único bloco que vive como HTML estático no index.html, e não é
 * renderizado por JS como as demais seções.
 *
 * Motivo: ele carrega o H1, os dois CTAs e o telefone — tudo que o público de
 * urgência precisa ver. Renderizá-lo por JS significava tela em branco até o
 * bundle baixar e executar, num público que costuma estar em conexão instável.
 * Por isso o markup estático também não usa `data-reveal`: a animação de
 * entrada deixaria o conteúdo invisível esperando o JS de novo.
 *
 * Aqui só ligamos comportamento ao que já está na tela. Os chips continuam
 * vindo de SITUACAO_OPTIONS para não duplicar a lista de situações.
 */
export function renderHero(): void {
  const container = document.getElementById('inicio');
  if (!container) return;

  // O href do WhatsApp existe no HTML para funcionar mesmo sem JS, mas é
  // reconciliado aqui com a fonte única — assim uma eventual divergência
  // entre index.html e whatsapp-button.ts se corrige sozinha no carregamento.
  const linkWhatsApp = container.querySelector<HTMLAnchorElement>('a[data-whatsapp-source="hero"]');
  if (linkWhatsApp) linkWhatsApp.href = buildWhatsAppLink();

  const chips = container.querySelector('[data-chips-situacao]');
  if (chips) {
    chips.innerHTML = SITUACAO_OPTIONS.map(
      (option) => `
      <button
        type="button"
        data-quick-situacao="${option.value}"
        class="rounded-full border border-bronze-600/50 px-3 py-1.5 text-xs text-stone-200 transition duration-200 hover:scale-[1.03] hover:border-bronze-400 hover:bg-graphite-800 sm:px-4 sm:py-2 sm:text-sm"
      >
        ${option.label}
      </button>
    `,
    ).join('');

    chips.querySelectorAll<HTMLButtonElement>('[data-quick-situacao]').forEach((button) => {
      button.addEventListener('click', () => {
        openTriagemModal({ origem: 'hero', situacao: button.dataset.quickSituacao as SituacaoValue });
      });
    });
  }

  container.querySelector('[data-start-triagem]')?.addEventListener('click', () => {
    openTriagemModal({ origem: 'hero' });
  });

  attachWhatsAppTracking(container);
}
