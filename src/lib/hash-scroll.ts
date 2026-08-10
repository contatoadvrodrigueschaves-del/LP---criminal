function scrollToCurrentHash(): void {
  const id = window.location.hash.slice(1);
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth' });
}

/**
 * As seções já existem no HTML estático desde o início, mas o conteúdo só é
 * preenchido de forma síncrona quando este módulo roda. Isso significa que,
 * ao abrir a URL direto com um #hash, o navegador pode tentar rolar até a
 * âncora antes das seções ganharem altura real. Chamar isso depois que todas
 * as seções foram montadas (com um pequeno atraso via requestAnimationFrame
 * para garantir que o layout já assentou) corrige a posição final.
 */
export function initHashScroll(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToCurrentHash);
  });

  window.addEventListener('hashchange', scrollToCurrentHash);
}
