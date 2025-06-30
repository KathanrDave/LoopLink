import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, User, MessageCircle, Settings, Clock, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/date';
import { useApp, ActivityItem } from '../../context/AppContext';
import GlassmorphicCard from '../GlassmorphicCard';

interface ActivityFeedProps {
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  maxItems = 10,
  showHeader = true,
  className = '',
}) => {
  const { activities, currentLoop } = useApp();
  const displayActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'item_shared':
      case 'item_borrowed':
      case 'item_returned':
        return <Package className="w-5 h-5 text-indigo-600" />;
      case 'event_created':
      case 'event_joined':
        return <Calendar className="w-5 h-5 text-emerald-600" />;
      case 'member_joined':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'message_sent':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'loop_updated':
        return <Settings className="w-5 h-5 text-amber-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityTitle = (activity: ActivityItem) => {
    const { type, data, userId } = activity;
    
    switch (type) {
      case 'item_shared':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.userName}</span> shared{' '}
            <Link to={`/app/item/${data.itemId}`} className="font-semibold text-indigo-600 hover:text-indigo-700">
              {data.itemTitle}
            </Link>
          </>
        );
      case 'item_borrowed':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.borrowerName}</span> borrowed{' '}
            <Link to={`/app/item/${data.itemId}`} className="font-semibold text-indigo-600 hover:text-indigo-700">
              {data.itemTitle}
            </Link>
          </>
        );
      case 'item_returned':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.borrowerName}</span> returned{' '}
            <Link to={`/app/item/${data.itemId}`} className="font-semibold text-indigo-600 hover:text-indigo-700">
              {data.itemTitle}
            </Link>
          </>
        );
      case 'event_created':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.organizerName}</span> created event{' '}
            <Link to={`/app/events`} className="font-semibold text-emerald-600 hover:text-emerald-700">
              {data.eventTitle}
            </Link>
          </>
        );
      case 'event_joined':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.userName}</span> is attending{' '}
            <Link to={`/app/events`} className="font-semibold text-emerald-600 hover:text-emerald-700">
              {data.eventTitle}
            </Link>
          </>
        );
      case 'member_joined':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.userName}</span> joined the loop
          </>
        );
      case 'message_sent':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.userName}</span> sent a message
          </>
        );
      case 'loop_updated':
        return (
          <>
            <span className="font-semibold text-gray-900">{data.userName}</span> updated loop settings
          </>
        );
      default:
        return 'Activity occurred';
    }
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Loop Activity</h2>
              <p className="text-gray-600">What's happening in {currentLoop?.name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity) => (
            <GlassmorphicCard key={activity.id} className="p-4 hover:scale-[1.01] transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {getActivityTitle(activity)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-medium">
                    {formatDistanceToNow(activity.timestamp)} ago
                  </p>
                </div>
              </div>
            </GlassmorphicCard>
          ))
        ) : (
          <GlassmorphicCard className="p-8 text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
            <p className="text-gray-600">Start sharing items and creating events to see activity here!</p>
          </GlassmorphicCard>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;