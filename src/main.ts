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
import { mountStickyWhatsApp } from './components/whatsapp-button';
import { initScrollReveal } from './lib/scroll-reveal';

renderHeader();
renderHero();
renderSituacoes();
renderUrgencia();
renderAtuacao();
renderDiferencial();
renderAreas();
renderFaq();
renderTriagemCta();
renderFooter();

mountStickyWhatsApp();
initScrollReveal();
