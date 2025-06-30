import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MapPin, Building2, Plus, Search, Zap } from 'lucide-react';
import { useApp, LoopType } from '../context/AppContext';

const JoinCommunity = () => {
  const [mode, setMode] = useState<'join' | 'create'>('create');
  const [selectedType, setSelectedType] = useState<LoopType>('friend');
  const [loopCode, setLoopCode] = useState('');
  const [loopName, setLoopName] = useState('');
  const [loopDescription, setLoopDescription] = useState('');
  const navigate = useNavigate();
  const { userLoops, createLoop, joinLoop } = useApp();

  const loopTypes = [
    {
      type: 'friend' as LoopType,
      icon: Users,
      title: 'Friend Loop',
      subtitle: 'Social Focus',
      description: 'Perfect for close friend groups planning hangouts and staying connected',
      features: ['Private group', 'Event planning', 'Shared calendars', 'Group messaging'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      examples: [
        {
          name: 'College Buddies',
          description: 'Stay connected with your university friends, plan reunions, and share memories',
          members: 8
        },
        {
          name: 'Book Club Friends',
          description: 'Coordinate monthly meetings, share reading lists, and discuss favorite books',
          members: 12
        },
        {
          name: 'Travel Squad',
          description: 'Plan trips together, share travel tips, and coordinate group adventures',
          members: 6
        }
      ]
    },
    {
      type: 'neighborhood' as LoopType,
      icon: MapPin,
      title: 'Neighborhood Loop',
      subtitle: 'Hyperlocal Focus',
      description: 'Location-based community for neighbors to share and connect locally',
      features: ['Resource circulation', 'Local event discovery', 'Geographic intelligence', 'Community resilience'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      examples: [
        {
          name: 'Riverside Community',
          description: 'Connect with neighbors, organize block parties, and share community resources',
          members: 45
        },
        {
          name: 'Downtown Residents',
          description: 'Stay updated on local events, share parking tips, and build urban connections',
          members: 78
        },
        {
          name: 'Sunset Hills HOA',
          description: 'Coordinate neighborhood improvements, manage shared spaces, and plan community events',
          members: 120
        }
      ]
    },
    {
      type: 'organization' as LoopType,
      icon: Building2,
      title: 'Organization Loop',
      subtitle: 'Business Focus',
      description: 'Professional community for teams and companies to coordinate effectively',
      features: ['Team coordination', 'Event networking', 'Resource management', 'Analytics'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      examples: [
        {
          name: 'TechCorp Engineering',
          description: 'Streamline team communication, share technical resources, and coordinate projects',
          members: 35
        },
        {
          name: 'Greenfield Marketing',
          description: 'Collaborate on campaigns, share creative assets, and track marketing performance',
          members: 18
        },
        {
          name: 'City Hospital Staff',
          description: 'Coordinate shifts, share medical resources, and build healthcare community',
          members: 150
        }
      ]
    }
  ];

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = joinLoop(loopCode);
    if (success) {
      navigate('/app');
    } else {
      alert('Loop not found. Please check the code and try again.');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loopName.trim()) {
      alert('Please enter a loop name');
      return;
    }
    
    createLoop(loopName, loopDescription, selectedType);
    navigate('/app');
  };

  const selectedLoopType = loopTypes.find(type => type.type === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="px-4 py-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-3">
          <Link to="/" className="p-2 -ml-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {mode === 'join' ? 'Join a Loop' : 'Create Your Loop'}
            </h1>
            <p className="text-sm text-gray-300">Connect your circle</p>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 max-w-4xl mx-auto">
        {/* Mode Selector */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1 mb-8 shadow-xl border border-white/20">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setMode('create')}
              className={`py-4 px-6 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                mode === 'create'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create New Loop</span>
            </button>
            <button
              onClick={() => setMode('join')}
              className={`py-4 px-6 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                mode === 'join'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Join Existing Loop</span>
            </button>
          </div>
        </div>

        {mode === 'create' ? (
          <div className="space-y-8">
            {/* Loop Type Selection */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Choose Your Loop Type</h2>
                <p className="text-gray-300">Different communities, different needs</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {loopTypes.map((loop, index) => {
                  const IconComponent = loop.icon;
                  const isSelected = selectedType === loop.type;
                  
                  return (
                    <button
                      key={loop.type}
                      onClick={() => setSelectedType(loop.type)}
                      className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left transition-all duration-200 transform hover:scale-105 border-2 hover:bg-white/20 ${
                        isSelected ? 'border-purple-400 ring-2 ring-purple-400/50 bg-white/20' : 'border-white/20'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${loop.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white">{loop.title}</h3>
                            <p className="text-xs text-gray-300">{loop.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed">{loop.description}</p>

                        <div className="space-y-3">
                          {loop.features.slice(0, 2).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <div className={`w-1.5 h-1.5 bg-gradient-to-r ${loop.color} rounded-full`}></div>
                              <span className="text-xs text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Loop Creation Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  {selectedLoopType && (
                    <>
                      <div className={`w-10 h-10 bg-gradient-to-r ${selectedLoopType.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <selectedLoopType.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Create {selectedLoopType.title}</h3>
                        <p className="text-sm text-gray-300">{selectedLoopType.subtitle}</p>
                      </div>
                    </>
                  )}
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                      Loop Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={loopName}
                      onChange={(e) => setLoopName(e.target.value)}
                      placeholder={
                        selectedType === 'friend' ? 'College Friends' :
                        selectedType === 'neighborhood' ? 'Downtown Neighbors' :
                        'Marketing Team'
                      }
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={loopDescription}
                      onChange={(e) => setLoopDescription(e.target.value)}
                      placeholder="Tell people what this loop is about..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white placeholder-gray-400"
                    />
                  </div>

                  {selectedType === 'neighborhood' && (
                    <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-5 h-5 text-green-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-300">Location Setup</h4>
                          <p className="text-sm text-green-200 mt-1">
                            After creation, you'll set your neighborhood boundaries and radius on an interactive map.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`w-full bg-gradient-to-r ${selectedLoopType?.color || 'from-blue-600 to-purple-600'} text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2`}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Create {selectedLoopType?.title}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Example Loops */}
            {selectedLoopType && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                <h3 className="font-bold text-white mb-4">Example {selectedLoopType.title}</h3>
                <div className="space-y-3">
                  {selectedLoopType.examples.map((example, i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors">
                      <p className="font-semibold text-white">{example.name}</p>
                      <p className="text-sm text-gray-300 mt-1">{example.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">{example.members} members</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Join an Existing Loop</h2>
              <p className="text-gray-300">Enter the loop code shared by your community</p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
              <form onSubmit={handleJoin} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-200 mb-2">
                    Loop Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={loopCode}
                    onChange={(e) => setLoopCode(e.target.value.toUpperCase())}
                    placeholder="FRIENDS2024"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg font-mono text-white placeholder-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Join Loop
                </button>
              </form>
            </div>

            {/* Sample Loops */}
            <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-400/30">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-blue-300">Try Demo Loops</h3>
                <div className="grid gap-3">
                  <button
                    onClick={() => setLoopCode('FRIENDS2024')}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">FRIENDS2024</p>
                        <p className="text-sm text-gray-300">College Friends • 4 members</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setLoopCode('UWS2024')}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="font-medium text-white">UWS2024</p>
                        <p className="text-sm text-gray-300">Upper West Side • 12 members</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setLoopCode('TECH2024')}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">TECH2024</p>
                        <p className="text-sm text-gray-300">TechCorp Team • 8 members</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Existing Loops */}
        {userLoops.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 mt-8">
            <h3 className="font-semibold text-white mb-4">Your Existing Loops</h3>
            <div className="space-y-3">
              {userLoops.slice(0, 3).map((loop) => {
                const loopType = loopTypes.find(type => type.type === loop.type);
                return (
                  <Link
                    key={loop.id}
                    to="/app"
                    className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                  >
                    {loopType && <loopType.icon className="w-6 h-6 text-white" />}
                    <div className="flex-1">
                      <p className="font-medium text-white">{loop.name}</p>
                      <p className="text-sm text-gray-300">{loop.members.length} members • {loop.type}</p>
                    </div>
                    <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinCommunity;