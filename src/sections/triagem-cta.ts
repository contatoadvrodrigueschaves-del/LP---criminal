import { mount } from '../lib/dom';
import { attachWhatsAppTracking, buildWhatsAppLink, WHATSAPP_ICON_SVG } from '../components/whatsapp-button';
import { PHONE_DISPLAY, PHONE_HREF } from '../components/phone-link';
import { openTriagemModal } from '../triagem/triagem';

const CTA_MESSAGE = 'Olá, gostaria de falar pelo WhatsApp com o escritório.';

export function renderTriagemCta(): void {
  const container = mount(
    'triagem',
    `
    <div class="mx-auto max-w-3xl px-6 py-16 text-center md:py-24 lg:px-8">
      <h2 data-reveal class="text-balance text-2xl font-medium text-stone-50 md:text-3xl">
        Responda algumas perguntas e entenda melhor sua situação.
      </h2>

      <p data-reveal style="--reveal-delay: 100ms" class="mt-6 text-balance text-base leading-relaxed text-stone-300 md:text-lg">
        A triagem inicial ajuda a identificar em qual etapa da investigação você está e quais
        informações serão importantes para uma análise jurídica. Ao final, você poderá decidir se
        deseja entrar em contato com o escritório.
      </p>

      <div data-reveal style="--reveal-delay: 200ms" class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="${buildWhatsAppLink(CTA_MESSAGE)}"
          target="_blank"
          rel="noopener noreferrer"
          data-whatsapp-source="triagem_cta"
          class="inline-flex items-center justify-center gap-2 rounded bg-bronze-500 px-6 py-3.5 text-sm font-semibold text-graphite-950 shadow-lg shadow-black/30 transition duration-200 hover:scale-[1.02] hover:bg-bronze-400"
        >
          ${WHATSAPP_ICON_SVG}
          Falar pelo WhatsApp
        </a>
        <button
          type="button"
          data-open-triagem
          class="inline-flex items-center justify-center gap-2 rounded border border-bronze-500 px-6 py-3.5 text-sm font-semibold text-bronze-300 transition duration-200 hover:scale-[1.02] hover:bg-graphite-800"
        >
          Iniciar triagem
        </button>
      </div>

      <p data-reveal style="--reveal-delay: 260ms" class="mt-5 text-sm text-stone-400">
        Ou ligue agora:
        <a
          href="${PHONE_HREF}"
          data-tel-source="cta_final"
          class="font-medium text-bronze-300 underline decoration-bronze-600/60 underline-offset-4 transition hover:text-bronze-200"
        >
          ${PHONE_DISPLAY}
        </a>
      </p>
    </div>
    `,
  );

  attachWhatsAppTracking(container);
  container.querySelector('[data-open-triagem]')?.addEventListener('click', () => {
    openTriagemModal();
  });
}
