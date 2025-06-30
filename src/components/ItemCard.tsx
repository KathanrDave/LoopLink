import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Item } from '../context/AppContext';

interface ItemCardProps {
  item: Item;
  compact?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, compact = false }) => {
  const { currentCommunity } = useApp();
  
  const owner = currentCommunity?.members.find(member => member.id === item.owner);
  const borrower = item.borrower ? currentCommunity?.members.find(member => member.id === item.borrower) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-amber-100 text-amber-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
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
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
        {/* Item Image/Icon */}
        <div className={`bg-gray-100 rounded-t-xl flex items-center justify-center ${compact ? 'h-20' : 'h-32'}`}>
          <span className={`${compact ? 'text-2xl' : 'text-4xl'}`}>{item.image}</span>
        </div>

        {/* Item Info */}
        <div className="p-3 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold text-gray-900 line-clamp-1 ${compact ? 'text-sm' : 'text-base'}`}>
              {item.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {getStatusText(item.status)}
            </span>
          </div>

          {!compact && (
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{owner?.name}</span>
            </div>
            {item.status === 'borrowed' && item.dueDate && (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Due {new Date(item.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {item.status === 'borrowed' && borrower && (
            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Borrowed by {borrower.name}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;