import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import GlassmorphicCard from '../components/GlassmorphicCard'
import NeuomorphicButton from '../components/NeuomorphicButton'

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  })

  const { signIn, signUp, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the intended destination from location state
  const from = location.state?.from || '/app'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let result
      if (mode === 'signin') {
        result = await signIn({
          email: formData.email,
          password: formData.password
        })
      } else {
        result = await signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
      }

      if (result.data && !result.error) {
        // Redirect to intended destination or app home
        navigate(from, { replace: true })
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const fillDemoCredentials = (email: string) => {
    setFormData({
      email,
      password: 'demo123',
      name: email.split('@')[0]
    })
    setMode('signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl top-1/4 left-1/4"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl bottom-1/4 right-1/4"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-3xl font-bold text-white">LoopLink</span>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {mode === 'signin' ? 'Welcome Back' : 'Join LoopLink'}
          </h1>
          <p className="text-gray-300">
            {mode === 'signin' 
              ? 'Sign in to your account to continue' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {/* Demo Accounts */}
        <GlassmorphicCard className="p-4 mb-6 bg-blue-500/20 border border-blue-400/30">
          <h3 className="text-blue-300 font-semibold mb-3 text-center">Try Demo Accounts</h3>
          <div className="space-y-2">
            <button
              onClick={() => fillDemoCredentials('alex@looplink.com')}
              className="w-full text-left p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👨‍💻</span>
                <div>
                  <p className="text-white font-medium">Alex Chen</p>
                  <p className="text-gray-300 text-sm">alex@looplink.com</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => fillDemoCredentials('sarah@looplink.com')}
              className="w-full text-left p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👩‍🎨</span>
                <div>
                  <p className="text-white font-medium">Sarah Johnson</p>
                  <p className="text-gray-300 text-sm">sarah@looplink.com</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => fillDemoCredentials('mike@looplink.com')}
              className="w-full text-left p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👨‍🔧</span>
                <div>
                  <p className="text-white font-medium">Mike Rodriguez</p>
                  <p className="text-gray-300 text-sm">mike@looplink.com</p>
                </div>
              </div>
            </button>
          </div>
          <p className="text-center text-blue-200 text-xs mt-3">
            Password: demo123
          </p>
        </GlassmorphicCard>

        {/* Auth Form */}
        <GlassmorphicCard className="p-8">
          {/* Mode Toggle */}
          <div className="bg-white/10 rounded-xl p-1 mb-6">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setMode('signin')}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === 'signin'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <NeuomorphicButton
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{mode === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                </div>
              ) : (
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
              )}
            </NeuomorphicButton>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  )
}