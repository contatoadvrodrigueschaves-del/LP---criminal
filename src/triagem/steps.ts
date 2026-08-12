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

/**
 * Códigos estáveis enviados pro dataLayer/GTM — desacoplados do texto
 * exibido na interface (que pode mudar de redação a qualquer momento) e do
 * nome interno do enum (que pode ser refatorado por motivos de código sem
 * relação com tracking). Qualquer mudança nesses valores deve ser combinada
 * com quem configura os gatilhos no GTM/Google Ads.
 */
export const AREA_INTERESSE_CODES: Record<SituacaoValue, string> = {
  intimacao: 'intimacao',
  investigado: 'investigado',
  bens_bloqueados: 'bens_bloqueados',
  busca_apreensao: 'busca_apreensao',
  operacao_empresa: 'operacao_empresa',
};

export type UrgenciaCode = 'alta' | 'media' | 'baixa';

export const URGENCIA_CODES: Record<UrgenciaValue, UrgenciaCode> = {
  urgente: 'alta',
  proximos_dias: 'media',
  apenas_informando: 'baixa',
};

const VALOR_LEAD_POR_URGENCIA: Record<UrgenciaCode, number> = {
  alta: 200,
  media: 120,
  baixa: 60,
};

const CODIGO_NAO_INFORMADO = 'nao_informado';

export interface TriagemTrackingData {
  areaInteresse: string;
  urgenciaCode: string;
  valorLead: number;
}

/** Converte as respostas da triagem nos códigos estáveis usados no tracking. */
export function getTriagemTrackingData(
  situacao: SituacaoValue | null,
  urgencia: UrgenciaValue | null,
): TriagemTrackingData {
  const areaInteresse = situacao ? AREA_INTERESSE_CODES[situacao] : CODIGO_NAO_INFORMADO;
  const urgenciaCode = urgencia ? URGENCIA_CODES[urgencia] : CODIGO_NAO_INFORMADO;
  const valorLead = urgencia ? VALOR_LEAD_POR_URGENCIA[URGENCIA_CODES[urgencia]] : 0;

  return { areaInteresse, urgenciaCode, valorLead };
}
