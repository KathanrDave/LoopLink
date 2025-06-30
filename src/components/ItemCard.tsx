import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from './GlassmorphicCard';
import StatusIndicator from './ui/StatusIndicator';

interface ItemCardProps {
  item: any;
  compact?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, compact = false }) => {
  const { currentLoop } = useApp();
  
  const owner = currentLoop?.members.find(member => member.id === item.owner_id);
  const borrower = item.borrower_id ? currentLoop?.members.find(member => member.id === item.borrower_id) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white';
      case 'borrowed': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'maintenance': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'borrowed': return 'Borrowed';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  return (
    <Link to={`/app/item/${item.id}`} className="block">
      <GlassmorphicCard className="overflow-hidden group">
        {/* Item Image/Icon */}
        <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${compact ? 'h-24' : 'h-36'}`}>
          <span className={`${compact ? 'text-3xl' : 'text-5xl'} filter drop-shadow-sm`}>{item.image}</span>
        </div>

        {/* Item Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
              {item.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(item.status)}`}>
              {getStatusText(item.status)}
            </span>
          </div>

          {!compact && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{item.description}</p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <User className="w-3 h-3" />
              <span className="font-medium">{owner?.name}</span>
            </div>
            {item.status === 'borrowed' && item.due_date && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Due {new Date(item.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {item.status === 'borrowed' && borrower && (
            <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
              Borrowed by <span className="font-semibold">{borrower.name}</span>
            </div>
          )}
        </div>
      </GlassmorphicCard>
    </Link>
  );
};

export default ItemCard;