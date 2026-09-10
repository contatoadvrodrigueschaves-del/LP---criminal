export type SituacaoValue =
  | 'intimacao'
  | 'investigado'
  | 'bens_bloqueados'
  | 'busca_apreensao'
  | 'operacao_empresa';

export type EtapaValue = 'nao_chamado' | 'ja_depos' | 'denuncia_formal' | 'nao_sei';

export type UrgenciaValue = 'urgente' | 'proximos_dias' | 'apenas_informando';

/**
 * O que foi apreendido é a pergunta que liga o caso ao serviço central do
 * escritório (análise técnica de prova digital). Aceita múltipla escolha
 * porque uma busca e apreensão costuma levar mais de um tipo de material.
 */
export type ApreensaoValue = 'celular' | 'computador' | 'documentos' | 'nada' | 'nao_sei';

/** Se já existe laudo da acusação, cabe contraprova/assistente técnico. */
export type LaudoValue = 'sim' | 'nao' | 'nao_sei';

/**
 * O relato vai dentro da URL do WhatsApp. Texto acentuado infla ao ser
 * codificado (`ç` vira `%C3%A7`), então o limite é curto de propósito —
 * ver LIMITE_URL_WHATSAPP em whatsapp-message.ts.
 */
export const LIMITE_RELATO = 500;

export interface TriagemRespostas {
  situacao: SituacaoValue | null;
  etapa: EtapaValue | null;
  urgencia: UrgenciaValue | null;
  apreensao: ApreensaoValue[];
  laudo: LaudoValue | null;
  numeroProcesso: string;
  relato: string;
  nome: string;
  telefone: string;
  email: string;
  consentimento: boolean;
}

export function criarRespostasVazias(): TriagemRespostas {
  return {
    situacao: null,
    etapa: null,
    urgencia: null,
    apreensao: [],
    laudo: null,
    numeroProcesso: '',
    relato: '',
    nome: '',
    telefone: '',
    email: '',
    consentimento: false,
  };
}
