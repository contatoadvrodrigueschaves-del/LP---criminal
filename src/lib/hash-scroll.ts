function scrollToCurrentHash(): void {
  const id = window.location.hash.slice(1);
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: 'smooth' });
}

/**
 * As seções existem no HTML estático desde o início, mas o conteúdo delas só
 * é preenchido quando o main.ts roda. Ao abrir a URL já com um #hash, o
 * navegador tenta rolar antes disso e acaba mirando uma seção sem altura.
 * Rolar de novo depois que tudo foi montado (o rAF duplo garante que o
 * layout já assentou) corrige a posição final.
 *
 * O deslocamento do cabeçalho fixo é resolvido por scroll-margin-top no CSS,
 * não aqui, para que também valha nos cliques em links de âncora do próprio
 * navegador.
 */
export function initHashScroll(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(scrollToCurrentHash);
  });

  window.addEventListener('hashchange', scrollToCurrentHash);
}
