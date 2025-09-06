export interface OcorrenciaEntrevDesapDTO {
  informacao: string | null;
  vestimentasDesaparecido: string;
}

export interface UltimaOcorrencia {
  dtDesaparecimento: string;
  dataLocalizacao: string | null;
  encontradoVivo: boolean;
  localDesaparecimentoConcat: string;
  ocorrenciaEntrevDesapDTO: OcorrenciaEntrevDesapDTO;
  listaCartaz: any | null;
  ocoId: number;
}

export interface PessoaDesaparecida {
  id: number;
  nome: string;
  idade: number;
  sexo: 'MASCULINO' | 'FEMININO';
  vivo: boolean;
  urlFoto: string | null;
  ultimaOcorrencia: UltimaOcorrencia;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface ApiResponse {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  content: PessoaDesaparecida[];
  number: number;
  sort: Sort;
  empty: boolean;
}

export interface FiltroParams {
  pagina?: number;
  porPagina?: number;
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: 'MASCULINO' | 'FEMININO';
  status?: 'DESAPARECIDO' | 'LOCALIZADO';
}

export interface EstatisticasResponse {
  quantPessoasDesaparecidas: number;
  quantPessoasEncontradas: number;
}

export interface InformacaoDesaparecido {
  ocoId: number;
  informacao: string;
  data: string;
  id: number;
  anexos: string[];
}

export type InformacoesDesaparecidoResponse = InformacaoDesaparecido[];