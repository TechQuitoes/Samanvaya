// Samanvaya Service Worker for Native Web Push Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { title: 'Samanvaya Alert', body: event.data.text() };
    }
  }

  const title = data.title || 'Samanvaya Notification';
  const actionUrl = data.actionUrl || data.data?.actionUrl || '/admin/approvals';

  const options = {
    body: data.body || '',
    icon: '/assets/04_lotus_icon_gold.png',
    badge: '/assets/04_lotus_icon_gold.png',
    tag: 'samanvaya-alert-' + Date.now(),
    data: {
      actionUrl,
      ...data.data,
    },
    requireInteraction: true,
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(title, options),
      // Broadcast to open browser windows for instant in-app toast
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'PUSH_NOTIFICATION_RECEIVED',
            title,
            body: data.body,
            actionUrl,
          });
        });
      }),
    ])
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const actionUrl = event.notification.data?.actionUrl || '/admin/approvals';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(actionUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(actionUrl);
      }
    })
  );
});
