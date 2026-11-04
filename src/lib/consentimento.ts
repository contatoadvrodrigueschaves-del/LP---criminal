/**
 * Banner de consentimento de cookies + Google Consent Mode v2 (modelo opt-out).
 *
 * O *default* NAO mora aqui: ele e um script inline no <head> do index.html,
 * porque precisa estar no dataLayer antes do gtm.js carregar. La tudo comeca
 * "granted" e so fica "denied" para quem ja rejeitou. Este modulo cuida so do
 * banner e do "update" apos a escolha.
 *
 * Nada aqui toca em src/lib/tracking.ts: os eventos clique_whatsapp,
 * clique_ligacao, triagem_iniciada e triagem_concluida continuam sendo
 * enviados ao dataLayer com ou sem consentimento. O que o Consent Mode muda e
 * o que o Google pode gravar no navegador, nao o que a pagina dispara.
 */

const CHAVE = 'consentimento_cookies';
/** Chave da versao opt-in. Ainda lida para nao reativar quem ja rejeitou. */
const CHAVE_ANTIGA = 'crim_consentimento_cookies';

type Escolha = 'aceito' | 'rejeitado';

/** O gtag() e definido pelo script inline do <head>. */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** localStorage lanca em modo privado ou com armazenamento bloqueado. */
function lerEscolha(): Escolha | null {
  try {
    const valor =
      window.localStorage.getItem(CHAVE) ?? window.localStorage.getItem(CHAVE_ANTIGA);
    return valor === 'aceito' || valor === 'rejeitado' ? valor : null;
  } catch {
    return null;
  }
}

function gravarEscolha(escolha: Escolha): void {
  try {
    window.localStorage.setItem(CHAVE, escolha);
  } catch {
    // Sem armazenamento a escolha vale so para esta visita e o banner volta na
    // proxima. Quem rejeitou ja teve o "update" para "denied" nesta pagina.
  }
}

function aplicarConsentimento(escolha: Escolha): void {
  const estado = escolha === 'aceito' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    ad_storage: estado,
    ad_user_data: estado,
    ad_personalization: estado,
    analytics_storage: estado,
  });
}

export function initConsentimento(): void {
  const banner = document.querySelector<HTMLElement>('[data-consent-banner]');
  if (!banner) return;

  if (lerEscolha() !== null) return;

  banner.hidden = false;
  document.body.classList.add('consent-visivel');

  banner.querySelectorAll<HTMLButtonElement>('[data-consent]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const escolha = botao.dataset.consent as Escolha;

      gravarEscolha(escolha);
      aplicarConsentimento(escolha);

      banner.hidden = true;
      document.body.classList.remove('consent-visivel');
    });
  });
}
