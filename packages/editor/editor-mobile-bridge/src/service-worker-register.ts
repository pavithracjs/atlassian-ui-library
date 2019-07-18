async function registerServiceWorker() {
  try {
    const reg = await navigator.serviceWorker.register('service-worker.js', {
      scope: './',
    });

    console.log(reg.scope, 'register');
    console.log('Service worker change, registered the service worker');
  } catch (e) {
    console.error(e);
  }
}

if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker.controller) {
    console.log('serviceWorker is up and runing');
  } else {
    registerServiceWorker();
  }
}
