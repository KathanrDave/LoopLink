import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  maxMembers: number;
  maxEvents: number;
  hasAdvancedFeatures: boolean;
  hasAnalytics: boolean;
  hasCustomBranding: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Up to 20 members',
      'Basic item sharing',
      '5 events per month',
      'Standard support'
    ],
    maxMembers: 20,
    maxEvents: 5,
    hasAdvancedFeatures: false,
    hasAnalytics: false,
    hasCustomBranding: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    interval: 'month',
    features: [
      'Up to 100 members',
      'Advanced maps integration',
      'Unlimited events',
      'Custom loop branding',
      'Analytics dashboard',
      'Email support'
    ],
    maxMembers: 100,
    maxEvents: -1,
    hasAdvancedFeatures: true,
    hasAnalytics: true,
    hasCustomBranding: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited members',
      'Multiple sub-loops',
      'Advanced organization features',
      'Custom integrations',
      'White-label options',
      'Priority support',
      'Advanced analytics'
    ],
    maxMembers: -1,
    maxEvents: -1,
    hasAdvancedFeatures: true,
    hasAnalytics: true,
    hasCustomBranding: true
  }
];

export class StripeService {
  private stripe: any = null;

  async initialize() {
    this.stripe = await stripePromise;
    return this.stripe;
  }

  async createCheckoutSession(planId: string, loopId: string) {
    try {
      // In a real app, this would call your backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          loopId,
          successUrl: `${window.location.origin}/app?upgrade=success`,
          cancelUrl: `${window.location.origin}/app?upgrade=cancelled`,
        }),
      });

      const session = await response.json();
      
      if (!this.stripe) {
        await this.initialize();
      }

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // For demo purposes, simulate successful upgrade
      return this.simulateUpgrade(planId);
    }
  }

  private simulateUpgrade(planId: string) {
    // Simulate successful upgrade for demo
    setTimeout(() => {
      const event = new CustomEvent('subscription-updated', {
        detail: { planId, status: 'active' }
      });
      window.dispatchEvent(event);
    }, 2000);

    return { success: true, demo: true };
  }

  async createPortalSession(customerId: string) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/app/profile`,
        }),
      });

      const session = await response.json();
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      // For demo, just show alert
      alert('Billing portal would open here in production');
    }
  }
}

export const stripeService = new StripeService();