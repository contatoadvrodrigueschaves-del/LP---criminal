import { mount } from '../lib/dom';
import { attachWhatsAppTracking, buildWhatsAppLink, WHATSAPP_ICON_SVG } from '../components/whatsapp-button';
import { PHONE_DISPLAY, PHONE_HREF } from '../components/phone-link';
import { openTriagemModal } from '../triagem/triagem';
import { SITUACAO_OPTIONS } from '../triagem/steps';
import type { SituacaoValue } from '../types/triagem';


export function renderHero(): void {
  const container = mount(
    'inicio',
    `
    <div class="relative overflow-hidden border-b border-graphite-700 bg-graphite-950">
      <svg
        class="pointer-events-none absolute -right-24 top-0 h-full w-1/2 max-w-xl opacity-[0.07] md:opacity-10"
        viewBox="0 0 400 600"
        fill="none"
        aria-hidden="true"
      >
        <line data-draw-line style="--draw-delay: 0ms" pathLength="1" x1="20" y1="60" x2="380" y2="60" stroke="#b08d57" stroke-width="1.5" />
        <line data-draw-line style="--draw-delay: 120ms" pathLength="1" x1="20" y1="140" x2="300" y2="140" stroke="#b08d57" stroke-width="1.5" />
        <line data-draw-line style="--draw-delay: 240ms" pathLength="1" x1="20" y1="220" x2="340" y2="220" stroke="#b08d57" stroke-width="1.5" />
        <line data-draw-line style="--draw-delay: 360ms" pathLength="1" x1="20" y1="300" x2="260" y2="300" stroke="#b08d57" stroke-width="1.5" />
        <line data-draw-line style="--draw-delay: 480ms" pathLength="1" x1="20" y1="380" x2="360" y2="380" stroke="#b08d57" stroke-width="1.5" />
        <line data-draw-line style="--draw-delay: 600ms" pathLength="1" x1="20" y1="460" x2="320" y2="460" stroke="#b08d57" stroke-width="1.5" />
        <circle data-pulse-dot style="--draw-delay: 1400ms" cx="380" cy="60" r="4" fill="#b08d57" />
        <circle data-pulse-dot style="--draw-delay: 1520ms" cx="300" cy="140" r="4" fill="#b08d57" />
        <circle data-pulse-dot style="--draw-delay: 1640ms" cx="340" cy="220" r="4" fill="#b08d57" />
        <circle data-pulse-dot style="--draw-delay: 1760ms" cx="260" cy="300" r="4" fill="#b08d57" />
      </svg>

      <div class="relative mx-auto flex max-w-5xl flex-col gap-5 px-6 py-10 md:gap-8 md:py-28 lg:px-8">
        <div data-reveal class="flex items-center gap-3 text-sm font-medium tracking-wide text-bronze-400">
          <span class="h-px w-8 bg-bronze-500"></span>
          Defesa Criminal · São Paulo
        </div>

        <h1 data-reveal style="--reveal-delay: 80ms" class="text-balance max-w-3xl text-[1.75rem] font-medium leading-[1.15] text-stone-50 md:text-5xl md:leading-tight">
          Quando a acusação envolve provas digitais, a defesa precisa analisar cada detalhe.
        </h1>

        <p data-reveal style="--reveal-delay: 140ms" class="text-balance text-base leading-relaxed text-stone-300 md:hidden">
          Intimação, bens bloqueados, busca e apreensão ou investigação por crimes financeiros: a
          análise técnica das provas digitais pode ser determinante para a defesa.
        </p>

        <p data-reveal style="--reveal-delay: 160ms" class="hidden max-w-2xl text-balance text-base leading-relaxed text-stone-300 md:block md:text-lg">
          Se você foi intimado, teve bens bloqueados, passou por uma busca e apreensão ou está sendo
          investigado por crimes financeiros, é importante compreender seus direitos desde o início da
          investigação. Hoje, muitas acusações são baseadas em mensagens, extratos bancários,
          transferências por PIX, registros de acesso, computadores e celulares apreendidos. A análise
          técnica dessas provas pode ser determinante para a condução da defesa.
        </p>

        <div data-reveal style="--reveal-delay: 200ms" class="flex flex-col gap-3">
          <div class="flex flex-col gap-3 sm:flex-row">
            <a
              href="${buildWhatsAppLink()}"
              target="_blank"
              rel="noopener noreferrer"
              data-whatsapp-source="hero"
              class="inline-flex items-center justify-center gap-2 rounded bg-verde-500 px-6 py-3.5 text-sm font-semibold text-graphite-950 shadow-lg shadow-black/30 transition duration-200 hover:scale-[1.02] hover:bg-verde-400"
            >
              ${WHATSAPP_ICON_SVG}
              Falar pelo WhatsApp
            </a>
            <button
              type="button"
              data-start-triagem
              class="inline-flex items-center justify-center gap-2 rounded border border-bronze-500 px-6 py-3.5 text-sm font-semibold text-bronze-300 transition duration-200 hover:scale-[1.02] hover:bg-graphite-800"
            >
              Iniciar análise
            </button>
          </div>

          <p class="text-sm text-stone-400">
            Ou ligue agora:
            <a
              href="${PHONE_HREF}"
              data-tel-source="hero"
              class="font-medium text-bronze-300 underline decoration-bronze-600/60 underline-offset-4 transition hover:text-bronze-200"
            >
              ${PHONE_DISPLAY}
            </a>
          </p>

          <p class="text-sm leading-relaxed text-stone-300">
            Atendimento para casos urgentes, incluindo prisão em flagrante, buscas e apreensões e
            bloqueio de bens.
          </p>
        </div>

        <div data-reveal style="--reveal-delay: 260ms" class="rounded-lg border border-bronze-600/30 bg-graphite-900/60 p-4 sm:p-6">
          <p class="text-sm font-medium text-stone-200">Qual dessas situações é a sua?</p>
          <div class="mt-3 flex flex-wrap gap-2">
            ${SITUACAO_OPTIONS.map(
              (option) => `
              <button
                type="button"
                data-quick-situacao="${option.value}"
                class="rounded-full border border-bronze-600/50 px-3 py-1.5 text-xs text-stone-200 transition duration-200 hover:scale-[1.03] hover:border-bronze-400 hover:bg-graphite-800 sm:px-4 sm:py-2 sm:text-sm"
              >
                ${option.label}
              </button>
            `,
            ).join('')}
          </div>
        </div>
      </div>
    </div>
    `,
  );

  attachWhatsAppTracking(container);

  container.querySelectorAll<HTMLButtonElement>('[data-quick-situacao]').forEach((button) => {
    button.addEventListener('click', () => {
      const situacao = button.dataset.quickSituacao as SituacaoValue;
      openTriagemModal({ origem: 'hero', situacao });
    });
  });

  container.querySelector('[data-start-triagem]')?.addEventListener('click', () => {
    openTriagemModal({ origem: 'hero' });
  });
}
