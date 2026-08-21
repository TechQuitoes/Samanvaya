// Samanvaya Service Worker for Native Web Push Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const title = data.title || 'Samanvaya Notification';
    const options = {
      body: data.body || '',
      icon: data.icon || '/assests/lotus-small.png',
      badge: data.badge || '/assests/lotus-small.png',
      data: {
        actionUrl: data.actionUrl || data.data?.actionUrl || '/dashboard',
        ...data.data,
      },
      vibrate: [100, 50, 100],
      requireInteraction: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    console.error('Push event processing error:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const actionUrl = event.notification.data?.actionUrl || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open with this app
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(actionUrl);
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(actionUrl);
      }
    })
  );
});
