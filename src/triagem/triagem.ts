import { criarRespostasVazias, type SituacaoValue, type TriagemRespostas } from '../types/triagem';
import {
  ETAPA_OPTIONS,
  SITUACAO_OPTIONS,
  URGENCIA_OPTIONS,
  getTriagemTrackingData,
  labelFor,
} from './steps';
import { montarMensagemTriagem } from './whatsapp-message';
import { buildWhatsAppLink } from '../components/whatsapp-button';
import {
  trackTriagemComplete,
  trackTriagemConcluida,
  trackTriagemStart,
  trackTriagemStepComplete,
} from '../lib/analytics';

const WHATSAPP_REDIRECT_DELAY_MS = 300;

const TOTAL_STEPS = 4;

const STEP_NAMES: Record<number, string> = {
  1: 'situacao',
  2: 'etapa',
  3: 'urgencia',
  4: 'contato',
};

let step = 1;
let showConfirmation = false;
let respostas: TriagemRespostas = criarRespostasVazias();
let lastFocusedElement: HTMLElement | null = null;

let root: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let content: HTMLElement | null = null;

function ensureModal(): void {
  if (root) return;
  root = document.getElementById('triagem-modal-root');
  if (!root) return;

  root.innerHTML = `
    <div
      data-triagem-overlay
      class="fixed inset-0 z-[60] hidden items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="triagem-title"
        data-triagem-panel
        class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-lg border border-graphite-700 bg-graphite-900 shadow-2xl sm:rounded-lg"
      >
        <div class="flex items-center justify-between border-b border-graphite-700 px-6 py-4">
          <p id="triagem-title" class="font-serif text-lg text-stone-50">Triagem inicial</p>
          <button
            type="button"
            data-triagem-close
            aria-label="Fechar triagem"
            class="rounded p-1 text-stone-400 hover:text-bronze-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div data-triagem-progress class="px-6 pt-4"></div>

        <div data-triagem-content class="px-6 py-6"></div>
      </div>
    </div>
  `;

  panel = root.querySelector('[data-triagem-overlay]');
  content = root.querySelector('[data-triagem-content]');

  root.querySelector('[data-triagem-close]')?.addEventListener('click', closeTriagemModal);
  panel?.addEventListener('click', (event) => {
    if (event.target === panel) closeTriagemModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && panel && !panel.classList.contains('hidden')) {
      closeTriagemModal();
    }
  });
}

export function openTriagemModal(prefill?: { situacao: SituacaoValue }): void {
  ensureModal();
  if (!panel) return;

  lastFocusedElement = document.activeElement as HTMLElement | null;
  showConfirmation = false;
  respostas = criarRespostasVazias();

  if (prefill?.situacao) {
    respostas.situacao = prefill.situacao;
    step = 2;
  } else {
    step = 1;
  }

  panel.classList.remove('hidden');
  panel.classList.add('flex');
  document.body.classList.add('overflow-hidden');

  // dupla rAF garante que o navegador aplique o estado inicial (opacidade 0)
  // antes de adicionar a classe que dispara a transição de entrada.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel?.classList.add('is-open');
    });
  });

  trackTriagemStart();
  render();
}

export function closeTriagemModal(): void {
  if (!panel) return;
  panel.classList.remove('is-open');
  document.body.classList.remove('overflow-hidden');
  lastFocusedElement?.focus();

  window.setTimeout(() => {
    panel?.classList.add('hidden');
    panel?.classList.remove('flex');
  }, 250);
}

function renderProgress(): void {
  if (!root) return;
  const progressEl = root.querySelector('[data-triagem-progress]');
  if (!progressEl) return;

  const activeStep = showConfirmation ? TOTAL_STEPS : step;
  const segments = Array.from({ length: TOTAL_STEPS }, (_, i) => {
    const filled = i < activeStep;
    return `<span class="h-1 flex-1 rounded-full ${filled ? 'bg-bronze-500' : 'bg-graphite-700'}"></span>`;
  }).join('');

  progressEl.innerHTML = `
    <div class="flex gap-1.5" role="progressbar" aria-valuenow="${activeStep}" aria-valuemin="1" aria-valuemax="${TOTAL_STEPS}">
      ${segments}
    </div>
    <p class="mt-2 text-xs text-stone-500">Etapa ${activeStep} de ${TOTAL_STEPS}</p>
  `;
}

function optionButton(label: string, selected: boolean): string {
  return `
    <button
      type="button"
      data-option-value="${label}"
      class="w-full rounded border ${selected ? 'border-bronze-500 bg-graphite-800' : 'border-graphite-700 bg-graphite-900'} px-4 py-3 text-left text-sm text-stone-200 transition hover:border-bronze-500 hover:bg-graphite-800"
    >
      ${label}
    </button>
  `;
}

function renderStepSelect<T extends string>(
  title: string,
  options: { value: T; label: string }[],
  selectedValue: T | null,
  onSelect: (value: T) => void,
): void {
  if (!content) return;

  content.innerHTML = `
    <h4 class="text-base font-medium text-stone-50">${title}</h4>
    <div class="mt-4 flex flex-col gap-2" data-options></div>
    ${
      step > 1
        ? '<button type="button" data-triagem-back class="mt-6 text-sm text-stone-400 hover:text-bronze-300">← Voltar</button>'
        : ''
    }
  `;

  const optionsContainer = content.querySelector('[data-options]');
  if (optionsContainer) {
    options.forEach((option) => {
      optionsContainer.insertAdjacentHTML(
        'beforeend',
        optionButton(option.label, option.value === selectedValue),
      );
    });

    optionsContainer.querySelectorAll<HTMLButtonElement>('[data-option-value]').forEach((btn, index) => {
      btn.addEventListener('click', () => onSelect(options[index].value));
    });
  }

  content.querySelector('[data-triagem-back]')?.addEventListener('click', goBack);
}

function goBack(): void {
  if (step > 1) {
    step -= 1;
    render();
  }
}

function advanceStep(stepIndex: number): void {
  trackTriagemStepComplete(stepIndex, STEP_NAMES[stepIndex] ?? String(stepIndex));
  step = stepIndex + 1;
  render();
}

function renderStepContato(): void {
  if (!content) return;

  content.innerHTML = `
    <h4 class="text-base font-medium text-stone-50">Seus dados de contato</h4>
    <form data-triagem-form class="mt-4 flex flex-col gap-4">
      <div>
        <label for="triagem-nome" class="mb-1 block text-sm text-stone-300">Nome *</label>
        <input
          id="triagem-nome"
          name="nome"
          type="text"
          required
          value="${respostas.nome}"
          class="w-full rounded border border-graphite-700 bg-graphite-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-bronze-500"
        />
      </div>
      <div>
        <label for="triagem-telefone" class="mb-1 block text-sm text-stone-300">Telefone / WhatsApp *</label>
        <input
          id="triagem-telefone"
          name="telefone"
          type="tel"
          required
          value="${respostas.telefone}"
          placeholder="(11) 90000-0000"
          class="w-full rounded border border-graphite-700 bg-graphite-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-bronze-500"
        />
      </div>
      <div>
        <label for="triagem-email" class="mb-1 block text-sm text-stone-300">E-mail (opcional)</label>
        <input
          id="triagem-email"
          name="email"
          type="email"
          value="${respostas.email}"
          class="w-full rounded border border-graphite-700 bg-graphite-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-bronze-500"
        />
      </div>

      <div class="mt-2 flex items-center justify-between">
        <button type="button" data-triagem-back class="text-sm text-stone-400 hover:text-bronze-300">← Voltar</button>
        <button
          type="submit"
          class="rounded bg-bronze-500 px-5 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-bronze-400"
        >
          Ver resumo
        </button>
      </div>
    </form>
  `;

  content.querySelector('[data-triagem-back]')?.addEventListener('click', goBack);

  const form = content.querySelector<HTMLFormElement>('[data-triagem-form]');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    respostas.nome = String(data.get('nome') ?? '').trim();
    respostas.telefone = String(data.get('telefone') ?? '').trim();
    respostas.email = String(data.get('email') ?? '').trim();

    if (!respostas.nome || !respostas.telefone) return;

    // TODO(lead-capture): enviar `respostas` para um endpoint de CRM/e-mail
    // aqui (ex.: fetch a uma função serverless). Deve ser best-effort e nunca
    // bloquear o fluxo de confirmação/WhatsApp abaixo.

    trackTriagemStepComplete(4, STEP_NAMES[4]);
    showConfirmation = true;
    render();
  });
}

function renderConfirmacao(): void {
  if (!content) return;

  const situacaoLabel = labelFor(SITUACAO_OPTIONS, respostas.situacao);
  const etapaLabel = labelFor(ETAPA_OPTIONS, respostas.etapa);
  const urgenciaLabel = labelFor(URGENCIA_OPTIONS, respostas.urgencia);

  content.innerHTML = `
    <h4 class="text-base font-medium text-stone-50">Confirme suas respostas</h4>
    <dl class="mt-4 space-y-3 text-sm">
      <div class="flex justify-between gap-4 border-b border-graphite-800 pb-2">
        <dt class="text-stone-500">Situação</dt>
        <dd class="text-right text-stone-200">${situacaoLabel}</dd>
      </div>
      <div class="flex justify-between gap-4 border-b border-graphite-800 pb-2">
        <dt class="text-stone-500">Etapa</dt>
        <dd class="text-right text-stone-200">${etapaLabel}</dd>
      </div>
      <div class="flex justify-between gap-4 border-b border-graphite-800 pb-2">
        <dt class="text-stone-500">Urgência</dt>
        <dd class="text-right text-stone-200">${urgenciaLabel}</dd>
      </div>
      <div class="flex justify-between gap-4 border-b border-graphite-800 pb-2">
        <dt class="text-stone-500">Nome</dt>
        <dd class="text-right text-stone-200">${respostas.nome}</dd>
      </div>
      <div class="flex justify-between gap-4 border-b border-graphite-800 pb-2">
        <dt class="text-stone-500">Telefone</dt>
        <dd class="text-right text-stone-200">${respostas.telefone}</dd>
      </div>
      ${
        respostas.email
          ? `<div class="flex justify-between gap-4 border-b border-graphite-800 pb-2">
              <dt class="text-stone-500">E-mail</dt>
              <dd class="text-right text-stone-200">${respostas.email}</dd>
            </div>`
          : ''
      }
    </dl>

    <p class="mt-4 text-xs leading-relaxed text-stone-500">
      Ao confirmar, você será direcionado ao WhatsApp com uma mensagem pré-preenchida com essas
      informações para o escritório.
    </p>

    <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <button type="button" data-triagem-edit class="text-sm text-stone-400 hover:text-bronze-300">
        ← Editar respostas
      </button>
      <a
        href="${buildWhatsAppLink(montarMensagemTriagem(respostas), 'triagem')}"
        target="_blank"
        rel="noopener noreferrer"
        data-triagem-confirm
        class="inline-flex items-center justify-center rounded bg-bronze-500 px-5 py-2.5 text-sm font-semibold text-graphite-950 hover:bg-bronze-400"
      >
        Confirmar e abrir WhatsApp
      </a>
    </div>
  `;

  content.querySelector('[data-triagem-edit]')?.addEventListener('click', () => {
    showConfirmation = false;
    step = 1;
    render();
  });

  content.querySelector<HTMLAnchorElement>('[data-triagem-confirm]')?.addEventListener('click', (event) => {
    event.preventDefault();

    // TODO(lead-capture): esse é o ponto de confirmação final do usuário —
    // alternativa ao envio no passo de contato, caso prefira registrar o
    // lead somente após a confirmação explícita.
    const areaInteresseLabel = labelFor(SITUACAO_OPTIONS, respostas.situacao);
    const urgenciaLabel = labelFor(URGENCIA_OPTIONS, respostas.urgencia);
    const tracking = getTriagemTrackingData(respostas.situacao, respostas.urgencia);

    trackTriagemComplete(areaInteresseLabel, urgenciaLabel);
    trackTriagemConcluida(tracking.areaInteresse, tracking.urgenciaCode, tracking.valorLead);

    const href = (event.currentTarget as HTMLAnchorElement).href;
    window.setTimeout(() => {
      window.open(href, '_blank', 'noopener,noreferrer');
    }, WHATSAPP_REDIRECT_DELAY_MS);
  });
}

function render(): void {
  renderProgress();

  if (showConfirmation) {
    renderConfirmacao();
    return;
  }

  if (step === 1) {
    renderStepSelect('Qual é a sua situação atual?', SITUACAO_OPTIONS, respostas.situacao, (value) => {
      respostas.situacao = value;
      advanceStep(1);
    });
  } else if (step === 2) {
    renderStepSelect('Em qual etapa do procedimento você está?', ETAPA_OPTIONS, respostas.etapa, (value) => {
      respostas.etapa = value;
      advanceStep(2);
    });
  } else if (step === 3) {
    renderStepSelect('Qual o nível de urgência?', URGENCIA_OPTIONS, respostas.urgencia, (value) => {
      respostas.urgencia = value;
      advanceStep(3);
    });
  } else {
    renderStepContato();
  }
}
