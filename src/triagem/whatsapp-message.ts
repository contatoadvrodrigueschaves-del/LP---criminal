import type { TriagemRespostas } from '../types/triagem';
import { ETAPA_OPTIONS, SITUACAO_OPTIONS, URGENCIA_OPTIONS, labelFor } from './steps';

export function montarMensagemTriagem(respostas: TriagemRespostas): string {
  const situacao = labelFor(SITUACAO_OPTIONS, respostas.situacao);
  const etapa = labelFor(ETAPA_OPTIONS, respostas.etapa);
  const urgencia = labelFor(URGENCIA_OPTIONS, respostas.urgencia);

  const linhas = [
    `Olá, meu nome é ${respostas.nome || 'não informado'}.`,
    `Situação: ${situacao}.`,
    `Etapa: ${etapa}.`,
    `Urgência: ${urgencia}.`,
  ];

  if (respostas.email) {
    linhas.push(`E-mail: ${respostas.email}.`);
  }

  linhas.push('Vim pelo formulário de triagem do site.');

  return linhas.join(' ');
}
