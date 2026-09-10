/**
 * Parallax sutil do hero, como no modelo de referência.
 *
 * A diferença é que aqui a escrita de estilo é agrupada num requestAnimationFrame
 * em vez de acontecer a cada evento de scroll — o efeito é o mesmo, sem forçar
 * layout dezenas de vezes por segundo num público que está no celular.
 */
export function initParallaxHero(): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  const conteudo = document.querySelector<HTMLElement>('.hero-content');
  if (!hero || !conteudo) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let agendado = false;

  const aplicar = (): void => {
    agendado = false;
    const y = window.scrollY;
    if (y >= hero.offsetHeight) return;
    conteudo.style.transform = `translateY(${y * 0.18}px)`;
    hero.style.backgroundPosition = `center ${50 + y * 0.02}%`;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(aplicar);
    },
    { passive: true },
  );
}
