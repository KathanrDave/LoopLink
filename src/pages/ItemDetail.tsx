import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, QrCode, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import QRCodeDisplay from '../components/QRCodeDisplay';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLoop, currentUser, updateItem } = useApp();
  const [showQR, setShowQR] = useState(false);

  if (!currentLoop || !currentUser || !id) {
    return <div>Loading...</div>;
  }

  const item = currentLoop.items.find(item => item.id === id);
  if (!item) {
    return <div>Item not found</div>;
  }

  const owner = currentLoop.members.find(member => member.id === item.owner);
  const borrower = item.borrower ? currentLoop.members.find(member => member.id === item.borrower) : null;
  const isOwner = item.owner === currentUser.id;
  const isBorrower = item.borrower === currentUser.id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'borrowed': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'maintenance': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBorrow = () => {
    if (item.status === 'available') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now
      
      updateItem(item.id, {
        status: 'borrowed',
        borrower: currentUser.id,
        dueDate: dueDate.toISOString().split('T')[0]
      });
    }
  };

  const handleReturn = () => {
    updateItem(item.id, {
      status: 'available',
      borrower: undefined,
      dueDate: undefined
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      // In a real app, this would call a delete function
      navigate('/app/share');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="px-4 py-6 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/app/share" className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Item Details</h1>
          </div>
          {isOwner && (
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Edit className="w-5 h-5" />
              </button>
              <button 
                onClick={handleDelete}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Item Image */}
        <GlassmorphicCard className="overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-8xl">{item.image}</span>
          </div>
        </GlassmorphicCard>

        {/* Item Info */}
        <GlassmorphicCard className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getStatusColor(item.status)}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/50 rounded-xl">
              <p className="text-gray-600 text-sm">Category</p>
              <p className="font-bold text-gray-900">{item.category}</p>
            </div>
            <div className="p-3 bg-white/50 rounded-xl">
              <p className="text-gray-600 text-sm">Added</p>
              <p className="font-bold text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Owner Info */}
        <GlassmorphicCard className="p-4">
          <h3 className="font-bold text-gray-900 mb-4">Owner</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg shadow-lg">
              <span>{owner?.avatar}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{owner?.name}</p>
              <p className="text-sm text-gray-600">Reputation: {owner?.reputation}/100</p>
            </div>
            <NeuomorphicButton variant="secondary" size="sm">
              <MessageCircle className="w-4 h-4" />
            </NeuomorphicButton>
          </div>
        </GlassmorphicCard>

        {/* Borrower Info */}
        {item.status === 'borrowed' && borrower && (
          <GlassmorphicCard className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-4">Currently Borrowed</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-lg shadow-lg">
                <span>{borrower.avatar}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-amber-900">{borrower.name}</p>
                {item.dueDate && (
                  <div className="flex items-center space-x-1 text-sm text-amber-700">
                    <Clock className="w-3 h-3" />
                    <span>Due {new Date(item.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassmorphicCard>
        )}

        {/* QR Code Section */}
        {(isOwner || isBorrower) && (
          <GlassmorphicCard className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">QR Code</h3>
              <NeuomorphicButton
                onClick={() => setShowQR(!showQR)}
                variant="secondary"
                size="sm"
              >
                <div className="flex items-center space-x-2">
                  <QrCode className="w-4 h-4" />
                  <span>{showQR ? 'Hide' : 'Show'} QR</span>
                </div>
              </NeuomorphicButton>
            </div>
            {showQR && (
              <div className="text-center">
                <QRCodeDisplay value={`looplink://item/${item.id}`} />
                <p className="text-sm text-gray-600 mt-3 font-medium">
                  Scan to {item.status === 'borrowed' ? 'return' : 'borrow'} this item
                </p>
              </div>
            )}
          </GlassmorphicCard>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {item.status === 'available' && !isOwner && (
            <NeuomorphicButton
              onClick={handleBorrow}
              variant="primary"
              className="w-full"
              size="lg"
            >
              Borrow This Item
            </NeuomorphicButton>
          )}

          {item.status === 'borrowed' && isBorrower && (
            <NeuomorphicButton
              onClick={handleReturn}
              variant="accent"
              className="w-full"
              size="lg"
            >
              Return This Item
            </NeuomorphicButton>
          )}

          {item.status === 'maintenance' && isOwner && (
            <NeuomorphicButton
              onClick={() => updateItem(item.id, { status: 'available' })}
              variant="accent"
              className="w-full"
              size="lg"
            >
              Mark as Available
            </NeuomorphicButton>
          )}

          {!isOwner && (
            <NeuomorphicButton
              variant="secondary"
              className="w-full"
              size="lg"
            >
              Message Owner
            </NeuomorphicButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;