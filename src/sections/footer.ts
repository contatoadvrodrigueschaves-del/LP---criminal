import { mount } from '../lib/dom';
import { attachWhatsAppTracking, buildWhatsAppLink } from '../components/whatsapp-button';

const FOOTER_MESSAGE = 'Olá, gostaria de falar com o escritório.';

export function renderFooter(): void {
  const container = mount(
    'rodape',
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
                  <a
                    href="${buildWhatsAppLink(FOOTER_MESSAGE)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-whatsapp-source="footer"
                    class="hover:text-bronze-300"
                  >
                    (11) 97865-1383
                  </a>
                </dd>
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
        </div>

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
