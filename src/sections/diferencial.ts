import { mount } from '../lib/dom';

const ANALISE_ITEMS = [
  {
    title: 'Extração de celulares',
    text: 'Verificação da forma como os dados foram coletados, preservados e documentados.',
  },
  {
    title: 'Cadeia de custódia',
    text: 'Análise da preservação da integridade da prova desde a apreensão até a realização da perícia.',
  },
  {
    title: 'Quebra de sigilo',
    text: 'Avaliação dos limites da autorização judicial e do alcance das informações obtidas.',
  },
  {
    title: 'Dados de localização',
    text: 'Análise da forma como registros de antenas e outras informações técnicas foram utilizados na investigação.',
  },
  {
    title: 'Laudos periciais',
    text: 'Verificação da metodologia utilizada, documentação técnica e fundamentação das conclusões apresentadas.',
  },
];

export function renderDiferencial(): void {
  mount(
    'diferencial',
    `
    <div class="relative overflow-hidden bg-graphite-950">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze-500/60 to-transparent"></div>
      <div
        class="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-bronze-600/10 blur-3xl"
        aria-hidden="true"
      ></div>

      <div class="relative mx-auto max-w-5xl px-6 py-16 md:py-24 lg:px-8">
        <div data-reveal class="flex items-center gap-3 text-sm font-medium tracking-wide text-bronze-400">
          <span class="h-px w-8 bg-bronze-500"></span>
          Diferencial técnico
        </div>

        <h2 data-reveal style="--reveal-delay: 80ms" class="text-balance mt-4 max-w-2xl text-2xl font-medium text-stone-50 md:text-3xl">
          A defesa não começa pela tese. Começa pela análise das provas.
        </h2>

        <p data-reveal style="--reveal-delay: 160ms" class="mt-6 max-w-3xl text-balance text-base leading-relaxed text-stone-300 md:text-lg">
          Grande parte das investigações atuais utiliza provas digitais. Conversas de WhatsApp,
          registros bancários, PIX, e-mails, computadores, celulares e dados extraídos de dispositivos
          costumam fazer parte do processo. Esses elementos precisam ser obtidos e preservados conforme
          as regras previstas na legislação. Nem toda prova digital pode ser analisada apenas pelo
          resultado apresentado no laudo. Também é necessário verificar como ela foi produzida,
          armazenada e periciada. Uma defesa técnica analisa todo esse caminho para compreender a
          confiabilidade do material utilizado na investigação.
        </p>

        <h3 data-reveal class="mt-14 text-lg font-medium text-stone-50">O que costuma ser analisado</h3>

        <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          ${ANALISE_ITEMS.map(
            (item, index) => `
            <div data-reveal style="--reveal-delay: ${index * 90}ms" class="group rounded border border-bronze-600/40 bg-graphite-900 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-bronze-500 hover:shadow-lg hover:shadow-black/20">
              <span class="font-serif text-2xl text-bronze-500">${String(index + 1).padStart(2, '0')}</span>
              <h4 class="mt-3 text-base font-medium text-stone-50">${item.title}</h4>
              <p class="mt-2 text-sm leading-relaxed text-stone-400">${item.text}</p>
            </div>
          `,
          ).join('')}
        </div>
      </div>
    </div>
    `,
  );
}
