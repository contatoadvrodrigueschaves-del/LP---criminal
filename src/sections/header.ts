import { mount } from '../lib/dom';
import { attachWhatsAppTracking, buildWhatsAppLink } from '../components/whatsapp-button';

const HEADER_MESSAGE = 'Olá, gostaria de falar com o escritório.';

export function renderHeader(): void {
  const container = mount(
    'topo',
    `
    <div class="sticky top-0 z-40 border-b border-graphite-800 bg-graphite-950/95 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
        <span class="font-serif text-base text-stone-50">Rodrigues Chaves <span class="text-bronze-400">Advocacia</span></span>
        <a
          href="${buildWhatsAppLink(HEADER_MESSAGE)}"
          target="_blank"
          rel="noopener noreferrer"
          data-whatsapp-source="header"
          class="hidden items-center gap-2 rounded border border-bronze-500 px-4 py-2 text-sm font-medium text-bronze-300 transition hover:bg-graphite-800 sm:inline-flex"
        >
          Falar pelo WhatsApp
        </a>
      </div>
    </div>
    `,
  );

  attachWhatsAppTracking(container);
}
