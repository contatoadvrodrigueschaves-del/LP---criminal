export type SituacaoValue =
  | 'intimacao'
  | 'investigado'
  | 'bens_bloqueados'
  | 'busca_apreensao'
  | 'operacao_empresa';

export type EtapaValue = 'nao_chamado' | 'ja_depos' | 'denuncia_formal' | 'nao_sei';

export type UrgenciaValue = 'urgente' | 'proximos_dias' | 'apenas_informando';

export interface TriagemRespostas {
  situacao: SituacaoValue | null;
  etapa: EtapaValue | null;
  urgencia: UrgenciaValue | null;
  nome: string;
  telefone: string;
  email: string;
}

export function criarRespostasVazias(): TriagemRespostas {
  return {
    situacao: null,
    etapa: null,
    urgencia: null,
    nome: '',
    telefone: '',
    email: '',
  };
}
