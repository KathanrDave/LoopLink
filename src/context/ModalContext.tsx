import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define all possible modal types in the application
export type ModalType = 'chat' | 'qr' | 'camera' | 'subscription' | null;

interface ModalContextType {
  activeModal: ModalType;
  modalData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  isModalOpen: (type: ModalType) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<any>(null);

  // Open a modal with optional data
  const openModal = useCallback((type: ModalType, data?: any) => {
    // Close any existing modal first
    if (activeModal) {
      closeModal();
    }
    
    // Set body to prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
    
    setActiveModal(type);
    setModalData(data);
  }, [activeModal]);

  // Close the active modal
  const closeModal = useCallback(() => {
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
    
    setActiveModal(null);
    setModalData(null);
  }, []);

  // Check if a specific modal is open
  const isModalOpen = useCallback((type: ModalType) => {
    return activeModal === type;
  }, [activeModal]);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalData,
        openModal,
        closeModal,
        isModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};