import { attachWhatsAppTracking, buildWhatsAppLink, WHATSAPP_ICON_SVG } from './whatsapp-button';
import { PHONE_HREF, PHONE_ICON_SVG } from './phone-link';

const BAR_MESSAGE =
  'Olá, gostaria de falar sobre minha situação com o escritório Rodrigues Chaves Advocacia.';

/**
 * Barra fixa de contato no rodapé da viewport, só no mobile (< 768px).
 *
 * Substitui o antigo botão flutuante redondo, que ficava sobreposto ao CTA de
 * triagem, a trechos de texto e ao aviso do Provimento 205/2021 no rodapé.
 * Uma barra de largura total empurra o conteúdo em vez de cobri-lo — o
 * padding-bottom compensatório no body está em style.css.
 *
 * z-50 fica acima do conteúdo e abaixo do modal da triagem (z-60); ainda
 * assim a barra é escondida via `body.triagem-aberta` para não competir com
 * os controles do modal.
 */
export function mountStickyCtaBar(): void {
  const root = document.getElementById('sticky-cta');
  if (!root) return;

  root.innerHTML = `
    <div
      data-sticky-cta
      class="fixed inset-x-0 bottom-0 z-50 border-t border-graphite-700 bg-graphite-950/95 backdrop-blur md:hidden"
    >
      <div class="grid grid-cols-2 gap-2 px-3 py-2">
        <a
          href="${PHONE_HREF}"
          data-tel-source="barra_fixa"
          class="inline-flex items-center justify-center gap-2 rounded bg-bronze-500 px-4 py-3 text-sm font-semibold text-graphite-950 transition duration-200 active:scale-[0.98]"
        >
          ${PHONE_ICON_SVG}
          Ligar agora
        </a>
        <a
          href="${buildWhatsAppLink(BAR_MESSAGE)}"
          target="_blank"
          rel="noopener noreferrer"
          data-whatsapp-source="barra_fixa"
          class="inline-flex items-center justify-center gap-2 rounded border border-bronze-500 px-4 py-3 text-sm font-semibold text-bronze-300 transition duration-200 active:scale-[0.98]"
        >
          ${WHATSAPP_ICON_SVG}
          WhatsApp
        </a>
      </div>
    </div>
  `;

  attachWhatsAppTracking(root);
}
