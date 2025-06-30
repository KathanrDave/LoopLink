import { useState, useEffect } from 'react';
import { User } from '../context/AppContext';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });

  useEffect(() => {
    // Check for existing session
    const checkAuth = () => {
      const savedUser = localStorage.getItem('looplink_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setAuthState({ user, loading: false });
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('looplink_user');
          setAuthState({ user: null, loading: false });
        }
      } else {
        setAuthState({ user: null, loading: false });
      }
    };

    checkAuth();
  }, []);

  const signIn = (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Demo authentication - in production, this would call your auth API
      setTimeout(() => {
        if (email && password) {
          const demoUser: User = {
            id: '1',
            name: 'Alex Chen',
            avatar: '👨‍💻',
            reputation: 95,
            badges: ['Loop Creator', 'Tech Helper'],
            role: 'admin',
            email: email,
            subscriptionTier: 'pro',
            location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, New York, NY' }
          };
          
          localStorage.setItem('looplink_user', JSON.stringify(demoUser));
          setAuthState({ user: demoUser, loading: false });
          resolve(demoUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const signUp = (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          const newUser: User = {
            id: Date.now().toString(),
            name,
            avatar: '👤',
            reputation: 50,
            badges: [],
            role: 'member',
            email,
            subscriptionTier: 'free'
          };
          
          localStorage.setItem('looplink_user', JSON.stringify(newUser));
          setAuthState({ user: newUser, loading: false });
          resolve(newUser);
        } else {
          reject(new Error('All fields are required'));
        }
      }, 1000);
    });
  };

  const signOut = () => {
    localStorage.removeItem('looplink_user');
    setAuthState({ user: null, loading: false });
  };

  return {
    user: authState.user,
    loading: authState.loading,
    signIn,
    signUp,
    signOut
  };
}