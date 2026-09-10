import { criarRespostasVazias, type SituacaoValue, type TriagemRespostas } from '../types/triagem';
import {
  AREA_INTERESSE_CODES,
  ETAPA_OPTIONS,
  SITUACAO_OPTIONS,
  URGENCIA_OPTIONS,
  getTriagemTrackingData,
  labelFor,
} from './steps';
import { montarMensagemTriagem } from './whatsapp-message';
import { buildWhatsAppLink } from '../components/whatsapp-button';
import {
  trackCliqueWhatsapp,
  trackTriagemConcluida,
  trackTriagemIniciada,
  type OrigemTriagem,
} from '../lib/tracking';

const WHATSAPP_REDIRECT_DELAY_MS = 300;

const TOTAL_STEPS = 4;

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
      class="modal-overlay"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="triagem-title"
        data-triagem-panel
        class="modal-painel"
      >
        <div class="modal-cabecalho">
          <p id="triagem-title" class="modal-titulo">Análise inicial</p>
          <button
            type="button"
            data-triagem-close
            aria-label="Fechar análise"
            class="modal-fechar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <div data-triagem-progress class="modal-progresso"></div>

        <div data-triagem-content class="modal-conteudo"></div>
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
    if (event.key === 'Escape' && panel && panel.classList.contains('esta-visivel')) {
      closeTriagemModal();
    }
  });
}

/**
 * `origem` é obrigatória para que todo botão que abre a triagem apareça no
 * relatório de abandono (abertos × concluídos) com o ponto de partida certo.
 * Concentrar o disparo aqui, em vez de em cada botão, garante que nenhum
 * caminho de abertura fique sem evento.
 */
export function openTriagemModal(opcoes: {
  origem: OrigemTriagem;
  situacao?: SituacaoValue;
}): void {
  ensureModal();
  if (!panel) return;

  lastFocusedElement = document.activeElement as HTMLElement | null;
  showConfirmation = false;
  respostas = criarRespostasVazias();

  if (opcoes.situacao) {
    respostas.situacao = opcoes.situacao;
    step = 2;
  } else {
    step = 1;
  }

  panel.classList.add('esta-visivel');
  // `analise-aberta` trava o scroll e esconde a barra fixa de contato (ver style.css) para que
  // ela não fique sobre os controles do modal no mobile.
  document.body.classList.add('analise-aberta');

  // dupla rAF garante que o navegador aplique o estado inicial (opacidade 0)
  // antes de adicionar a classe que dispara a transição de entrada.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel?.classList.add('esta-aberto');
    });
  });

  trackTriagemIniciada(
    opcoes.origem,
    opcoes.situacao ? AREA_INTERESSE_CODES[opcoes.situacao] : undefined,
  );
  render();
}

export function closeTriagemModal(): void {
  if (!panel) return;
  panel.classList.remove('esta-aberto');
  document.body.classList.remove('analise-aberta');
  lastFocusedElement?.focus();

  window.setTimeout(() => {
    panel?.classList.remove('esta-visivel');
  }, 250);
}

function renderProgress(): void {
  if (!root) return;
  const progressEl = root.querySelector('[data-triagem-progress]');
  if (!progressEl) return;

  const activeStep = showConfirmation ? TOTAL_STEPS : step;
  const segments = Array.from({ length: TOTAL_STEPS }, (_, i) => {
    const filled = i < activeStep;
    return `<span class="modal-progresso-passo ${filled ? 'preenchido' : ''}"></span>`;
  }).join('');

  progressEl.innerHTML = `
    <div class="modal-progresso-trilha" role="progressbar" aria-valuenow="${activeStep}" aria-valuemin="1" aria-valuemax="${TOTAL_STEPS}">
      ${segments}
    </div>
    <p class="modal-progresso-texto">Etapa ${activeStep} de ${TOTAL_STEPS}</p>
  `;
}

function optionButton(label: string, selected: boolean): string {
  return `
    <button
      type="button"
      data-option-value="${label}"
      class="modal-opcao ${selected ? 'selecionada' : ''}"
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
    <h4 class="modal-pergunta">${title}</h4>
    <div class="modal-opcoes" data-options></div>
    ${
      step > 1
        ? '<button type="button" data-triagem-back class="modal-voltar">← Voltar</button>'
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
  step = stepIndex + 1;
  render();
}

function renderStepContato(): void {
  if (!content) return;

  content.innerHTML = `
    <h4 class="modal-pergunta">Seus dados de contato</h4>
    <form data-triagem-form class="modal-form">
      <div class="modal-campo">
        <label for="triagem-nome">Nome *</label>
        <input
          id="triagem-nome"
          name="nome"
          type="text"
          required
          value="${respostas.nome}"
        />
      </div>
      <div class="modal-campo">
        <label for="triagem-telefone">Telefone / WhatsApp (opcional)</label>
        <input
          id="triagem-telefone"
          name="telefone"
          type="tel"
          value="${respostas.telefone}"
          placeholder="(11) 90000-0000"
        />
      </div>
      <div class="modal-campo">
        <label for="triagem-email">E-mail (opcional)</label>
        <input
          id="triagem-email"
          name="email"
          type="email"
          value="${respostas.email}"
        />
      </div>

      <div class="modal-acoes">
        <button type="button" data-triagem-back class="modal-voltar">← Voltar</button>
        <button
          type="submit"
          class="btn-modal-primario"
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

    if (!respostas.nome) return;

    // TODO(lead-capture): enviar `respostas` para um endpoint de CRM/e-mail
    // aqui (ex.: fetch a uma função serverless). Deve ser best-effort e nunca
    // bloquear o fluxo de confirmação/WhatsApp abaixo.

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
    <h4 class="modal-pergunta">Confirme suas respostas</h4>
    <dl class="modal-resumo">
      <div class="modal-resumo-linha">
        <dt class="modal-resumo-k">Situação</dt>
        <dd class="modal-resumo-v">${situacaoLabel}</dd>
      </div>
      <div class="modal-resumo-linha">
        <dt class="modal-resumo-k">Etapa</dt>
        <dd class="modal-resumo-v">${etapaLabel}</dd>
      </div>
      <div class="modal-resumo-linha">
        <dt class="modal-resumo-k">Urgência</dt>
        <dd class="modal-resumo-v">${urgenciaLabel}</dd>
      </div>
      <div class="modal-resumo-linha">
        <dt class="modal-resumo-k">Nome</dt>
        <dd class="modal-resumo-v">${respostas.nome}</dd>
      </div>
      ${
        respostas.telefone
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">Telefone</dt>
              <dd class="modal-resumo-v">${respostas.telefone}</dd>
            </div>`
          : ''
      }
      ${
        respostas.email
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">E-mail</dt>
              <dd class="modal-resumo-v">${respostas.email}</dd>
            </div>`
          : ''
      }
    </dl>

    <p class="modal-aviso">
      Ao confirmar, você será direcionado ao WhatsApp com uma mensagem pré-preenchida com essas
      informações para o escritório.
    </p>

    <div class="modal-acoes">
      <button type="button" data-triagem-edit class="modal-voltar">
        ← Editar respostas
      </button>
      <a
        href="${buildWhatsAppLink(montarMensagemTriagem(respostas), 'triagem')}"
        target="_blank"
        rel="noopener noreferrer"
        data-triagem-confirm
        class="btn-modal-primario"
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
    const tracking = getTriagemTrackingData(respostas.situacao, respostas.urgencia);

    // A ordem importa: trackTriagemConcluida grava a flag `triagem_ok`, que é
    // justamente o que faz o clique_whatsapp abaixo ser suprimido — este
    // clique já foi contabilizado como a conversão da triagem.
    trackTriagemConcluida(tracking.areaInteresse, tracking.urgenciaCode, tracking.valorLead);
    trackCliqueWhatsapp('pos_triagem');

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
