import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';
import FloatingActionButton from '../components/FloatingActionButton';

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
    <div className="px-4 py-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Community Events ✨
          </h1>
          <p className="text-gray-600 mt-1">{currentLoop.events.length} upcoming events in your loop</p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {currentLoop.events.map((event) => {
          const organizer = currentLoop.members.find(member => member.id === event.organizer_id);
          const attending = isUserAttending(event);
          const full = isEventFull(event);

          return (
            <GlassmorphicCard key={event.id} className="p-6 hover:scale-[1.02] transition-all duration-300">
              <div className="space-y-4">
                {/* Event Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                  <div className="text-3xl ml-4">📅</div>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-600">Date</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.time}</p>
                      <p className="text-xs text-gray-600">Time</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{event.location}</p>
                      <p className="text-xs text-gray-600">Location</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                    <Users className="w-5 h-5 text-amber-600" />
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
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg shadow-lg">
                    {organizer?.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Organized by {organizer?.name}
                    </p>
                    <p className="text-xs text-gray-600">Reputation: {organizer?.reputation}/100</p>
                  </div>
                </div>

                {/* Attendees Preview */}
                {event.attendees && event.attendees.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2">
                      {event.attendees.slice(0, 5).map((attendeeId) => {
                        const attendee = currentLoop.members.find(m => m.id === attendeeId);
                        return (
                          <div
                            key={attendeeId}
                            className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-lg"
                          >
                            {attendee?.avatar}
                          </div>
                        );
                      })}
                      {event.attendees.length > 5 && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600 shadow-lg">
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
                    <div className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-semibold text-center shadow-lg">
                      ✓ You're attending this event!
                    </div>
                  ) : full ? (
                    <div className="w-full bg-gray-100 text-gray-500 py-3 px-6 rounded-xl font-semibold text-center">
                      Event is full
                    </div>
                  ) : (
                    <NeuomorphicButton
                      onClick={() => handleJoinEvent(event.id)}
                      variant="accent"
                      className="w-full"
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
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No events yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
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