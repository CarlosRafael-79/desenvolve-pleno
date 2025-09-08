import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setNavigating,
  setShowFormModal,
  setShowImageModal,
  setToast,
  hideToast,
  setSidebarOpen,
  resetUI,
} from '../store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.ui);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    dispatch(setToast({ message, type, isVisible: true }));
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      dispatch(hideToast());
    }, 5000);
  };

  const showSuccessToast = (message: string) => {
    showToast(message, 'success');
  };

  const showErrorToast = (message: string) => {
    showToast(message, 'error');
  };

  const showInfoToast = (message: string) => {
    showToast(message, 'info');
  };

  return {
    // State
    isNavigating: ui.isNavigating,
    showFormModal: ui.showFormModal,
    showImageModal: ui.showImageModal,
    toast: ui.toast,
    sidebarOpen: ui.sidebarOpen,
    
    // Actions
    setNavigating: (navigating: boolean) => dispatch(setNavigating(navigating)),
    setShowFormModal: (show: boolean) => dispatch(setShowFormModal(show)),
    setShowImageModal: (show: boolean) => dispatch(setShowImageModal(show)),
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    hideToast: () => dispatch(hideToast()),
    resetUI: () => dispatch(resetUI()),
    
    // Toast helpers
    showToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
  };
};
