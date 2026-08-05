import { mount } from '../lib/dom';

const BLOCKS = [
  {
    title: 'Busca e apreensão ou prisão',
    text: 'Durante uma operação policial é importante conhecer seus direitos. O acompanhamento jurídico pode ocorrer desde o cumprimento do mandado, durante depoimentos, na audiência de custódia e nas demais etapas da investigação.',
  },
  {
    title: 'Contas bancárias ou bens bloqueados',
    text: 'Bloqueios patrimoniais podem atingir contas, imóveis, veículos e outros bens. Dependendo do caso, a legislação prevê medidas para discutir a legalidade da restrição e solicitar a restituição de bens ou o desbloqueio de valores.',
  },
  {
    title: 'Intimação para prestar depoimento',
    text: 'Nem toda intimação significa a mesma coisa. Uma pessoa pode ser ouvida como testemunha, investigada ou indiciada, e cada situação possui consequências diferentes. Antes de comparecer, é importante compreender qual é sua posição no procedimento e quais são seus direitos.',
  },
];

export function renderAtuacao(): void {
  mount(
    'atuacao',
    `
    <div class="mx-auto max-w-5xl px-6 py-16 md:py-24 lg:px-8">
      <h2 data-reveal class="text-balance max-w-2xl text-2xl font-medium text-stone-50 md:text-3xl">
        Em quais situações podemos atuar
      </h2>

      <div class="mt-10 grid gap-6 md:grid-cols-3">
        ${BLOCKS.map(
          (block, index) => `
          <div data-reveal style="--reveal-delay: ${index * 100}ms" class="rounded border border-graphite-700 bg-graphite-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-bronze-600/60 hover:shadow-lg hover:shadow-black/20">
            <span class="font-serif text-3xl text-bronze-500">${String(index + 1).padStart(2, '0')}</span>
            <h3 class="mt-4 text-lg font-medium text-stone-50">${block.title}</h3>
            <p class="mt-3 text-sm leading-relaxed text-stone-300">${block.text}</p>
          </div>
        `,
        ).join('')}
      </div>
    </div>
    `,
  );
}
