export interface LocationCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface LocationAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  formatted?: string;
}

export interface LocationResult {
  coordinates: LocationCoordinates;
  address?: LocationAddress;
  timestamp: number;
}

export class LocationService {
  private watchId: number | null = null;
  private lastKnownLocation: LocationResult | null = null;

  async requestPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!('geolocation' in navigator)) {
      throw new Error('Geolocation is not supported by this browser');
    }

    try {
      // Try to get permission status
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state as 'granted' | 'denied' | 'prompt';
      }
      
      // Fallback: try to get location to check permission
      await this.getCurrentLocation();
      return 'granted';
    } catch (error: any) {
      if (error.code === 1) { // PERMISSION_DENIED
        return 'denied';
      }
      return 'prompt';
    }
  }

  async getCurrentLocation(options?: PositionOptions): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const result: LocationResult = {
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude || undefined,
              heading: position.coords.heading || undefined,
              speed: position.coords.speed || undefined
            },
            timestamp: position.timestamp
          };

          // Try to get address
          try {
            result.address = await this.reverseGeocode(result.coordinates);
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
          }

          this.lastKnownLocation = result;
          resolve(result);
        },
        (error) => {
          let message = 'Location access failed';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        defaultOptions
      );
    });
  }

  async watchLocation(
    callback: (location: LocationResult) => void,
    errorCallback?: (error: Error) => void,
    options?: PositionOptions
  ): Promise<number> {
    if (!('geolocation' in navigator)) {
      throw new Error('Geolocation is not supported');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const result: LocationResult = {
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined
          },
          timestamp: position.timestamp
        };

        // Try to get address
        try {
          result.address = await this.reverseGeocode(result.coordinates);
        } catch (error) {
          console.warn('Reverse geocoding failed:', error);
        }

        this.lastKnownLocation = result;
        callback(result);
      },
      (error) => {
        let message = 'Location tracking failed';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        if (errorCallback) {
          errorCallback(new Error(message));
        }
      },
      defaultOptions
    );

    return this.watchId;
  }

  stopWatching() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getLastKnownLocation(): LocationResult | null {
    return this.lastKnownLocation;
  }

  async reverseGeocode(coordinates: LocationCoordinates): Promise<LocationAddress> {
    // Using OpenStreetMap Nominatim API for reverse geocoding
    // In production, you might want to use Google Maps API or similar
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'LoopLink App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      
      return {
        street: data.address?.road || data.address?.house_number ? 
          `${data.address?.house_number || ''} ${data.address?.road || ''}`.trim() : undefined,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postalCode: data.address?.postcode,
        formatted: data.display_name
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw error;
    }
  }

  async geocode(address: string): Promise<LocationCoordinates[]> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
        {
          headers: {
            'User-Agent': 'LoopLink App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data = await response.json();
      
      return data.map((result: any) => ({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      }));
    } catch (error) {
      console.error('Geocoding failed:', error);
      throw error;
    }
  }

  calculateDistance(coord1: LocationCoordinates, coord2: LocationCoordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.lat - coord1.lat);
    const dLng = this.toRadians(coord2.lng - coord1.lng);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Check if coordinates are within a certain radius
  isWithinRadius(
    center: LocationCoordinates, 
    point: LocationCoordinates, 
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }
}

export const locationService = new LocationService();