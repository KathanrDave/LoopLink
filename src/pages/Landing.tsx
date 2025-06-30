import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Building2, Check, Star, ArrowRight, Zap, Shield, Globe, Sparkles, Heart, Target } from 'lucide-react';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';

const Landing = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const loopTypes = [
    {
      type: 'friend',
      icon: Users,
      title: 'Friend Loops',
      subtitle: 'Social Circles',
      description: 'Create intimate spaces for your closest friends to plan adventures, share moments, and stay deeply connected.',
      features: ['Private group dynamics', 'Event orchestration', 'Memory sharing', 'Spontaneous coordination'],
      gradient: 'from-purple-400 via-pink-400 to-rose-400',
      bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
      iconColor: 'text-purple-600',
      stats: '2.3M+ friend groups'
    },
    {
      type: 'neighborhood',
      icon: MapPin,
      title: 'Neighborhood Loops',
      subtitle: 'Hyperlocal Communities',
      description: 'Transform your neighborhood into a thriving ecosystem of shared resources, local events, and genuine connections.',
      features: ['Resource circulation', 'Local event discovery', 'Geographic intelligence', 'Community resilience'],
      gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
      bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
      iconColor: 'text-emerald-600',
      stats: '850K+ neighborhoods'
    },
    {
      type: 'organization',
      icon: Building2,
      title: 'Organization Loops',
      subtitle: 'Professional Networks',
      description: 'Elevate team collaboration with intelligent coordination, meaningful networking, and data-driven insights.',
      features: ['Team synchronization', 'Professional networking', 'Performance analytics', 'Culture building'],
      gradient: 'from-blue-400 via-indigo-400 to-violet-400',
      bgGradient: 'from-blue-50 via-indigo-50 to-violet-50',
      iconColor: 'text-blue-600',
      stats: '125K+ organizations'
    }
  ];

  const testimonials = [
    {
      name: 'Maya Patel',
      role: 'Community Builder',
      avatar: '🌟',
      content: 'LoopLink didn\'t just connect our neighborhood—it transformed how we think about community. We\'ve reduced waste by 60% and built friendships that will last a lifetime.',
      rating: 5,
      location: 'San Francisco, CA',
      gradient: 'from-amber-400 to-orange-400'
    },
    {
      name: 'Alex Rivera',
      role: 'Tech Team Lead',
      avatar: '🚀',
      content: 'Our remote team finally feels like a real team. The organization features helped us coordinate better than any tool we\'ve tried, and the networking aspect is genius.',
      rating: 5,
      location: 'Austin, TX',
      gradient: 'from-blue-400 to-purple-400'
    },
    {
      name: 'Sophie Chen',
      role: 'Friend Group Coordinator',
      avatar: '💫',
      content: 'Planning events with friends used to be chaos. Now it\'s effortless and fun. We\'ve had more adventures this year than in the past five combined.',
      rating: 5,
      location: 'New York, NY',
      gradient: 'from-pink-400 to-rose-400'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Intelligence',
      description: 'AI-powered coordination that learns your patterns and suggests optimal connections.',
      gradient: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Shield,
      title: 'Privacy Fortress',
      description: 'Military-grade encryption with granular privacy controls. Your data, your rules.',
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      icon: Globe,
      title: 'Universal Access',
      description: 'Seamless experience across all devices with offline-first architecture.',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Heart,
      title: 'Human-Centered',
      description: 'Designed to strengthen real relationships, not replace them with digital noise.',
      gradient: 'from-pink-400 to-rose-400'
    },
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'Smart algorithms connect you with the right people at the right time.',
      gradient: 'from-purple-400 to-indigo-400'
    },
    {
      icon: Sparkles,
      title: 'Magical Moments',
      description: 'Delightful micro-interactions that make every connection feel special.',
      gradient: 'from-violet-400 to-purple-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`
          }}
        />
        <div 
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                LoopLink
              </span>
              <span className="text-sm text-purple-300 ml-2 font-medium">2.0</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors font-medium">Pricing</a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors font-medium">Stories</a>
            <NeuomorphicButton variant="primary" size="sm">
              <Link to="/auth" className="flex items-center space-x-2">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </NeuomorphicButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-12">
            <div className="space-y-8">
              <h1 className="text-6xl md:text-8xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Create Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Loop
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Transform how you connect. Build meaningful communities that strengthen relationships, 
                share resources, and create lasting memories together.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <NeuomorphicButton variant="primary" size="lg" className="group">
                <Link to="/auth" className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                  <span>Start Your Loop Free</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </NeuomorphicButton>
              <NeuomorphicButton variant="secondary" size="lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">▶</span>
                  </div>
                  <span>Watch Magic Happen</span>
                </div>
              </NeuomorphicButton>
            </div>

            {/* Social Proof */}
            <div className="pt-12">
              <p className="text-sm text-gray-400 mb-6">Trusted by communities worldwide</p>
              <div className="flex items-center justify-center space-x-12 opacity-60">
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🏢</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🏠</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎓</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>👥</div>
                <div className="text-4xl animate-bounce" style={{ animationDelay: '0.8s' }}>🌍</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loop Types Section */}
      <section id="features" className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Choose Your Universe
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Every community is unique. Find the perfect loop type that matches your circle's energy and goals.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {loopTypes.map((loop, index) => {
              const IconComponent = loop.icon;
              return (
                <GlassmorphicCard 
                  key={loop.type} 
                  className="p-8 hover:scale-105 transition-all duration-500 group"
                  gradient="from-white/20 to-white/10"
                  blur="lg"
                  opacity={0.15}
                >
                  <div className="space-y-8">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${loop.gradient} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{loop.title}</h3>
                        <p className="text-sm text-gray-300">{loop.subtitle}</p>
                        <p className="text-xs text-gray-400 mt-1">{loop.stats}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed">{loop.description}</p>

                    <div className="space-y-3">
                      {loop.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 bg-gradient-to-r ${loop.gradient} rounded-full`}></div>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <NeuomorphicButton 
                      variant="primary" 
                      className={`w-full bg-gradient-to-r ${loop.gradient} hover:shadow-2xl`}
                    >
                      <Link to="/auth" className="flex items-center justify-center space-x-2">
                        <span>Create {loop.title}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </NeuomorphicButton>
                  </div>
                </GlassmorphicCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Why LoopLink is Different
            </h2>
            <p className="text-xl text-gray-300">Built for authentic connections, not digital distractions</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <GlassmorphicCard 
                  key={index} 
                  className="p-8 text-center hover:scale-105 transition-all duration-500 group"
                  gradient="from-white/20 to-white/10"
                  blur="lg"
                  opacity={0.15}
                >
                  <div className="space-y-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </GlassmorphicCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
              Stories of Connection
            </h2>
            <p className="text-xl text-gray-300">Real people, real communities, real impact</p>
          </div>

          <div className="relative">
            <GlassmorphicCard 
              className="p-12 text-center max-w-4xl mx-auto"
              gradient="from-white/20 to-white/10"
              blur="lg"
              opacity={0.15}
            >
              <div className="space-y-8">
                <div className="flex items-center justify-center space-x-2">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-2xl text-white leading-relaxed font-medium">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${testimonials[activeTestimonial].gradient} rounded-full flex items-center justify-center text-2xl shadow-2xl`}>
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">{testimonials[activeTestimonial].name}</p>
                    <p className="text-gray-300">{testimonials[activeTestimonial].role}</p>
                    <p className="text-gray-400 text-sm">{testimonials[activeTestimonial].location}</p>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-white scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <GlassmorphicCard 
            className="p-16"
            gradient="from-white/20 to-white/10"
            blur="lg"
            opacity={0.15}
          >
            <div className="space-y-10">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
                Ready to Create Magic?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join millions of people already using LoopLink to build stronger, more meaningful communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <NeuomorphicButton variant="primary" size="lg" className="group">
                  <Link to="/auth" className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                    <span>Start Your Loop Free</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </NeuomorphicButton>
                <NeuomorphicButton variant="secondary" size="lg">
                  Schedule Demo
                </NeuomorphicButton>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-2xl font-bold text-white">LoopLink</span>
              </div>
              <p className="text-gray-400">Create your loop. Connect your circle. Transform your world.</p>
            </div>

            {['Product', 'Company', 'Support'].map((section, index) => (
              <div key={section} className="space-y-4">
                <h3 className="font-semibold text-white">{section}</h3>
                <ul className="space-y-3 text-gray-400">
                  {['Features', 'Pricing', 'Security', 'Integrations'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-white transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LoopLink. All rights reserved. Made with ❤️ for communities everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;