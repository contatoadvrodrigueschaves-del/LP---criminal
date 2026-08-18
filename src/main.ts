import './style.css';

import { renderHeader } from './sections/header';
import { renderHero } from './sections/hero';
import { renderSituacoes } from './sections/situacoes';
import { renderUrgencia } from './sections/urgencia';
import { renderAtuacao } from './sections/atuacao';
import { renderDiferencial } from './sections/diferencial';
import { renderAreas } from './sections/areas';
import { renderFaq } from './sections/faq';
import { renderTriagemCta } from './sections/triagem-cta';
import { renderFooter } from './sections/footer';
import { mountStickyCtaBar } from './components/sticky-cta-bar';
import { initTelTracking } from './components/phone-link';
import { initScrollReveal } from './lib/scroll-reveal';
import { initHashScroll } from './lib/hash-scroll';

renderHeader();
renderHero();
renderAtuacao();
renderSituacoes();
renderUrgencia();
renderDiferencial();
renderAreas();
renderFaq();
renderTriagemCta();
renderFooter();

mountStickyCtaBar();
initTelTracking();
initScrollReveal();
initHashScroll();
