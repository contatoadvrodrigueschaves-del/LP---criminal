import { mount } from '../lib/dom';

export function renderUrgencia(): void {
  mount(
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
      </div>
    </div>
    `,
  );
}
