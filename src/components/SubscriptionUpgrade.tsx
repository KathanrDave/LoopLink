import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Zap, Crown, Building } from 'lucide-react';
import { subscriptionPlans, stripeService } from '../services/stripe';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from './GlassmorphicCard';
import NeuomorphicButton from './NeuomorphicButton';

interface SubscriptionUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const SubscriptionUpgrade: React.FC<SubscriptionUpgradeProps> = ({
  isOpen,
  onClose,
  currentPlan = 'free'
}) => {
  const { currentLoop } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleUpgrade = async (planId: string) => {
    if (!currentLoop) return;
    
    setIsLoading(true);
    setSelectedPlan(planId);
    
    try {
      await stripeService.createCheckoutSession(planId, currentLoop.id);
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('Upgrade failed. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return Zap;
      case 'pro': return Crown;
      case 'enterprise': return Building;
      default: return Zap;
    }
  };

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'pro': return 'from-indigo-500 to-purple-600';
      case 'enterprise': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <GlassmorphicCard ref={modalRef} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Upgrade Your Loop</h2>
              <p className="text-gray-600 mt-1">Unlock powerful features for your community</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => {
              const IconComponent = getPlanIcon(plan.id);
              const isCurrentPlan = plan.id === currentPlan;
              const isPopular = plan.id === 'pro';
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white/50 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                    isCurrentPlan 
                      ? 'border-emerald-400 ring-2 ring-emerald-400/50' 
                      : isPopular
                      ? 'border-indigo-400 ring-2 ring-indigo-400/50'
                      : 'border-white/20 hover:border-indigo-300'
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Current Plan
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Plan Header */}
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getPlanGradient(plan.id)} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="mt-2">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600">/{plan.interval}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-600" />
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      {isCurrentPlan ? (
                        <div className="w-full bg-emerald-100 text-emerald-800 py-3 px-6 rounded-xl font-semibold text-center">
                          Current Plan
                        </div>
                      ) : (
                        <NeuomorphicButton
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={isLoading}
                          variant={isPopular ? "primary" : "secondary"}
                          className="w-full"
                        >
                          {isLoading && selectedPlan === plan.id ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <span>
                              {plan.price === 0 ? 'Downgrade' : 'Upgrade'} to {plan.name}
                            </span>
                          )}
                        </NeuomorphicButton>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full bg-white/50 backdrop-blur-sm rounded-xl">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                    {subscriptionPlans.map(plan => (
                      <th key={plan.id} className="text-center p-4 font-semibold text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-gray-700">Max Members</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="text-center p-4 text-gray-700">
                        {plan.maxMembers === -1 ? 'Unlimited' : plan.maxMembers}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-gray-700">Events per Month</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="text-center p-4 text-gray-700">
                        {plan.maxEvents === -1 ? 'Unlimited' : plan.maxEvents}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-gray-700">Advanced Features</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="text-center p-4">
                        {plan.hasAdvancedFeatures ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-4 text-gray-700">Analytics Dashboard</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="text-center p-4">
                        {plan.hasAnalytics ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-700">Custom Branding</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="text-center p-4">
                        {plan.hasCustomBranding ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>All plans include 14-day free trial • Cancel anytime • Secure payment by Stripe</p>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default SubscriptionUpgrade;