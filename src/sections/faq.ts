import { mount } from '../lib/dom';
import { initAccordion } from '../components/accordion';

const FAQ_ITEMS = [
  {
    question: 'Houve uma busca e apreensão na minha casa ou empresa. O que eu faço agora?',
    answer:
      'É importante manter a calma, não destruir ou ocultar documentos e materiais, e observar se o mandado está sendo cumprido dentro dos limites autorizados pela decisão judicial. Buscar orientação jurídica o quanto antes ajuda a entender os próximos passos, incluindo eventual depoimento e a audiência de custódia.',
  },
  {
    question: 'Recebi uma intimação para prestar depoimento. Preciso comparecer?',
    answer:
      'Depende do teor da intimação e da sua posição no procedimento — testemunha, investigado ou indiciado possuem direitos diferentes. Antes de comparecer, vale entender exatamente o que está sendo solicitado e quais são as consequências de cada posição, para decidir como proceder.',
  },
  {
    question: 'Minhas contas foram bloqueadas. Isso significa que fui condenado?',
    answer:
      'Não. Um bloqueio patrimonial costuma ser uma medida cautelar, aplicada durante a investigação ou o processo, e não representa uma condenação. Dependendo do caso, existem medidas para discutir a legalidade da restrição e solicitar o desbloqueio de valores ou a restituição de bens.',
  },
  {
    question: 'As provas contra mim são apenas mensagens de celular. Isso é suficiente?',
    answer:
      'Mensagens e outros dados digitais precisam ser obtidos, preservados e periciados conforme as regras legais. Não basta observar apenas o resultado apresentado em um laudo — também é necessário verificar como a prova foi extraída, armazenada e analisada, o que pode impactar sua confiabilidade.',
  },
  {
    question: 'Já tenho advogado, mas quero uma segunda opinião sobre as provas digitais. É possível?',
    answer:
      'Sim. É comum buscar uma análise técnica complementar voltada especificamente às provas digitais do caso, sem que isso substitua o trabalho já realizado pelo advogado atual.',
  },
];

export function renderFaq(): void {
  const container = mount(
    'faq',
    `
    <div class="relative overflow-hidden border-t border-graphite-700 bg-graphite-900">
      <img
        src="/logo-watermark.png"
        loading="lazy"
        decoding="async"
        width="544"
        height="544"
        alt=""
        aria-hidden="true"
        class="pointer-events-none absolute -right-24 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 select-none opacity-[0.06] md:h-[34rem] md:w-[34rem]"
      />

      <div class="relative mx-auto max-w-3xl px-6 py-16 md:py-24 lg:px-8">
        <h2 data-reveal class="text-balance text-2xl font-medium text-stone-50 md:text-3xl">
          Perguntas frequentes
        </h2>

        <div class="mt-10 divide-y divide-graphite-700" data-accordion>
          ${FAQ_ITEMS.map(
            (item, index) => `
            <div data-reveal style="--reveal-delay: ${index * 60}ms" class="py-2">
              <h3>
                <button
                  type="button"
                  id="faq-trigger-${index}"
                  data-accordion-trigger
                  aria-expanded="false"
                  aria-controls="faq-panel-${index}"
                  class="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-stone-100 hover:text-bronze-300"
                >
                  <span>${item.question}</span>
                  <svg
                    class="h-4 w-4 flex-none text-bronze-500 transition-transform duration-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </h3>
              <div
                id="faq-panel-${index}"
                role="region"
                aria-labelledby="faq-trigger-${index}"
                aria-hidden="true"
                data-accordion-panel
                class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out"
              >
                <div class="overflow-hidden">
                  <p class="pb-4 pr-8 text-sm leading-relaxed text-stone-300">${item.answer}</p>
                </div>
              </div>
            </div>
          `,
          ).join('')}
        </div>
      </div>
    </div>
    `,
  );

  const accordionRoot = container.querySelector<HTMLElement>('[data-accordion]');
  if (accordionRoot) initAccordion(accordionRoot);
}
