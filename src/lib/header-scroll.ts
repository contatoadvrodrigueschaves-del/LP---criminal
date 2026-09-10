/**
 * Cabeçalho compacto depois do hero, só no desktop.
 *
 * No mobile a barra fixa inferior já garante o contato a um toque. No desktop
 * não há equivalente: passado o hero, o visitante fica sem nenhum CTA visível
 * até o meio da página. O cabeçalho fixo resolve isso, e encolher ao rolar
 * evita que ele roube espaço da leitura.
 */
/**
 * O fundo entra cedo de proposito. O cabecalho e fixo e o conteudo do hero
 * sobe por tras dele; se o fundo so aparecesse ao fim do hero, haveria uma
 * janela em que os botoes passariam por cima do logo num cabecalho ainda
 * transparente. Com a barra opaca desde o inicio da rolagem, o conteudo
 * desliza atras dela.
 */
const LIMIAR_FUNDO = 90;

export function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  let agendado = false;

  const avaliar = (): void => {
    agendado = false;
    header.classList.toggle('encolhido', window.scrollY > LIMIAR_FUNDO);
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
