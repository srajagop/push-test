/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const app = (() => {
  'use strict';
  let swRegistration = null;

  const notifyButton = document.querySelector('.js-notify-btn');
  const enableNotification = document.querySelector('.js-enable-btn');

  if (!('Notification' in window)) {
    console.log('Notifications not supported in this browser');
    return;
  }

  function displayNotification() {
    if (Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {
        const options = {
          body: 'First notification!',
          tag: 'id1',
          icon: 'images/notification-flat.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          },
          actions: [
            {action: 'explore', title: 'Go to the site',
              icon: 'images/checkmark.png'},
            {action: 'close', title: 'Close the notification',
              icon: 'images/xmark.png'},
          ]
        };
        reg.showNotification('Hello world!', options);
      });
    }
  }
  notifyButton.addEventListener('click', () => {
    displayNotification();
  });
  enableNotification.addEventListener('click', () => {  
	  Notification.requestPermission(status => {
		console.log('Notification permission status:', status);
	  });
  });
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker.register('sw.js')
      .then(swReg => {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;

      })
      .catch(err => {
        console.error('Service Worker Error', err);
      });
    });
  } else {
    console.warn('Push messaging is not supported');
  }

})();
