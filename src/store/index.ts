import { configureStore } from '@reduxjs/toolkit';
import desaparecidosReducer from './slices/desaparecidosSlice';
import filtrosReducer from './slices/filtrosSlice';
import estatisticasReducer from './slices/estatisticasSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    desaparecidos: desaparecidosReducer,
    filtros: filtrosReducer,
    estatisticas: estatisticasReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
