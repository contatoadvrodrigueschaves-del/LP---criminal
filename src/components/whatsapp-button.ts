import { trackCliqueWhatsapp, type OrigemWhatsapp } from '../lib/tracking';

export const WHATSAPP_NUMBER = '5511978651383';

/**
 * Mensagem única para todos os links de WhatsApp da página.
 *
 * Deliberadamente neutra: não presume o que aconteceu com a pessoa. Uma versão
 * anterior já vinha escrita como "caso urgente (prisão em flagrante...)" e quem
 * tinha só recebido uma intimação precisava reescrever (atrito) ou mandava
 * assim mesmo (lead confuso). O HTML estático traz os links sem parâmetro; a
 * mensagem é aplicada por reconciliarLinksWhatsApp no carregamento.
 */
const DEFAULT_MESSAGE = 'Olá, vim pelo site e gostaria de falar sobre a minha situação.';

export function buildWhatsAppLink(message: string = DEFAULT_MESSAGE, ref?: string): string {
  const params = new URLSearchParams({ text: message });
  if (ref) params.set('ref', ref);
  return `https://wa.me/${WHATSAPP_NUMBER}?${params.toString()}`;
}

/**
 * O markup estático traz `https://wa.me/<numero>` puro, para funcionar mesmo
 * sem JavaScript. Aqui o href é reescrito com a mensagem padrão — assim existe
 * uma fonte única da mensagem sem abrir mão do link funcionar sem JS.
 */
export function reconciliarLinksWhatsApp(root: ParentNode = document): void {
  root.querySelectorAll<HTMLAnchorElement>('a[data-whatsapp-source]').forEach((link) => {
    link.href = buildWhatsAppLink();
  });
}

export function attachWhatsAppTracking(root: ParentNode = document): void {
  root.querySelectorAll<HTMLAnchorElement>('a[data-whatsapp-source]').forEach((link) => {
    link.addEventListener('click', () => {
      trackCliqueWhatsapp(link.dataset.whatsappSource as OrigemWhatsapp);
    });
  });
}
