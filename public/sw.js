const CACHE_NAME = 'looplink-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data;
  
  event.waitUntil(
    clients.openWindow(getUrlForNotification(data))
  );
});

function getUrlForNotification(data) {
  switch (data.type) {
    case 'item_borrowed':
    case 'item_returned':
      return `/app/item/${data.itemId}`;
    case 'event_reminder':
      return '/app/events';
    case 'new_member':
      return '/app/profile';
    default:
      return '/app';
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle queued actions when back online
  const queuedActions = await getQueuedActions();
  
  for (const action of queuedActions) {
    try {
      await processAction(action);
      await removeFromQueue(action.id);
    } catch (error) {
      console.error('Failed to process queued action:', error);
    }
  }
}

async function getQueuedActions() {
  // Get actions from IndexedDB or localStorage
  return [];
}

async function processAction(action) {
  // Process the queued action
  console.log('Processing action:', action);
}

async function removeFromQueue(actionId) {
  // Remove processed action from queue
  console.log('Removing action from queue:', actionId);
}