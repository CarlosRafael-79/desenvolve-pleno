import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DesaparecidosService } from '../../services/desaparecidosService';
import { ApiResponse, PessoaDesaparecida, FiltroParams } from '../../types/api';

interface DesaparecidosState {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pessoaSelecionada: PessoaDesaparecida | null;
}

const initialState: DesaparecidosState = {
  data: null,
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  pessoaSelecionada: null,
};

// Async thunk para buscar pessoas
export const buscarPessoasDesaparecidas = createAsyncThunk(
  'desaparecidos/buscarPessoas',
  async (filtros: FiltroParams = {}) => {
    const response = await DesaparecidosService.buscarPessoasDesaparecidas(filtros);
    return response;
  }
);

// Async thunk para buscar pessoa por ID
export const buscarPessoaPorId = createAsyncThunk(
  'desaparecidos/buscarPessoaPorId',
  async (id: number) => {
    const response = await DesaparecidosService.buscarPessoaPorId(id);
    return response;
  }
);

const desaparecidosSlice = createSlice({
  name: 'desaparecidos',
  initialState,
  reducers: {
    limparErro: (state) => {
      state.error = null;
    },
    resetarEstado: (state) => {
      state.data = null;
      state.error = null;
      state.currentPage = 0;
      state.totalPages = 0;
      state.totalElements = 0;
      state.pessoaSelecionada = null;
    },
    setPessoaSelecionada: (state, action: PayloadAction<PessoaDesaparecida | null>) => {
      state.pessoaSelecionada = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Buscar pessoas
      .addCase(buscarPessoasDesaparecidas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buscarPessoasDesaparecidas.fulfilled, (state, action: PayloadAction<ApiResponse>) => {
        state.loading = false;
        state.data = action.payload;
        state.currentPage = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(buscarPessoasDesaparecidas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar pessoas desaparecidas';
      })
      // Buscar pessoa por ID
      .addCase(buscarPessoaPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buscarPessoaPorId.fulfilled, (state, action: PayloadAction<PessoaDesaparecida>) => {
        state.loading = false;
        state.pessoaSelecionada = action.payload;
        
        // Atualizar pessoa específica no array se existir
        if (state.data?.content) {
          const index = state.data.content.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            state.data.content[index] = action.payload;
          }
        }
      })
      .addCase(buscarPessoaPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao buscar pessoa';
      });
  },
});

export const { limparErro, resetarEstado, setPessoaSelecionada } = desaparecidosSlice.actions;
export default desaparecidosSlice.reducer;
