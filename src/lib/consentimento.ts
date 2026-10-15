/**
 * Banner de consentimento de cookies + Google Consent Mode v2.
 *
 * O *default* (tudo "denied") NAO mora aqui: ele e um script inline no <head>
 * do index.html, porque precisa estar no dataLayer antes do gtm.js carregar.
 * Este modulo cuida so do banner e do "update" apos a escolha.
 *
 * Nada aqui toca em src/lib/tracking.ts: os eventos clique_whatsapp,
 * clique_ligacao, triagem_iniciada e triagem_concluida continuam sendo
 * enviados ao dataLayer com ou sem consentimento. O que o Consent Mode muda e
 * o que o Google pode gravar no navegador, nao o que a pagina dispara.
 */

const CHAVE = 'crim_consentimento_cookies';

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
    const valor = window.localStorage.getItem(CHAVE);
    return valor === 'aceito' || valor === 'rejeitado' ? valor : null;
  } catch {
    return null;
  }
}

function gravarEscolha(escolha: Escolha): void {
  try {
    window.localStorage.setItem(CHAVE, escolha);
  } catch {
    // Sem armazenamento a escolha vale so para esta visita. O banner volta na
    // proxima, o que e preferivel a assumir consentimento que nao foi dado.
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
