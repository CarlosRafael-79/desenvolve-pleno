import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isNavigating: boolean;
  showFormModal: boolean;
  showImageModal: boolean;
  toast: {
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  };
  sidebarOpen: boolean;
}

const initialState: UIState = {
  isNavigating: false,
  showFormModal: false,
  showImageModal: false,
  toast: {
    message: '',
    type: 'info',
    isVisible: false,
  },
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNavigating: (state, action: PayloadAction<boolean>) => {
      state.isNavigating = action.payload;
    },
    setShowFormModal: (state, action: PayloadAction<boolean>) => {
      state.showFormModal = action.payload;
    },
    setShowImageModal: (state, action: PayloadAction<boolean>) => {
      state.showImageModal = action.payload;
    },
    setToast: (state, action: PayloadAction<Partial<UIState['toast']>>) => {
      state.toast = { ...state.toast, ...action.payload };
    },
    hideToast: (state) => {
      state.toast.isVisible = false;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    resetUI: () => {
      return { ...initialState };
    },
  },
});

export const {
  setNavigating,
  setShowFormModal,
  setShowImageModal,
  setToast,
  hideToast,
  setSidebarOpen,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
