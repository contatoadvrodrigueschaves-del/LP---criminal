import { mount } from '../lib/dom';

const AREAS = [
  {
    title: 'Lavagem de dinheiro',
    text: 'Defesa em investigações e ações penais que apuram ocultação ou dissimulação da origem de valores e bens.',
  },
  {
    title: 'Organização criminosa',
    text: 'Atuação em casos que envolvem associação de pessoas para a prática de crimes, com análise da prova que sustenta a imputação.',
  },
  {
    title: 'Estelionato digital',
    text: 'Acompanhamento de casos que envolvem fraudes eletrônicas, golpes financeiros e uso indevido de dados e dispositivos.',
  },
  {
    title: 'Crimes tributários',
    text: 'Defesa em apurações relacionadas a sonegação fiscal e outras condutas ligadas a obrigações tributárias.',
  },
  {
    title: 'Fraude previdenciária',
    text: 'Atuação em investigações e processos que tratam de irregularidades em benefícios e contribuições previdenciárias.',
  },
  {
    title: 'Evasão de divisas',
    text: 'Defesa em casos que envolvem operações financeiras não declaradas ou realizadas fora dos limites legais.',
  },
  {
    title: 'Restituição de bens',
    text: 'Medidas voltadas à discussão de bloqueios patrimoniais e à solicitação de devolução de valores e bens apreendidos.',
  },
  {
    title: 'Operações policiais',
    text: 'Acompanhamento jurídico durante o cumprimento de mandados de busca, apreensão e prisão, e nas etapas seguintes da investigação.',
  },
];

export function renderAreas(): void {
  mount(
    'areas',
    `
    <div class="mx-auto max-w-5xl px-6 py-16 md:py-24 lg:px-8">
      <h2 data-reveal class="text-balance max-w-2xl text-2xl font-medium text-stone-50 md:text-3xl">
        Áreas de atuação
      </h2>

      <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        ${AREAS.map(
          (area, index) => `
          <div data-reveal style="--reveal-delay: ${(index % 4) * 70}ms" class="rounded border border-graphite-700 bg-graphite-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-bronze-600/60">
            <h3 class="text-base font-medium text-stone-50">${area.title}</h3>
            <p class="mt-2 text-sm leading-relaxed text-stone-400">${area.text}</p>
          </div>
        `,
        ).join('')}
      </div>
    </div>
    `,
  );
}
