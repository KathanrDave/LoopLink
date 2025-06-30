import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MessageCircle, QrCode, Camera, Users, Settings, BarChart3, Crown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../context/ModalContext';
import GlassmorphicCard from '../GlassmorphicCard';
import NeuomorphicButton from '../NeuomorphicButton';
import PermissionGate from '../rbac/PermissionGate';

interface ActionCenterProps {
  className?: string;
}

const ActionCenter: React.FC<ActionCenterProps> = ({ className = '' }) => {
  const { currentLoop, currentUser, hasPermission, isAdmin } = useApp();
  const { openModal } = useModal();

  if (!currentLoop || !currentUser) return null;

  const quickActions = [
    {
      id: 'chat',
      label: 'Loop Chat',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      permission: 'access_chat',
      action: () => openModal('chat', { roomId: currentLoop.id })
    },
    {
      id: 'qr',
      label: 'QR Code',
      icon: QrCode,
      color: 'from-purple-500 to-indigo-500',
      permission: 'generate_qr',
      action: () => openModal('qr', { type: 'join' })
    },
    {
      id: 'camera',
      label: 'Camera',
      icon: Camera,
      color: 'from-emerald-500 to-teal-500',
      permission: 'create_item',
      action: () => openModal('camera', { 
        onPhotoTaken: (photo: any) => console.log('Photo taken:', photo)
      })
    }
  ];

  const createActions = [
    {
      id: 'create-item',
      label: 'Share Item',
      icon: Plus,
      color: 'from-indigo-500 to-purple-500',
      permission: 'create_item',
      href: '/app/create-item'
    },
    {
      id: 'create-event',
      label: 'Plan Event',
      icon: Calendar,
      color: 'from-emerald-500 to-green-500',
      permission: 'create_event',
      href: '/app/create-event'
    }
  ];

  const adminActions = [
    {
      id: 'manage-members',
      label: 'Manage Members',
      icon: Users,
      color: 'from-amber-500 to-orange-500',
      permission: 'manage_loop'
    },
    {
      id: 'loop-settings',
      label: 'Loop Settings',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      permission: 'manage_loop'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'from-pink-500 to-rose-500',
      permission: 'view_analytics'
    }
  ];

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Action Center</h2>
            <p className="text-gray-600">Quick actions for your loop</p>
          </div>
        </div>

        {/* Quick Actions */}
        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <PermissionGate key={action.id} permission={action.permission}>
                <button
                  onClick={action.action}
                  className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-200 hover:scale-105 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-900 text-center">{action.label}</span>
                </button>
              </PermissionGate>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Create Actions */}
        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create</h3>
          <div className="space-y-3">
            {createActions.map((action) => (
              <PermissionGate key={action.id} permission={action.permission}>
                <Link to={action.href || '#'}>
                  <NeuomorphicButton
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{action.label}</span>
                    </div>
                  </NeuomorphicButton>
                </Link>
              </PermissionGate>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Admin Actions */}
        <PermissionGate role="admin">
          <GlassmorphicCard className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-amber-900">Admin Tools</h3>
            </div>
            <div className="space-y-3">
              {adminActions.map((action) => (
                <PermissionGate key={action.id} permission={action.permission}>
                  <NeuomorphicButton
                    variant="secondary"
                    className="w-full justify-start"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{action.label}</span>
                    </div>
                  </NeuomorphicButton>
                </PermissionGate>
              ))}
            </div>
          </GlassmorphicCard>
        </PermissionGate>

        {/* Loop Stats */}
        <GlassmorphicCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loop Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <span className="text-gray-700 font-medium">Active Items</span>
              <span className="text-2xl font-bold text-indigo-600">
                {currentLoop.items.filter(item => item.status === 'available').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <span className="text-gray-700 font-medium">Members</span>
              <span className="text-2xl font-bold text-emerald-600">
                {currentLoop.members.length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
              <span className="text-gray-700 font-medium">Upcoming Events</span>
              <span className="text-2xl font-bold text-purple-600">
                {currentLoop.events.length}
              </span>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Role Badge */}
        <GlassmorphicCard className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isAdmin() ? 'bg-amber-500' : 
              currentUser.role === 'member' ? 'bg-blue-500' : 'bg-gray-500'
            }`}></div>
            <span className="text-sm font-medium text-gray-900 capitalize">
              {currentUser.role}
            </span>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
};

export default ActionCenter;