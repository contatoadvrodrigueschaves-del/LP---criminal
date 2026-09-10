/**
 * Ponto único de rastreamento da página.
 *
 * Todo evento de conversão passa por aqui — nenhum componente deve chamar
 * `window.dataLayer.push` diretamente. O Google Tag Manager (GTM-W2ZPVFPK,
 * ver index.html) é quem lê o dataLayer e distribui para GA4/Google Ads;
 * este arquivo não carrega nenhum SDK de analytics.
 */

type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/** De onde na página o clique partiu. Tipado para pegar erro de digitação no build. */
export type OrigemWhatsapp =
  | 'header'
  | 'hero'
  | 'situacoes'
  | 'rodape'
  | 'barra_fixa'
  | 'pos_triagem';

export type OrigemLigacao = 'hero' | 'rodape' | 'barra_fixa';

export type OrigemTriagem = 'hero' | 'provas_digitais';

const TRIAGEM_OK_KEY = 'triagem_ok';

const isBrowser = (): boolean => typeof window !== 'undefined';

function push(event: string, params: DataLayerEvent = {}): void {
  if (!isBrowser()) return;

  // O snippet do GTM cria o dataLayer antes de tudo. Se ele não existir, o
  // container não carregou (bloqueador, falha de rede): a fila é criada aqui
  // para não perder o evento nem quebrar a página, e o aviso aparece só em dev.
  if (!Array.isArray(window.dataLayer)) {
    if (import.meta.env.DEV) {
      console.warn(`[tracking] dataLayer ausente ao disparar "${event}" — GTM não carregou?`);
    }
    window.dataLayer = [];
  }

  window.dataLayer.push({ event, ...params });

  if (import.meta.env.DEV) {
    console.debug(`[dataLayer] ${event}`, params);
  }
}

/** sessionStorage pode lançar (modo privado, cota, storage desabilitado). */
function triagemJaConcluida(): boolean {
  if (!isBrowser()) return false;
  try {
    return window.sessionStorage.getItem(TRIAGEM_OK_KEY) === '1';
  } catch (erro) {
    if (import.meta.env.DEV) {
      console.warn('[tracking] não foi possível ler sessionStorage', erro);
    }
    return false;
  }
}

function marcarTriagemConcluida(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(TRIAGEM_OK_KEY, '1');
  } catch (erro) {
    if (import.meta.env.DEV) {
      console.warn('[tracking] não foi possível gravar sessionStorage', erro);
    }
  }
}

/**
 * Clique em qualquer caminho para o WhatsApp.
 *
 * `pos_triagem` é o botão "Confirmar e abrir WhatsApp" no fim da triagem:
 * aquele clique já é contabilizado como `triagem_concluida`, então contá-lo
 * de novo aqui inflaria as conversões. A flag `triagem_ok` (gravada por
 * trackTriagemConcluida) é o que suprime. A supressão vale só para essa
 * origem — os demais botões continuam disparando normalmente, inclusive
 * depois da triagem concluída.
 */
export function trackCliqueWhatsapp(origem: OrigemWhatsapp): void {
  if (origem === 'pos_triagem' && triagemJaConcluida()) {
    if (import.meta.env.DEV) {
      console.debug('[dataLayer] clique_whatsapp suprimido (já contado em triagem_concluida)');
    }
    return;
  }

  push('clique_whatsapp', { origem });
}

/** Clique em qualquer link `tel:` da página. */
export function trackCliqueLigacao(origem: OrigemLigacao): void {
  push('clique_ligacao', { origem });
}

/**
 * Abertura da triagem — ainda não é conversão, serve para medir abandono
 * (quantos abrem × quantos concluem). `situacao` vem preenchida quando o
 * usuário entra por um dos chips do hero, usando o mesmo código estável de
 * `area_interesse` em triagem_concluida.
 */
export function trackTriagemIniciada(origem: OrigemTriagem, situacao?: string): void {
  push('triagem_iniciada', { origem, ...(situacao ? { situacao } : {}) });
}

/**
 * Conclusão da triagem. Valor e códigos vêm de getTriagemTrackingData —
 * a regra de valor (200/120/60) fica em src/triagem/steps.ts e não muda aqui.
 */
export function trackTriagemConcluida(
  areaInteresse: string,
  urgencia: string,
  valorLead: number,
): void {
  push('triagem_concluida', {
    area_interesse: areaInteresse,
    urgencia,
    valor_lead: valorLead,
  });

  marcarTriagemConcluida();
}
