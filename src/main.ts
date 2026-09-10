import './style.css';

import { initTelTracking } from './components/phone-link';
import { reconciliarLinksWhatsApp, attachWhatsAppTracking } from './components/whatsapp-button';
import { openTriagemModal } from './triagem/triagem';
import { initScrollReveal } from './lib/scroll-reveal';
import { initParallaxHero } from './lib/parallax-hero';
import { initHashScroll } from './lib/hash-scroll';

/**
 * Todo o conteúdo da página é HTML estático no index.html — a página existe
 * mesmo sem JavaScript, que é o cenário do público de urgência em conexão
 * instável. Este módulo cuida apenas de comportamento.
 */

reconciliarLinksWhatsApp();
attachWhatsAppTracking();
initTelTracking();

// "Analisar meu processo": no hero e no meio da página, abre a análise
// multi-etapas em vez de rolar até o contato, preservando triagem_concluida.
document.querySelector('[data-start-triagem]')?.addEventListener('click', () => {
  openTriagemModal({ origem: 'hero' });
});

document.querySelector('[data-open-triagem]')?.addEventListener('click', () => {
  openTriagemModal({ origem: 'provas_digitais' });
});

initScrollReveal();
initParallaxHero();
initHashScroll();
