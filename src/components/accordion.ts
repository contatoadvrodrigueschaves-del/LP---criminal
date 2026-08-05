/**
 * Liga o comportamento de um accordion acessível a um container já renderizado.
 * Espera a estrutura:
 *   <div data-accordion>
 *     <h3><button data-accordion-trigger aria-expanded="false" aria-controls="ID">...</button></h3>
 *     <div id="ID" data-accordion-panel aria-hidden="true" class="grid grid-rows-[0fr] ...">
 *       <div class="overflow-hidden">...</div>
 *     </div>
 *   </div>
 * O painel anima via grid-template-rows (0fr → 1fr) em vez de `hidden`, para
 * permitir a transição suave de abertura/fechamento.
 */
export function initAccordion(container: HTMLElement): void {
  const triggers = Array.from(
    container.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'),
  );

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => togglePanel(trigger));

    trigger.addEventListener('keydown', (event) => {
      const index = triggers.indexOf(trigger);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        triggers[(index + 1) % triggers.length]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        triggers[(index - 1 + triggers.length) % triggers.length]?.focus();
      } else if (event.key === 'Home') {
        event.preventDefault();
        triggers[0]?.focus();
      } else if (event.key === 'End') {
        event.preventDefault();
        triggers[triggers.length - 1]?.focus();
      }
    });
  });
}

function togglePanel(trigger: HTMLButtonElement): void {
  const panelId = trigger.getAttribute('aria-controls');
  if (!panelId) return;
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
  trigger.setAttribute('aria-expanded', String(!isExpanded));
  panel.setAttribute('aria-hidden', String(isExpanded));
  panel.classList.toggle('grid-rows-[1fr]', !isExpanded);
  panel.classList.toggle('grid-rows-[0fr]', isExpanded);
}
