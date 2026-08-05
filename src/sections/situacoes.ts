import { mount } from '../lib/dom';

const ITEMS = [
  'Recebeu uma intimação para prestar depoimento.',
  'Está sendo investigado pela Polícia Civil, Polícia Federal ou Ministério Público.',
  'Teve contas bancárias ou bens bloqueados.',
  'Sua empresa foi alvo de operação policial.',
  'Celular, computador ou documentos foram apreendidos.',
  'Foi acusado de fraude, lavagem de dinheiro, organização criminosa ou outro crime econômico.',
];

export function renderSituacoes(): void {
  mount(
    'situacoes',
    `
    <div class="mx-auto max-w-5xl px-6 py-16 md:py-24 lg:px-8">
      <h2 data-reveal class="text-balance max-w-2xl text-2xl font-medium text-stone-50 md:text-3xl">
        Você está passando por alguma dessas situações?
      </h2>

      <ul class="mt-10 grid gap-4 sm:grid-cols-2">
        ${ITEMS.map(
          (item, index) => `
          <li data-reveal style="--reveal-delay: ${index * 70}ms" class="flex items-start gap-3 rounded border border-graphite-700 bg-graphite-900 p-4 transition-colors duration-200 hover:border-bronze-600/60">
            <svg
              class="mt-0.5 h-5 w-5 flex-none text-bronze-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12.5l2 2 4-4.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="text-sm leading-relaxed text-stone-300">${item}</span>
          </li>
        `,
        ).join('')}
      </ul>

      <p data-reveal class="mt-10 text-balance font-serif text-lg text-bronze-300">
        Se alguma dessas situações aconteceu com você, o momento de buscar orientação jurídica é agora.
      </p>
    </div>
    `,
  );
}
