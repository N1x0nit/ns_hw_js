import { initRouter } from './js/router.js';
import { initHome } from './js/home.js';
import { initFavorites } from './js/favorites.js';
import { postSubscription } from './js/api.js';
import { showNotification } from './js/notify.js';

let homeInitialized = false;

initRouter({
  onHome: function() {
    if (!homeInitialized) {
      homeInitialized = true;
      initHome();
    }
  },
  onFavorites: function() {
    initFavorites();
  },
});

const subscribeForm = document.getElementById('subscribe-form');
subscribeForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = e.target.email.value.trim();
  try {
    await postSubscription(email);
    showNotification('Subscribed successfully!', 'success');
    e.target.reset();
  } catch {
    showNotification('Subscription failed. Try again.', 'error');
  }
});
