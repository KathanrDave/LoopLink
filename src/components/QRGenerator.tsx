import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Copy, X, Building2, Users, MapPin } from 'lucide-react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from './GlassmorphicCard';
import NeuomorphicButton from './NeuomorphicButton';

interface QRGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'join' | 'profile' | 'event' | 'item';
  data?: any;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ isOpen, onClose, type, data }) => {
  const { currentLoop, currentUser } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      generateQR();
    }
  }, [isOpen, type, data]);

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

  const generateQR = async () => {
    if (!currentLoop) return;

    setLoading(true);
    try {
      let qrData = '';
      
      switch (type) {
        case 'join':
          qrData = `https://looplink.app/join/${currentLoop.code}`;
          break;
        case 'profile':
          if (currentLoop.type === 'organization') {
            qrData = JSON.stringify({
              type: 'organization_profile',
              loopId: currentLoop.id,
              loopName: currentLoop.name,
              code: currentLoop.code,
              description: currentLoop.description,
              adminId: currentLoop.adminId,
              memberCount: currentLoop.members.length,
              settings: currentLoop.settings,
              joinUrl: `https://looplink.app/join/${currentLoop.code}`,
              contactInfo: {
                email: currentUser?.email,
                name: currentUser?.name
              },
              socialLinks: data?.socialLinks || {},
              website: data?.website || '',
              address: data?.address || '',
              phone: data?.phone || ''
            });
          } else {
            qrData = `https://looplink.app/profile/${currentUser?.id}`;
          }
          break;
        case 'event':
          qrData = JSON.stringify({
            type: 'event',
            eventId: data?.id,
            title: data?.title,
            date: data?.date,
            time: data?.time,
            location: data?.location,
            loopCode: currentLoop.code,
            joinUrl: `https://looplink.app/event/${data?.id}`
          });
          break;
        case 'item':
          qrData = JSON.stringify({
            type: 'item',
            itemId: data?.id,
            title: data?.title,
            owner: data?.owner,
            status: data?.status,
            loopCode: currentLoop.code,
            viewUrl: `https://looplink.app/item/${data?.id}`
          });
          break;
      }

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });

      setQrDataUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `${currentLoop?.name}-${type}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const shareQR = async () => {
    if (!qrDataUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const file = new File([blob], `${currentLoop?.name}-${type}-qr.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${currentLoop?.name} - ${type.charAt(0).toUpperCase() + type.slice(1)} QR Code`,
          text: `Scan this QR code to ${type === 'join' ? 'join' : 'view'} ${currentLoop?.name}`,
          files: [file]
        });
      } else {
        // Fallback to copying URL
        copyToClipboard();
      }
    } catch (error) {
      console.error('Failed to share QR code:', error);
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      let textToCopy = '';
      
      if (type === 'join') {
        textToCopy = `Join ${currentLoop?.name} on LoopLink: https://looplink.app/join/${currentLoop?.code}`;
      } else {
        textToCopy = `Check out ${currentLoop?.name} on LoopLink: https://looplink.app/loop/${currentLoop?.id}`;
      }

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'join': return `Join ${currentLoop?.name}`;
      case 'profile': return currentLoop?.type === 'organization' ? 'Organization Profile' : 'User Profile';
      case 'event': return `Event: ${data?.title}`;
      case 'item': return `Item: ${data?.title}`;
      default: return 'QR Code';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'join': 
        return `Scan this QR code to join ${currentLoop?.name} and start connecting with the community.`;
      case 'profile':
        if (currentLoop?.type === 'organization') {
          return 'Scan to view organization details, contact information, and join the loop.';
        }
        return 'Scan to view user profile and connect.';
      case 'event':
        return `Scan to view event details and RSVP for ${data?.title}.`;
      case 'item':
        return `Scan to view item details and availability for ${data?.title}.`;
      default:
        return 'Scan this QR code for more information.';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'join': return currentLoop?.type === 'organization' ? Building2 : currentLoop?.type === 'neighborhood' ? MapPin : Users;
      case 'profile': return currentLoop?.type === 'organization' ? Building2 : Users;
      case 'event': return '📅';
      case 'item': return '📦';
      default: return '🔗';
    }
  };

  if (!isOpen) return null;

  const IconComponent = getIcon();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <GlassmorphicCard ref={modalRef} className="w-full max-w-md">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                {typeof IconComponent === 'string' ? (
                  <span className="text-lg text-white">{IconComponent}</span>
                ) : (
                  <IconComponent className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{getTitle()}</h3>
                <p className="text-sm text-gray-600">QR Code</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QR Code */}
          <div className="text-center">
            {loading ? (
              <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
              </div>
            ) : qrDataUrl ? (
              <div className="bg-white p-4 rounded-xl shadow-inner mx-auto inline-block">
                <img src={qrDataUrl} alt="QR Code" className="w-64 h-64" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center mx-auto">
                <p className="text-gray-500">Failed to generate QR code</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              {getDescription()}
            </p>
          </div>

          {/* Organization Profile Details */}
          {type === 'profile' && currentLoop?.type === 'organization' && (
            <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-indigo-900">Organization Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Members:</span>
                  <span className="text-indigo-900 font-medium">{currentLoop.members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Loop Code:</span>
                  <span className="text-indigo-900 font-mono">{currentLoop.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Admin:</span>
                  <span className="text-indigo-900 font-medium">{currentUser?.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <NeuomorphicButton
              onClick={downloadQR}
              variant="secondary"
              size="sm"
              className="flex flex-col items-center space-y-1"
            >
              <Download className="w-4 h-4" />
              <span className="text-xs">Download</span>
            </NeuomorphicButton>

            <NeuomorphicButton
              onClick={shareQR}
              variant="secondary"
              size="sm"
              className="flex flex-col items-center space-y-1"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">Share</span>
            </NeuomorphicButton>

            <NeuomorphicButton
              onClick={copyToClipboard}
              variant="secondary"
              size="sm"
              className="flex flex-col items-center space-y-1"
            >
              <Copy className="w-4 h-4" />
              <span className="text-xs">{copied ? 'Copied!' : 'Copy Link'}</span>
            </NeuomorphicButton>
          </div>

          {/* Loop Info */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Powered by LoopLink • {currentLoop?.name}
            </p>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default QRGenerator;