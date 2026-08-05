import type { EtapaValue, SituacaoValue, UrgenciaValue } from '../types/triagem';

export const SITUACAO_OPTIONS: { value: SituacaoValue; label: string }[] = [
  { value: 'intimacao', label: 'Recebi intimação' },
  { value: 'investigado', label: 'Estou sendo investigado' },
  { value: 'bens_bloqueados', label: 'Tive bens bloqueados' },
  { value: 'busca_apreensao', label: 'Houve busca e apreensão ou prisão' },
  { value: 'operacao_empresa', label: 'Minha empresa foi alvo de operação policial' },
];

export const ETAPA_OPTIONS: { value: EtapaValue; label: string }[] = [
  { value: 'nao_chamado', label: 'Ainda não fui chamado a depor' },
  { value: 'ja_depos', label: 'Já prestei depoimento' },
  { value: 'denuncia_formal', label: 'Já existe denúncia formal' },
  { value: 'nao_sei', label: 'Não sei dizer' },
];

export const URGENCIA_OPTIONS: { value: UrgenciaValue; label: string }[] = [
  { value: 'urgente', label: 'É urgente (prisão, busca em andamento)' },
  { value: 'proximos_dias', label: 'Preciso de orientação nos próximos dias' },
  { value: 'apenas_informando', label: 'Estou apenas me informando' },
];

export function labelFor<T extends string>(
  options: { value: T; label: string }[],
  value: T | null,
): string {
  return options.find((option) => option.value === value)?.label ?? 'Não informado';
}
