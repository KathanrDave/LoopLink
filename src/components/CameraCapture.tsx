import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RotateCcw, Image, Check } from 'lucide-react';
import { cameraService, PhotoResult } from '../services/camera';
import NeuomorphicButton from './NeuomorphicButton';

interface CameraCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoTaken: (photo: PhotoResult) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ isOpen, onClose, onPhotoTaken }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoResult | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      checkCameraAvailability();
    } else {
      cleanup();
    }

    return cleanup;
  }, [isOpen]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const checkCameraAvailability = async () => {
    try {
      const available = await cameraService.hasCamera();
      setHasCamera(available);
      
      if (available) {
        await startCamera();
      }
    } catch (error) {
      setError('Failed to check camera availability');
    }
  };

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const video = await cameraService.startCamera({ facingMode });
      videoRef.current = video;
      
      if (containerRef.current) {
        containerRef.current.appendChild(video);
      }
    } catch (error) {
      setError('Failed to start camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    try {
      const photo = await cameraService.takePhoto({ quality: 0.8 });
      setCapturedPhoto(photo);
    } catch (error) {
      setError('Failed to take photo');
    } finally {
      setIsLoading(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onPhotoTaken(capturedPhoto);
      onClose();
    }
  };

  const selectFromGallery = async () => {
    setIsLoading(true);
    try {
      const photo = await cameraService.selectFromGallery();
      const compressed = await cameraService.compressImage(photo.file, 800, 0.8);
      onPhotoTaken(compressed);
      onClose();
    } catch (error) {
      setError('Failed to select photo from gallery');
    } finally {
      setIsLoading(false);
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    cleanup();
    await startCamera();
  };

  const cleanup = () => {
    cameraService.stopCamera();
    if (videoRef.current && containerRef.current) {
      containerRef.current.removeChild(videoRef.current);
      videoRef.current = null;
    }
    setCapturedPhoto(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md">
      {/* Camera Container */}
      <div ref={modalRef} className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-black/50">
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h2 className="text-white font-semibold">Take Photo</h2>
          
          {hasCamera && !capturedPhoto && (
            <button
              onClick={switchCamera}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Camera View */}
        <div className="flex-1 flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="text-white text-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Loading camera...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
              <div className="text-white text-center p-6">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="mb-4">{error}</p>
                <NeuomorphicButton onClick={selectFromGallery} variant="primary">
                  <div className="flex items-center space-x-2">
                    <Image className="w-4 h-4" />
                    <span>Choose from Gallery</span>
                  </div>
                </NeuomorphicButton>
              </div>
            </div>
          )}

          {capturedPhoto && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <img
                src={capturedPhoto.dataUrl}
                alt="Captured"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {!error && !capturedPhoto && (
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center"
            />
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/50">
          {capturedPhoto ? (
            <div className="flex items-center justify-center space-x-6">
              <NeuomorphicButton onClick={retakePhoto} variant="secondary">
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5" />
                  <span>Retake</span>
                </div>
              </NeuomorphicButton>
              
              <NeuomorphicButton onClick={confirmPhoto} variant="accent" size="lg">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>Use Photo</span>
                </div>
              </NeuomorphicButton>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-6">
              <NeuomorphicButton onClick={selectFromGallery} variant="secondary">
                <Image className="w-6 h-6" />
              </NeuomorphicButton>
              
              <button
                onClick={takePhoto}
                disabled={isLoading || !!error}
                className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 hover:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
              </button>
              
              <div className="w-12 h-12"></div> {/* Spacer for symmetry */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;