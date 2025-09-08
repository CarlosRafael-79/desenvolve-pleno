import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DesaparecidosService } from '../../services/desaparecidosService';
import { EstatisticasResponse } from '../../types/api';

interface EstatisticasState {
  data: EstatisticasResponse | null;
  loading: boolean;
  error: string | null;
  ultimaAtualizacao: string | null;
}

const initialState: EstatisticasState = {
  data: null,
  loading: false,
  error: null,
  ultimaAtualizacao: null,
};

export const buscarEstatisticas = createAsyncThunk(
  'estatisticas/buscarEstatisticas',
  async () => {
    const response = await DesaparecidosService.buscarEstatisticas();
    return response;
  }
);

const estatisticasSlice = createSlice({
  name: 'estatisticas',
  initialState,
  reducers: {
    limparErro: (state) => {
      state.error = null;
    },
    resetarEstado: (state) => {
      state.data = null;
      state.error = null;
      state.ultimaAtualizacao = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buscarEstatisticas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buscarEstatisticas.fulfilled, (state, action: PayloadAction<EstatisticasResponse>) => {
        state.loading = false;
        state.data = action.payload;
        state.ultimaAtualizacao = new Date().toISOString();
      })
      .addCase(buscarEstatisticas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar estatísticas';
      });
  },
});

export const { limparErro, resetarEstado } = estatisticasSlice.actions;
export default estatisticasSlice.reducer;
