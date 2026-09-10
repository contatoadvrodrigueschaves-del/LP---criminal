/**
 * Cabeçalho compacto depois do hero, só no desktop.
 *
 * No mobile a barra fixa inferior já garante o contato a um toque. No desktop
 * não há equivalente: passado o hero, o visitante fica sem nenhum CTA visível
 * até o meio da página. O cabeçalho fixo resolve isso, e encolher ao rolar
 * evita que ele roube espaço da leitura.
 */
export function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!header || !hero) return;

  let agendado = false;

  const avaliar = (): void => {
    agendado = false;
    const passouDoHero = window.scrollY > hero.offsetHeight - 90;
    header.classList.toggle('encolhido', passouDoHero);
  };

  window.addEventListener(
    'scroll',
    () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(avaliar);
    },
    { passive: true },
  );

  avaliar();
}
