import {
  LIMITE_RELATO,
  criarRespostasVazias,
  type ApreensaoValue,
  type LaudoValue,
  type SituacaoValue,
  type TriagemRespostas,
} from '../types/triagem';
import {
  APREENSAO_EXCLUSIVAS,
  APREENSAO_OPTIONS,
  AREA_INTERESSE_CODES,
  ETAPA_OPTIONS,
  LAUDO_OPTIONS,
  SITUACAO_OPTIONS,
  URGENCIA_OPTIONS,
  getQualificacaoTracking,
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

const TOTAL_STEPS = 5;

let step = 1;
let showConfirmation = false;
let respostas: TriagemRespostas = criarRespostasVazias();
let lastFocusedElement: HTMLElement | null = null;

let root: HTMLElement | null = null;
let panel: HTMLElement | null = null;
let content: HTMLElement | null = null;

/**
 * Tudo que a pessoa digita passa por aqui antes de virar innerHTML.
 * Sem isso, um nome com aspas já quebra o atributo `value` e o campo de
 * relato — 500 caracteres livres — vira injeção de HTML na tela de resumo.
 */
function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

/**
 * Etapa 4 — o material do caso.
 *
 * Tudo aqui é opcional de propósito: os leads mais urgentes (flagrante,
 * busca em andamento) normalmente ainda não têm número de processo, e exigir
 * o campo barraria justamente quem mais precisa. As duas primeiras perguntas
 * são o que liga o caso ao serviço do escritório — o que foi apreendido
 * define se há prova digital a analisar, e o laudo define se cabe assistente
 * técnico.
 */
function renderStepCaso(): void {
  if (!content) return;

  const chips = (
    opcoes: { value: string; label: string }[],
    selecionados: string[],
    attr: string,
  ): string =>
    opcoes
      .map(
        (o) => `<button type="button" ${attr}="${o.value}" class="modal-chip ${
          selecionados.includes(o.value) ? 'selecionada' : ''
        }" aria-pressed="${selecionados.includes(o.value)}">${o.label}</button>`,
      )
      .join('');

  const usados = respostas.relato.length;

  content.innerHTML = `
    <h4 class="modal-pergunta">O que existe de material no caso?</h4>
    <p class="modal-ajuda">Todos os campos desta etapa são opcionais. Responda o que souber.</p>

    <form data-triagem-form class="modal-form">
      <fieldset class="modal-grupo">
        <legend>Foi apreendido algum aparelho ou material?</legend>
        <div class="modal-chips" data-apreensao>${chips(
          APREENSAO_OPTIONS,
          respostas.apreensao,
          'data-apreensao-value',
        )}</div>
      </fieldset>

      <fieldset class="modal-grupo">
        <legend>A acusação já apresentou laudo pericial?</legend>
        <div class="modal-chips" data-laudo>${chips(
          LAUDO_OPTIONS,
          respostas.laudo ? [respostas.laudo] : [],
          'data-laudo-value',
        )}</div>
      </fieldset>

      <div class="modal-campo">
        <label for="triagem-processo">Número do processo ou inquérito</label>
        <input
          id="triagem-processo"
          name="numeroProcesso"
          type="text"
          value="${escaparHtml(respostas.numeroProcesso)}"
          placeholder="Se ainda não houver, deixe em branco"
        />
      </div>

      <div class="modal-campo">
        <label for="triagem-relato">Conte o que aconteceu</label>
        <textarea
          id="triagem-relato"
          name="relato"
          rows="5"
          maxlength="${LIMITE_RELATO}"
          data-relato
          placeholder="Em poucas linhas: o que aconteceu, quando, e o que você já recebeu ou assinou."
        >${escaparHtml(respostas.relato)}</textarea>
        <p class="modal-contador" data-contador aria-live="polite">${usados} / ${LIMITE_RELATO}</p>
      </div>

      <div class="modal-acoes">
        <button type="button" data-triagem-back class="modal-voltar">← Voltar</button>
        <button type="submit" class="btn-modal-primario">Continuar</button>
      </div>
    </form>
  `;

  const form = content.querySelector<HTMLFormElement>('[data-triagem-form]');

  // Guarda o que já foi digitado antes de qualquer re-render disparado pelos
  // chips, senão o texto do relato se perde ao marcar uma opção.
  const capturar = (): void => {
    if (!form) return;
    const data = new FormData(form);
    respostas.numeroProcesso = String(data.get('numeroProcesso') ?? '').trim();
    respostas.relato = String(data.get('relato') ?? '').slice(0, LIMITE_RELATO);
  };

  content.querySelectorAll<HTMLButtonElement>('[data-apreensao-value]').forEach((btn) => {
    btn.addEventListener('click', () => {
      capturar();
      const valor = btn.dataset.apreensaoValue as ApreensaoValue;
      const jaTem = respostas.apreensao.includes(valor);

      if (APREENSAO_EXCLUSIVAS.includes(valor)) {
        respostas.apreensao = jaTem ? [] : [valor];
      } else {
        const semExclusivas = respostas.apreensao.filter(
          (v) => !APREENSAO_EXCLUSIVAS.includes(v),
        );
        respostas.apreensao = jaTem
          ? semExclusivas.filter((v) => v !== valor)
          : [...semExclusivas, valor];
      }
      render();
    });
  });

  content.querySelectorAll<HTMLButtonElement>('[data-laudo-value]').forEach((btn) => {
    btn.addEventListener('click', () => {
      capturar();
      const valor = btn.dataset.laudoValue as LaudoValue;
      respostas.laudo = respostas.laudo === valor ? null : valor;
      render();
    });
  });

  const relato = content.querySelector<HTMLTextAreaElement>('[data-relato]');
  const contador = content.querySelector<HTMLElement>('[data-contador]');
  relato?.addEventListener('input', () => {
    if (contador) contador.textContent = `${relato.value.length} / ${LIMITE_RELATO}`;
  });

  content.querySelector('[data-triagem-back]')?.addEventListener('click', () => {
    capturar();
    goBack();
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    capturar();
    advanceStep(4);
  });
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
          value="${escaparHtml(respostas.nome)}"
        />
      </div>
      <div class="modal-campo">
        <label for="triagem-telefone">Telefone / WhatsApp (opcional)</label>
        <input
          id="triagem-telefone"
          name="telefone"
          type="tel"
          value="${escaparHtml(respostas.telefone)}"
          placeholder="(11) 90000-0000"
        />
      </div>
      <div class="modal-campo">
        <label for="triagem-email">E-mail (opcional)</label>
        <input
          id="triagem-email"
          name="email"
          type="email"
          value="${escaparHtml(respostas.email)}"
        />
      </div>

      <label class="modal-consent">
        <input type="checkbox" name="consentimento" data-consent required ${
          respostas.consentimento ? 'checked' : ''
        } />
        <span>
          Concordo em enviar estas informações ao escritório pelo WhatsApp e li como
          meus dados são tratados.
        </span>
      </label>

      <details class="modal-privacidade">
        <summary>Como seus dados são tratados</summary>
        <p>
          <strong>Controlador:</strong> Larissa Rodrigues Chaves — OAB/SP 527.355,
          Av. Cidade Jardim, 377, Itaim Bibi, São Paulo/SP.
        </p>
        <p>
          Este site não armazena o que você preencheu. As respostas servem apenas para
          montar a mensagem que você mesmo envia pelo WhatsApp — os dados ficam na
          própria conversa, protegida por sigilo profissional.
        </p>
        <p>
          As ferramentas de medição do site recebem somente o tipo de situação, a
          urgência e as respostas técnicas sobre o caso. Nome, telefone, e-mail, número
          de processo e o seu relato não são enviados a elas.
        </p>
        <p>
          Para dúvidas ou pedidos sobre seus dados (art. 18 da LGPD), escreva para
          <a href="mailto:contato@rodrigueschavesadv.com.br">contato@rodrigueschavesadv.com.br</a>.
        </p>
      </details>

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
    respostas.consentimento = data.get('consentimento') === 'on';

    // O `required` do checkbox já barra o envio no navegador; a checagem aqui
    // é a que vale, porque o resumo é montado por este código e não pelo form.
    if (!respostas.nome || !respostas.consentimento) return;

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
      ${
        respostas.apreensao.length > 0
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">Apreendido</dt>
              <dd class="modal-resumo-v">${respostas.apreensao
                .map((valor) => labelFor(APREENSAO_OPTIONS, valor))
                .join(', ')}</dd>
            </div>`
          : ''
      }
      ${
        respostas.laudo
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">Laudo pericial</dt>
              <dd class="modal-resumo-v">${labelFor(LAUDO_OPTIONS, respostas.laudo)}</dd>
            </div>`
          : ''
      }
      ${
        respostas.numeroProcesso
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">Processo/inquérito</dt>
              <dd class="modal-resumo-v">${escaparHtml(respostas.numeroProcesso)}</dd>
            </div>`
          : ''
      }
      ${
        respostas.relato
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">Relato</dt>
              <dd class="modal-resumo-v modal-resumo-relato">${escaparHtml(respostas.relato)}</dd>
            </div>`
          : ''
      }
      <div class="modal-resumo-linha">
        <dt class="modal-resumo-k">Nome</dt>
        <dd class="modal-resumo-v">${escaparHtml(respostas.nome)}</dd>
      </div>
      ${
        respostas.telefone
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">Telefone</dt>
              <dd class="modal-resumo-v">${escaparHtml(respostas.telefone)}</dd>
            </div>`
          : ''
      }
      ${
        respostas.email
          ? `<div class="modal-resumo-linha">
              <dt class="modal-resumo-k">E-mail</dt>
              <dd class="modal-resumo-v">${escaparHtml(respostas.email)}</dd>
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
    const qualificacao = getQualificacaoTracking(respostas.apreensao, respostas.laudo);

    trackTriagemConcluida(
      tracking.areaInteresse,
      tracking.urgenciaCode,
      tracking.valorLead,
      qualificacao,
    );
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
  } else if (step === 4) {
    renderStepCaso();
  } else {
    renderStepContato();
  }
}
