import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltroParams } from '../../types/api';

interface FiltrosState extends FiltroParams {
  historico: FiltroParams[];
}

const initialState: FiltrosState = {
  pagina: 0,
  porPagina: 12,
  nome: '',
  faixaIdadeInicial: undefined,
  faixaIdadeFinal: undefined,
  sexo: undefined,
  status: undefined,
  historico: [],
};

const filtrosSlice = createSlice({
  name: 'filtros',
  initialState,
  reducers: {
    atualizarFiltros: (state, action: PayloadAction<Partial<FiltroParams>>) => {
      // Atualizar o estado diretamente
      Object.assign(state, action.payload);
    },
    limparFiltros: (state) => {
      state.pagina = 0;
      state.porPagina = 12;
      state.nome = '';
      state.faixaIdadeInicial = undefined;
      state.faixaIdadeFinal = undefined;
      state.sexo = undefined;
      state.status = undefined;
      // Manter o histórico
    },
    voltarFiltroAnterior: (state) => {
      // Função simplificada - pode ser implementada depois
      if (state.historico.length > 0) {
        const filtroAnterior = state.historico.pop();
        if (filtroAnterior) {
          state.pagina = filtroAnterior.pagina || 0;
          state.porPagina = filtroAnterior.porPagina || 12;
          state.nome = filtroAnterior.nome || '';
          state.faixaIdadeInicial = filtroAnterior.faixaIdadeInicial;
          state.faixaIdadeFinal = filtroAnterior.faixaIdadeFinal;
          state.sexo = filtroAnterior.sexo;
          state.status = filtroAnterior.status;
        }
      }
    },
    atualizarPagina: (state, action: PayloadAction<number>) => {
      state.pagina = action.payload;
    },
    resetarPagina: (state) => {
      state.pagina = 0;
    },
  },
});

export const { 
  atualizarFiltros, 
  limparFiltros, 
  voltarFiltroAnterior, 
  atualizarPagina,
  resetarPagina
} = filtrosSlice.actions;

export default filtrosSlice.reducer;
