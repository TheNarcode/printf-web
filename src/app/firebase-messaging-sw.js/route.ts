import { NextResponse } from "next/server";

export function GET() {
  const content = `
    importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

    firebase.initializeApp({
      apiKey: '${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}',
      authDomain: '${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}',
      projectId: '${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}',
      storageBucket: '${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}',
      messagingSenderId: '${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}',
      appId: '${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}',
    });

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage(payload => {
      console.log('[firebase-messaging-sw.js] Background message received:', payload);
      if (payload.notification) return;

      const { title = 'Shree Printer and Xerox', body = '' } = payload.data || {};
      const notificationOptions = {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: payload.data,
      };

      self.registration.showNotification(title, notificationOptions);
    });

    self.addEventListener('notificationclick', event => {
      event.notification.close();
      let url = event.notification.data?.click_action || '/';
      if (event.notification.data?.orderId) {
        url = \`/dashboard?orderId=\${event.notification.data.orderId}\`;
      }
      event.waitUntil(clients.openWindow(url));
    });
  `;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/javascript",
    },
  });
}
