import type { TriagemRespostas } from '../types/triagem';
import {
  APREENSAO_OPTIONS,
  ETAPA_OPTIONS,
  LAUDO_OPTIONS,
  SITUACAO_OPTIONS,
  URGENCIA_OPTIONS,
  labelFor,
} from './steps';

/**
 * Teto para o valor já codificado do parâmetro `text` do link wa.me.
 *
 * Não existe limite documentado, mas URLs muito longas falham em algumas
 * combinações de navegador Android e WhatsApp — e a falha é silenciosa: o
 * app abre sem a mensagem. Português acentuado é o pior caso porque cada
 * acento vira seis caracteres (`ç` → `%C3%A7`), então medir o texto cru não
 * serve de nada; a conta tem que ser feita depois de codificar.
 */
const LIMITE_URL_WHATSAPP = 1800;

/** Quanto se corta por tentativa ao encolher o relato que não coube. */
const PASSO_CORTE = 24;

function montarBase(respostas: TriagemRespostas): string {
  const linhas = [
    `Olá, meu nome é ${respostas.nome || 'não informado'}.`,
    `Situação: ${labelFor(SITUACAO_OPTIONS, respostas.situacao)}.`,
    `Etapa: ${labelFor(ETAPA_OPTIONS, respostas.etapa)}.`,
    `Urgência: ${labelFor(URGENCIA_OPTIONS, respostas.urgencia)}.`,
  ];

  if (respostas.apreensao.length > 0) {
    const itens = respostas.apreensao
      .map((valor) => labelFor(APREENSAO_OPTIONS, valor))
      .join(', ');
    linhas.push(`Apreendido: ${itens}.`);
  }

  if (respostas.laudo) {
    linhas.push(`Laudo pericial: ${labelFor(LAUDO_OPTIONS, respostas.laudo)}.`);
  }

  if (respostas.numeroProcesso) {
    linhas.push(`Processo/inquérito: ${respostas.numeroProcesso}.`);
  }

  if (respostas.email) {
    linhas.push(`E-mail: ${respostas.email}.`);
  }

  linhas.push('Vim pelo formulário de triagem do site.');

  return linhas.join(' ');
}

/**
 * Encaixa o relato no que sobrou do orçamento de URL, cortando pelo fim.
 * O corte é sinalizado com "(...)" para o escritório saber que o texto
 * continua — e para a pessoa não parecer ter parado de escrever no meio.
 */
function encaixarRelato(base: string, relato: string): string {
  if (!relato) return base;

  const montar = (texto: string, cortado: boolean): string =>
    `${base} Relato: ${texto}${cortado ? ' (...)' : ''}`;

  if (encodeURIComponent(montar(relato, false)).length <= LIMITE_URL_WHATSAPP) {
    return montar(relato, false);
  }

  let texto = relato;
  while (texto.length > 0) {
    texto = texto.slice(0, Math.max(0, texto.length - PASSO_CORTE)).trimEnd();
    if (encodeURIComponent(montar(texto, true)).length <= LIMITE_URL_WHATSAPP) {
      return montar(texto, true);
    }
  }

  // Nem um relato vazio coube: manda só a base, que é o essencial.
  return base;
}

export function montarMensagemTriagem(respostas: TriagemRespostas): string {
  return encaixarRelato(montarBase(respostas), respostas.relato.trim());
}
