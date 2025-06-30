export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  silent?: boolean;
  requireInteraction?: boolean;
}

export class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private isSupported: boolean = false;

  async initialize() {
    // Check if Service Workers are supported in this environment
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported in this environment');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      this.isSupported = true;
      console.log('Service Worker registered');
    } catch (error) {
      console.warn('Service Worker registration failed, continuing without service worker support:', error);
      // Don't throw the error, just continue without service worker
      this.isSupported = false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async showNotification(options: NotificationOptions) {
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    const notificationOptions: NotificationOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      ...options
    };

    if (this.registration && this.isSupported) {
      // Use service worker for better notification handling
      try {
        await this.registration.showNotification(options.title, notificationOptions);
      } catch (error) {
        console.warn('Service worker notification failed, falling back to regular notification:', error);
        new Notification(options.title, notificationOptions);
      }
    } else {
      // Fallback to regular notification
      new Notification(options.title, notificationOptions);
    }
  }

  async scheduleNotification(options: NotificationOptions, delay: number) {
    setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }

  // Predefined notification types for common scenarios
  async notifyItemBorrowed(itemTitle: string, borrowerName: string) {
    await this.showNotification({
      title: 'Item Borrowed',
      body: `${borrowerName} borrowed your ${itemTitle}`,
      tag: 'item-borrowed',
      data: { type: 'item_borrowed', itemTitle, borrowerName }
    });
  }

  async notifyItemReturned(itemTitle: string, borrowerName: string) {
    await this.showNotification({
      title: 'Item Returned',
      body: `${borrowerName} returned your ${itemTitle}`,
      tag: 'item-returned',
      data: { type: 'item_returned', itemTitle, borrowerName }
    });
  }

  async notifyEventReminder(eventTitle: string, timeUntil: string) {
    await this.showNotification({
      title: 'Event Reminder',
      body: `${eventTitle} starts in ${timeUntil}`,
      tag: 'event-reminder',
      requireInteraction: true,
      data: { type: 'event_reminder', eventTitle }
    });
  }

  async notifyNewMember(memberName: string, loopName: string) {
    await this.showNotification({
      title: 'New Member Joined',
      body: `${memberName} joined ${loopName}`,
      tag: 'new-member',
      data: { type: 'new_member', memberName, loopName }
    });
  }

  async notifyItemDueSoon(itemTitle: string, dueDate: string) {
    await this.showNotification({
      title: 'Return Reminder',
      body: `${itemTitle} is due back on ${dueDate}`,
      tag: 'item-due',
      requireInteraction: true,
      actions: [
        { action: 'return', title: 'Mark as Returned' },
        { action: 'extend', title: 'Request Extension' }
      ],
      data: { type: 'item_due', itemTitle, dueDate }
    });
  }

  // Clear notifications by tag
  async clearNotifications(tag?: string) {
    if (this.registration && this.isSupported) {
      try {
        const notifications = await this.registration.getNotifications({ tag });
        notifications.forEach(notification => notification.close());
      } catch (error) {
        console.warn('Failed to clear notifications:', error);
      }
    }
  }

  // Setup notification click handlers
  setupNotificationHandlers() {
    if ('serviceWorker' in navigator && this.isSupported) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'notification-click') {
          this.handleNotificationClick(event.data);
        }
      });
    }
  }

  private handleNotificationClick(data: any) {
    switch (data.notificationType) {
      case 'item_borrowed':
      case 'item_returned':
        // Navigate to item detail page
        window.location.href = `/app/item/${data.itemId}`;
        break;
      case 'event_reminder':
        // Navigate to events page
        window.location.href = '/app/events';
        break;
      case 'new_member':
        // Navigate to profile or members page
        window.location.href = '/app/profile';
        break;
      default:
        // Navigate to home
        window.location.href = '/app';
    }
  }
}

export const notificationService = new NotificationService();