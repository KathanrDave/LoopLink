import React, { useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import Chat from '../Chat';
import QRGenerator from '../QRGenerator';
import CameraCapture from '../CameraCapture';
import SubscriptionUpgrade from '../SubscriptionUpgrade';
import { cameraService, PhotoResult } from '../../services/camera';

const ModalManager: React.FC = () => {
  const { activeModal, modalData, closeModal } = useModal();

  // Handle escape key to close modals
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeModal) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [activeModal, closeModal]);

  // Handle photo capture
  const handlePhotoTaken = (photo: PhotoResult) => {
    console.log('Photo taken:', photo);
    closeModal();
    
    // If there's a callback in modalData, call it with the photo
    if (modalData?.onPhotoTaken) {
      modalData.onPhotoTaken(photo);
    }
  };

  // Render the appropriate modal based on activeModal
  return (
    <>
      {/* Chat Modal */}
      <Chat 
        isOpen={activeModal === 'chat'} 
        onClose={closeModal}
        roomId={modalData?.roomId}
      />

      {/* QR Generator Modal */}
      <QRGenerator
        isOpen={activeModal === 'qr'}
        onClose={closeModal}
        type={modalData?.type || 'profile'}
        data={modalData?.data}
      />

      {/* Camera Capture Modal */}
      <CameraCapture
        isOpen={activeModal === 'camera'}
        onClose={closeModal}
        onPhotoTaken={handlePhotoTaken}
      />

      {/* Subscription Upgrade Modal */}
      <SubscriptionUpgrade
        isOpen={activeModal === 'subscription'}
        onClose={closeModal}
        currentPlan={modalData?.currentPlan}
      />
    </>
  );
};

export default ModalManager;