export interface CameraOptions {
  width?: number;
  height?: number;
  quality?: number;
  facingMode?: 'user' | 'environment';
}

export interface PhotoResult {
  dataUrl: string;
  blob: Blob;
  file: File;
}

export class CameraService {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state === 'granted';
    } catch (error) {
      console.warn('Permission API not supported, trying direct access');
      return this.hasCamera();
    }
  }

  async hasCamera(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Error checking for camera:', error);
      return false;
    }
  }

  async startCamera(options: CameraOptions = {}): Promise<HTMLVideoElement> {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: options.width || 1280 },
          height: { ideal: options.height || 720 },
          facingMode: options.facingMode || 'environment'
        }
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      this.video.autoplay = true;
      this.video.playsInline = true;
      
      return new Promise((resolve, reject) => {
        if (!this.video) {
          reject(new Error('Video element not created'));
          return;
        }

        this.video.onloadedmetadata = () => {
          resolve(this.video!);
        };

        this.video.onerror = () => {
          reject(new Error('Failed to load video'));
        };
      });
    } catch (error) {
      console.error('Error starting camera:', error);
      throw new Error('Failed to access camera. Please check permissions.');
    }
  }

  async takePhoto(options: CameraOptions = {}): Promise<PhotoResult> {
    if (!this.video || !this.stream) {
      throw new Error('Camera not started');
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas context');
    }

    // Set canvas dimensions
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    // Convert to different formats
    const quality = options.quality || 0.8;
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create blob'));
          return;
        }

        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });

        resolve({
          dataUrl,
          blob,
          file
        });
      }, 'image/jpeg', quality);
    });
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
  }

  async selectFromGallery(): Promise<PhotoResult> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';

      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          
          // Create blob from file
          const blob = new Blob([file], { type: file.type });
          
          resolve({
            dataUrl,
            blob,
            file
          });
        };

        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
      };

      input.click();
    });
  }

  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<PhotoResult> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();

      if (!context) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create compressed blob'));
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });

          resolve({
            dataUrl,
            blob,
            file: compressedFile
          });
        }, 'image/jpeg', quality);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export const cameraService = new CameraService();