import Fuse from 'fuse.js';
import { Item, Event, User } from '../context/AppContext';

export interface SearchResult {
  type: 'item' | 'event' | 'user';
  item: Item | Event | User;
  score: number;
  matches: any[];
}

export interface SearchFilters {
  category?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: {
    lat: number;
    lng: number;
    radius: number; // in km
  };
  tags?: string[];
}

export class AISearchService {
  private itemFuse: Fuse<Item>;
  private eventFuse: Fuse<Event>;
  private userFuse: Fuse<User>;
  private searchHistory: string[] = [];
  private recommendations: Map<string, any[]> = new Map();

  constructor() {
    // Configure Fuse.js for fuzzy search
    const itemOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'category', weight: 0.2 },
        { name: 'owner', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    };

    const eventOptions = {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'location', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    };

    const userOptions = {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'badges', weight: 0.4 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    };

    this.itemFuse = new Fuse([], itemOptions);
    this.eventFuse = new Fuse([], eventOptions);
    this.userFuse = new Fuse([], userOptions);
  }

  updateData(items: Item[], events: Event[], users: User[]) {
    this.itemFuse.setCollection(items);
    this.eventFuse.setCollection(events);
    this.userFuse.setCollection(users);
  }

  search(query: string, filters?: SearchFilters): SearchResult[] {
    if (!query.trim()) return [];

    // Add to search history
    this.addToSearchHistory(query);

    let results: SearchResult[] = [];

    // Search items
    const itemResults = this.itemFuse.search(query).map(result => ({
      type: 'item' as const,
      item: result.item,
      score: result.score || 0,
      matches: result.matches || []
    }));

    // Search events
    const eventResults = this.eventFuse.search(query).map(result => ({
      type: 'event' as const,
      item: result.item,
      score: result.score || 0,
      matches: result.matches || []
    }));

    // Search users
    const userResults = this.userFuse.search(query).map(result => ({
      type: 'user' as const,
      item: result.item,
      score: result.score || 0,
      matches: result.matches || []
    }));

    results = [...itemResults, ...eventResults, ...userResults];

    // Apply filters
    if (filters) {
      results = this.applyFilters(results, filters);
    }

    // Sort by relevance score
    results.sort((a, b) => a.score - b.score);

    return results.slice(0, 20); // Limit to top 20 results
  }

  private applyFilters(results: SearchResult[], filters: SearchFilters): SearchResult[] {
    return results.filter(result => {
      // Category filter
      if (filters.category && result.type === 'item') {
        const item = result.item as Item;
        if (item.category !== filters.category) return false;
      }

      // Status filter
      if (filters.status && result.type === 'item') {
        const item = result.item as Item;
        if (item.status !== filters.status) return false;
      }

      // Date range filter
      if (filters.dateRange && result.type === 'event') {
        const event = result.item as Event;
        const eventDate = new Date(event.date);
        if (eventDate < filters.dateRange.start || eventDate > filters.dateRange.end) {
          return false;
        }
      }

      // Location filter (simplified)
      if (filters.location) {
        // In a real app, this would calculate actual distance
        // For now, we'll just check if location exists
        if (result.type === 'item') {
          const item = result.item as Item;
          if (!item.location) return false;
        }
      }

      return true;
    });
  }

  getSearchSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    
    // Add suggestions based on search history
    const historySuggestions = this.searchHistory
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3);
    
    suggestions.push(...historySuggestions);

    // Add category-based suggestions
    const categories = ['Tools', 'Books', 'Games', 'Kitchen', 'Electronics'];
    const categorySuggestions = categories
      .filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2);
    
    suggestions.push(...categorySuggestions);

    return [...new Set(suggestions)].slice(0, 5);
  }

  getRecommendations(userId: string, type: 'items' | 'events' = 'items'): any[] {
    const cacheKey = `${userId}-${type}`;
    
    if (this.recommendations.has(cacheKey)) {
      return this.recommendations.get(cacheKey) || [];
    }

    // Generate AI-powered recommendations
    const recommendations = this.generateRecommendations(userId, type);
    this.recommendations.set(cacheKey, recommendations);
    
    return recommendations;
  }

  private generateRecommendations(userId: string, type: 'items' | 'events'): any[] {
    // Simplified AI recommendation logic
    // In a real app, this would use machine learning algorithms
    
    const recommendations = [];
    
    if (type === 'items') {
      // Recommend based on user's borrowing history, popular items, etc.
      recommendations.push({
        title: 'Popular in your area',
        items: [], // Would be populated with actual recommendations
        reason: 'Based on your neighborhood activity'
      });
      
      recommendations.push({
        title: 'Similar to items you\'ve borrowed',
        items: [],
        reason: 'Because you borrowed similar items'
      });
    } else {
      // Event recommendations
      recommendations.push({
        title: 'Events you might like',
        items: [],
        reason: 'Based on your interests and past attendance'
      });
    }
    
    return recommendations;
  }

  private addToSearchHistory(query: string) {
    this.searchHistory = [query, ...this.searchHistory.filter(q => q !== query)].slice(0, 10);
  }

  getSearchHistory(): string[] {
    return this.searchHistory;
  }

  clearSearchHistory() {
    this.searchHistory = [];
  }
}

export const searchService = new AISearchService();