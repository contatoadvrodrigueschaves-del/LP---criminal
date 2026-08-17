import { mount } from '../lib/dom';
import { attachWhatsAppTracking, buildWhatsAppLink } from '../components/whatsapp-button';


export function renderHeader(): void {
  const container = mount(
    'topo',
    `
    <div class="sticky top-0 z-40 border-b border-graphite-800 bg-graphite-950/95 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
        <span class="flex items-center gap-2.5">
          <img src="/logo-mark.png" alt="" width="28" height="28" class="h-7 w-7" />
          <span class="font-serif text-base text-stone-50">Rodrigues Chaves <span class="text-bronze-400">Advocacia</span></span>
        </span>
        <a
          href="${buildWhatsAppLink()}"
          target="_blank"
          rel="noopener noreferrer"
          data-whatsapp-source="header"
          class="hidden items-center gap-2 rounded border border-verde-500 px-4 py-2 text-sm font-medium text-verde-300 transition hover:bg-graphite-800 sm:inline-flex"
        >
          Falar pelo WhatsApp
        </a>
      </div>
    </div>
    `,
  );

  attachWhatsAppTracking(container);
}
