import { mount } from '../lib/dom';
import { attachWhatsAppTracking, buildWhatsAppLink, WHATSAPP_ICON_SVG } from '../components/whatsapp-button';
import { PHONE_DISPLAY, PHONE_HREF, PHONE_ICON_SVG } from '../components/phone-link';

export function renderUrgencia(): void {
  const container = mount(
    'urgencia',
    `
    <div class="border-y border-graphite-700 bg-graphite-900">
      <div class="mx-auto max-w-4xl px-6 py-16 md:py-24 lg:px-8">
        <h2 data-reveal class="text-balance text-2xl font-medium text-stone-50 md:text-3xl">
          Quanto antes a defesa começa, maiores são as possibilidades de atuação.
        </h2>

        <p data-reveal style="--reveal-delay: 100ms" class="mt-6 text-balance text-base leading-relaxed text-stone-300 md:text-lg">
          Muitas pessoas acreditam que só precisam de advogado depois de receber uma denúncia. Na
          prática, diversas decisões importantes acontecem antes disso. A forma como um depoimento é
          prestado, a análise das provas produzidas durante a investigação e as medidas adotadas nas
          primeiras horas podem influenciar todo o andamento do procedimento. Por isso, contar com
          orientação jurídica desde o início permite compreender seus direitos e tomar decisões com
          mais segurança.
        </p>

        <div data-reveal style="--reveal-delay: 200ms" class="mt-8 rounded-lg border border-graphite-700 bg-graphite-950/60 p-5 sm:p-6">
          <p class="text-base font-medium text-stone-100">
            Está lidando com um procedimento em andamento?
          </p>
          <div class="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href="${buildWhatsAppLink()}"
              target="_blank"
              rel="noopener noreferrer"
              data-whatsapp-source="urgencia"
              class="inline-flex items-center justify-center gap-2 rounded bg-verde-500 px-6 py-3.5 text-sm font-semibold text-graphite-950 transition duration-200 hover:scale-[1.02] hover:bg-verde-400"
            >
              ${WHATSAPP_ICON_SVG}
              Falar pelo WhatsApp
            </a>
            <a
              href="${PHONE_HREF}"
              data-tel-source="urgencia"
              class="inline-flex items-center justify-center gap-2 rounded border border-bronze-500 px-6 py-3.5 text-sm font-semibold text-bronze-300 transition duration-200 hover:scale-[1.02] hover:bg-graphite-800"
            >
              ${PHONE_ICON_SVG}
              Ligar para ${PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </div>
    `,
  );

  attachWhatsAppTracking(container);
}
