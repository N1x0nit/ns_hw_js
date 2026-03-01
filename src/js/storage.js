const FAVORITES_KEY = 'ef_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorite(exercise) {
  const favs = getFavorites();
  if (!favs.find(f => f._id === exercise._id)) {
    favs.push(exercise);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
}

export function removeFavorite(id) {
  const favs = getFavorites().filter(f => f._id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function isFavorite(id) {
  return getFavorites().some(f => f._id === id);
}
