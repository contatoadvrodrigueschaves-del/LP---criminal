import { mount } from '../lib/dom';
import { attachWhatsAppTracking, buildWhatsAppLink } from '../components/whatsapp-button';
import { PHONE_DISPLAY, PHONE_HREF } from '../components/phone-link';

const FOOTER_MESSAGE = 'Olá, gostaria de falar com o escritório.';

export function renderFooter(): void {
  const container = mount(
    'contato',
    `
    <div class="border-t border-graphite-700 bg-graphite-950">
      <div class="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div data-reveal class="grid gap-8 md:grid-cols-2">
          <div>
            <p class="font-serif text-lg text-stone-50">Rodrigues Chaves Advocacia</p>
            <dl class="mt-4 space-y-2 text-sm text-stone-400">
              <div class="flex gap-2">
                <dt class="text-stone-500">Telefone:</dt>
                <dd>
                  <a href="${PHONE_HREF}" data-tel-source="rodape" class="hover:text-bronze-300">
                    ${PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-stone-500">WhatsApp:</dt>
                <dd>
                  <a
                    href="${buildWhatsAppLink(FOOTER_MESSAGE)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-whatsapp-source="rodape"
                    class="hover:text-bronze-300"
                  >
                    ${PHONE_DISPLAY}
                  </a>
                </dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-stone-500">Atendimento:</dt>
                <dd>Segunda a sexta, em horário comercial</dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-stone-500">E-mail:</dt>
                <dd>
                  <a href="mailto:contato@rodrigueschavesadv.com" class="hover:text-bronze-300">
                    contato@rodrigueschavesadv.com
                  </a>
                </dd>
              </div>
              <div class="flex gap-2">
                <dt class="text-stone-500">Endereço:</dt>
                <dd>Av. Cidade Jardim, 377, Itaim Bibi – São Paulo/SP</dd>
              </div>
            </dl>
          </div>

          <div class="flex items-center gap-3 md:justify-end">
            <img src="/logo-mark.png" alt="Rodrigues Chaves Advocacia" width="48" height="48" class="h-12 w-12" />
            <div class="font-serif leading-tight text-stone-200">
              <p class="text-base">Rodrigues Chaves</p>
              <p class="text-sm tracking-wide text-stone-400">ADVOCACIA</p>
            </div>
          </div>
        </div>

        <p class="mt-8 text-sm text-stone-400">
          Larissa Rodrigues Chaves — OAB/SP 527.355 · Advogada responsável
        </p>

        <p class="mt-10 border-t border-graphite-800 pt-6 text-xs leading-relaxed text-stone-500">
          Esta página possui caráter exclusivamente informativo, em conformidade com o Provimento nº
          205/2021 do Conselho Federal da OAB. As informações disponibilizadas não constituem promessa
          de resultado, oferta de serviços jurídicos ou garantia de êxito em processos judiciais,
          devendo cada caso ser analisado individualmente.
        </p>
      </div>
    </div>
    `,
  );

  attachWhatsAppTracking(container);
}
