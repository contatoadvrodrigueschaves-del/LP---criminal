const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

export function initScrollReveal(root: ParentNode = document): void {
  const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (targets.length === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, OBSERVER_OPTIONS);

  targets.forEach((target) => observer.observe(target));
}
