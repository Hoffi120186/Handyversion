const CACHE_NAME = 'mein-pwa-cache-v1';
const OFFLINE_URL = '/index.html'; // Fallback-Seite

// Installieren
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installieren...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
       '/',
  '/index.html',
  '/Index1.html',
  '/Instruktor.html',
  '/Auswertung.html',
  '/Btninstruktor.html',
  '/kontakt.html',
  '/offline.html',
  '/patienten.html',
  '/patient1.html',
  '/patient2.html',
  '/patient3.html',
  '/patient4.html',
  '/patient5.html',
  '/patient6.html',
  '/patient7.html',
  '/patient8.html',
  '/patient9.html',
  '/patient10.html',
  '/patient11.html',
  '/patient12.html',
  '/patient13.html',
  '/qr.html',
  '/status4.html',
  '/uebung.html',
  '/Übungsanleitung.html',
  '/btn1style.css',
  '/menustyle.css',
  '/styles.css',
  '/stylesauswertung.css',
  '/button1.js',
  '/button2.js',
  '/script.js',
  '/sperrung.js',
  '/timer.js',
  '/Alarmton2.mp3',
  '/Leit1.jpg',
  '/LogoApp.jpg',
  '/MelderMesser.jpg',
  '/Patientenkarte.jpg',
  '/apple-touch-icon.png',
  '/logoneu.png',
  '/IMG_4004.JPG',
  '/hinter1.JPEG',
  '/achtung.jpg',
  '/pat1amesser.JPG',
  '/pat2amesser.JPG',
  '/pat3amesser.JPG',
  '/pat4amesser.JPEG',
  '/pat5amesser.JPG',
  '/pat6amesser.JPG',
  '/pat7amesser.JPG',
  '/pat8amesser.JPG',
  '/pat9amesser.PNG',
  '/pat10amesser.JPG',
  '/pat11amesser.PNG',
  '/pat12amesser.png',
  '/pat12bmesser.png',
  '/pat13amesser.JPG',
  '/scan1.JPG',
  '/scan2.JPG',
  '/scan3.JPG',
  '/scan4.JPG',
  '/scan5.JPG',
  '/scan6.JPG',
  '/scan7.JPG',
  '/scan8.JPG',
  '/scan9.JPG',
  '/scan10.JPG',
  '/polizei350.jpg',
  '/step1.PNG',
  '/step2.PNG',
  '/step3.PNG',
  '/step4.PNG',
  '/step5.PNG',
  '/manifest.json',
  '/service-worker.js'
]);
      })
  );
});

// Aktivieren
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Aktiviert');
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Alter Cache wird gelöscht:', key);
          return caches.delete(key);
        }
      }))
    )
  );
});

// Beim Laden: Erst Cache prüfen, sonst Netzwerk, dann neu cachen
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return; // Nur GET-Anfragen cachen

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Gefunden im Cache
        }

        return fetch(event.request), { redirect: 'follow' })
          .then((networkResponse) => {
            // Gültige Antwort erhalten? Dann in Cache speichern
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });

            return networkResponse;
          });
      })
      .catch(() => {
        // Offline und nichts gefunden: Fallback-Seite anzeigen
        return caches.match(OFFLINE_URL);
      })
  );
});
