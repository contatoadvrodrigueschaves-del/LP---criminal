const OPCOES: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

/**
 * Revelação por scroll das seções (.reveal e .reveal-stagger do modelo).
 *
 * Sob prefers-reduced-motion o CSS já força opacidade 1; ainda assim marcamos
 * tudo como visível aqui para não deixar conteúdo dependendo do observer.
 */
export function initScrollReveal(root: ParentNode = document): void {
  const alvos = Array.from(root.querySelectorAll<HTMLElement>('.reveal, .reveal-stagger'));
  if (alvos.length === 0) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    alvos.forEach((alvo) => alvo.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('is-visible');
      obs.unobserve(entrada.target);
    });
  }, OPCOES);

  alvos.forEach((alvo) => observer.observe(alvo));
}
