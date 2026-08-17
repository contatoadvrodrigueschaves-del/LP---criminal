import { trackCliqueWhatsapp, type OrigemWhatsapp } from '../lib/tracking';

export const WHATSAPP_NUMBER = '5511978651383';

/**
 * Mensagem única para todos os botões de WhatsApp da página.
 *
 * Deliberadamente neutra: não presume o que aconteceu com a pessoa. A versão
 * anterior do botão do hero já vinha escrita como "caso urgente (prisão em
 * flagrante, busca e apreensão ou bloqueio de bens)" — quem tinha só recebido
 * uma intimação abria o WhatsApp com uma mensagem que não era a situação dela
 * e precisava reescrever (atrito) ou mandava assim mesmo (lead confuso).
 * Centralizar aqui evita que esse descompasso volte em algum botão novo.
 */
const DEFAULT_MESSAGE = 'Olá, vim pelo site e gostaria de falar sobre a minha situação.';

export function buildWhatsAppLink(message: string = DEFAULT_MESSAGE, ref?: string): string {
  const params = new URLSearchParams({ text: message });
  if (ref) params.set('ref', ref);
  return `https://wa.me/${WHATSAPP_NUMBER}?${params.toString()}`;
}

export const WHATSAPP_ICON_SVG = `
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.24-1.27A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.18c-1.6 0-3.13-.42-4.46-1.2l-.32-.19-3.11.75.76-3.03-.2-.32a8.18 8.18 0 0 1-1.27-4.37c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.67 8.36-8.2 8.36Zm4.5-6.13c-.25-.12-1.47-.72-1.69-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"/>
  </svg>
`;

/**
 * Liga o rastreamento a todo `a[data-whatsapp-source]` dentro do container.
 * A origem vem do próprio atributo, então marcar o link no HTML da seção
 * basta — nenhum componente fala com o dataLayer diretamente.
 */
export function attachWhatsAppTracking(root: ParentNode = document): void {
  root.querySelectorAll<HTMLAnchorElement>('a[data-whatsapp-source]').forEach((link) => {
    link.addEventListener('click', () => {
      trackCliqueWhatsapp(link.dataset.whatsappSource as OrigemWhatsapp);
    });
  });
}
