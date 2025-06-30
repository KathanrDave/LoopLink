import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';
import FloatingActionButton from '../components/FloatingActionButton';
import StatusIndicator from '../components/ui/StatusIndicator';

const Events = () => {
  const { currentLoop, currentUser, joinEvent } = useApp();

  if (!currentLoop || !currentUser) {
    return <div>Loading...</div>;
  }

  const handleJoinEvent = async (eventId: string) => {
    const event = currentLoop.events.find(e => e.id === eventId);
    if (!event?.attendees?.includes(currentUser.id)) {
      await joinEvent(eventId);
    }
  };

  const isEventFull = (event: any) => {
    return event.max_attendees && event.attendees?.length >= event.max_attendees;
  };

  const isUserAttending = (event: any) => {
    return event.attendees?.includes(currentUser.id);
  };

  const getLoopGradient = (type: string) => {
    switch (type) {
      case 'friend': return 'from-purple-500 via-pink-500 to-rose-500';
      case 'neighborhood': return 'from-emerald-500 via-teal-500 to-cyan-500';
      case 'organization': return 'from-blue-500 via-indigo-500 to-violet-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="px-6 py-8 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Community Events
          </h1>
          <p className="text-gray-600 text-lg">{currentLoop.events.length} upcoming events in your loop</p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {currentLoop.events.map((event) => {
          const organizer = currentLoop.members.find(member => member.id === event.organizer_id);
          const attending = isUserAttending(event);
          const full = isEventFull(event);

          return (
            <GlassmorphicCard key={event.id} className="p-8">
              <div className="space-y-6">
                {/* Event Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
                  </div>
                  <div className="text-4xl ml-6">📅</div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-600">Date</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl">
                    <Clock className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.time}</p>
                      <p className="text-xs text-gray-600">Time</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{event.location}</p>
                      <p className="text-xs text-gray-600">Location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl">
                    <Users className="w-6 h-6 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.attendees?.length || 0}
                        {event.max_attendees && `/${event.max_attendees}`}
                      </p>
                      <p className="text-xs text-gray-600">Attending</p>
                    </div>
                  </div>
                </div>

                {/* Organizer */}
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-lg shadow-elegant">
                    {organizer?.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Organized by {organizer?.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <StatusIndicator status="online" size="sm" />
                      <span className="text-xs text-gray-600">Reputation: {organizer?.reputation}/100</span>
                    </div>
                  </div>
                </div>

                {/* Attendees Preview */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 5).map((attendeeId) => {
                        const attendee = currentLoop.members.find(m => m.id === attendeeId);
                        return (
                          <div
                            key={attendeeId}
                            className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full border-3 border-white flex items-center justify-center text-sm shadow-elegant"
                          >
                            {attendee?.avatar}
                          </div>
                        );
                      })}
                      {event.attendees.length > 5 && (
                        <div className="w-10 h-10 bg-gray-100 rounded-full border-3 border-white flex items-center justify-center text-xs font-semibold text-gray-600 shadow-elegant">
                          +{event.attendees.length - 5}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">attending this event</span>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  {attending ? (
                    <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-2xl font-semibold text-center shadow-elegant">
                      ✓ You're attending this event!
                    </div>
                  ) : full ? (
                    <div className="w-full bg-gray-100 text-gray-500 py-4 px-6 rounded-2xl font-semibold text-center">
                      Event is full
                    </div>
                  ) : (
                    <NeuomorphicButton
                      onClick={() => handleJoinEvent(event.id)}
                      variant="accent"
                      className="w-full"
                      size="lg"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Join Event</span>
                      </div>
                    </NeuomorphicButton>
                  )}
                </div>
              </div>
            </GlassmorphicCard>
          );
        })}
      </div>

      {currentLoop.events.length === 0 && (
        <div className="text-center py-20">
          <div className="text-8xl mb-8">📅</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">No events yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            Be the first to organize a community event and bring everyone together!
          </p>
          <Link to="/app/create-event">
            <NeuomorphicButton variant="primary" size="lg">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Create First Event</span>
              </div>
            </NeuomorphicButton>
          </Link>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => window.location.href = '/app/create-event'}
        icon={<Calendar className="w-6 h-6" />}
        gradient={getLoopGradient(currentLoop.type)}
      />
    </div>
  );
};

export default Events;