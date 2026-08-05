export function mount(containerId: string, html: string): HTMLElement {
  const container = document.getElementById(containerId);
  if (!container) throw new Error(`Container não encontrado: #${containerId}`);
  container.innerHTML = html;
  return container;
}
