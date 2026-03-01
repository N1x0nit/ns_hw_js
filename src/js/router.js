const views = {
  home: document.getElementById('view-home'),
  favorites: document.getElementById('view-favorites'),
};

const navLinks = document.querySelectorAll('[data-view]');

let onFavoritesEnter = null;
let onHomeEnter = null;

export function initRouter({ onHome, onFavorites }) {
  onHomeEnter = onHome;
  onFavoritesEnter = onFavorites;
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const raw = window.location.hash.replace(/^#\/?/, '') || 'home';
  const view = ['home', 'favorites'].includes(raw) ? raw : 'home';

  if (views.home) views.home.classList.toggle('hidden', view !== 'home');
  if (views.favorites) views.favorites.classList.toggle('hidden', view !== 'favorites');

  navLinks.forEach(function(link) {
    link.classList.toggle('active', link.dataset.view === view);
  });

  if (view === 'home' && onHomeEnter) onHomeEnter();
  if (view === 'favorites' && onFavoritesEnter) onFavoritesEnter();
}
