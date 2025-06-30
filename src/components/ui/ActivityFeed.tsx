import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, User, MessageCircle, Settings, Clock } from 'lucide-react';
import { formatDistanceToNow } from '../../utils/date';
import GlassmorphicCard from '../GlassmorphicCard';

export interface ActivityItem {
  id: string;
  type: 'item_shared' | 'item_borrowed' | 'item_returned' | 'event_created' | 'event_joined' | 'member_joined' | 'message_sent' | 'loop_updated';
  timestamp: number;
  userId: string;
  data: any;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems = 5,
  showHeader = true,
  className = '',
}) => {
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
            <span className="font-medium">{data.userName}</span> shared{' '}
            <Link to={`/app/item/${data.itemId}`} className="font-medium text-indigo-600 hover:text-indigo-700">
              {data.itemTitle}
            </Link>
          </>
        );
      case 'item_borrowed':
        return (
          <>
            <span className="font-medium">{data.borrowerName}</span> borrowed{' '}
            <Link to={`/app/item/${data.itemId}`} className="font-medium text-indigo-600 hover:text-indigo-700">
              {data.itemTitle}
            </Link>
          </>
        );
      case 'item_returned':
        return (
          <>
            <span className="font-medium">{data.borrowerName}</span> returned{' '}
            <Link to={`/app/item/${data.itemId}`} className="font-medium text-indigo-600 hover:text-indigo-700">
              {data.itemTitle}
            </Link>
          </>
        );
      case 'event_created':
        return (
          <>
            <span className="font-medium">{data.organizerName}</span> created event{' '}
            <Link to={`/app/events`} className="font-medium text-emerald-600 hover:text-emerald-700">
              {data.eventTitle}
            </Link>
          </>
        );
      case 'event_joined':
        return (
          <>
            <span className="font-medium">{data.userName}</span> is attending{' '}
            <Link to={`/app/events`} className="font-medium text-emerald-600 hover:text-emerald-700">
              {data.eventTitle}
            </Link>
          </>
        );
      case 'member_joined':
        return (
          <>
            <span className="font-medium">{data.userName}</span> joined the loop
          </>
        );
      case 'message_sent':
        return (
          <>
            <span className="font-medium">{data.userName}</span> sent a message
          </>
        );
      case 'loop_updated':
        return (
          <>
            <span className="font-medium">{data.userName}</span> updated loop settings
          </>
        );
      default:
        return 'Activity occurred';
    }
  };

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Activity Feed</h2>
          {activities.length > maxItems && (
            <Link to="/app/activity" className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
              View All
            </Link>
          )}
        </div>
      )}

      <div className="space-y-3">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity) => (
            <GlassmorphicCard key={activity.id} className="p-4 hover:scale-[1.01]">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {getActivityTitle(activity)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(activity.timestamp)} ago
                  </p>
                </div>
              </div>
            </GlassmorphicCard>
          ))
        ) : (
          <div className="text-center py-6 bg-white/30 rounded-2xl">
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;