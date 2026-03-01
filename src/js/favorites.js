import { getFavorites, removeFavorite } from './storage.js';
import { openExerciseModal } from './exerciseModal.js';
import { renderStars } from './utils.js';

export function initFavorites() {
  renderFavorites();
}

function renderFavorites() {
  const list = document.getElementById('favorites-list');
  const empty = document.getElementById('favorites-empty');
  const favs = getFavorites();

  if (!favs.length) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');
  let html = '';
  for (let i = 0; i < favs.length; i++) {
    const ex = favs[i];
    html += `
    <li class="exercise-card" data-id="${ex._id}">
      <div class="ex-card-header">
        <span class="ex-card-tag">Workout</span>
        <div class="ex-card-rating">
          <span class="ex-rating-num">${ex.rating ? ex.rating.toFixed(1) : '0.0'}</span>
          ${renderStars(ex.rating)}
        </div>
      </div>
      <span class="ex-name">${ex.name}</span>
      <div class="ex-meta-row">
        <span class="ex-meta-item"><span class="ex-meta-label">Burned calories:</span> ${ex.burnedCalories || '—'} / ${ex.time || '—'} min</span>
      </div>
      <div class="ex-meta-row">
        <span class="ex-meta-item"><span class="ex-meta-label">Body part:</span> ${ex.bodyPart || '—'}</span>
        <span class="ex-meta-item"><span class="ex-meta-label">Target:</span> ${ex.target || '—'}</span>
      </div>
      <div class="ex-actions">
        <button class="ex-start-btn" data-id="${ex._id}">Start <span class="ex-start-arrow">→</span></button>
        <button class="ex-remove-btn" data-id="${ex._id}" aria-label="Remove from favorites">🗑</button>
      </div>
    </li>
  `;
  }
  list.innerHTML = html;

  list.querySelectorAll('.ex-start-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { openExerciseModal(btn.dataset.id); });
  });

  list.querySelectorAll('.ex-remove-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      removeFavorite(btn.dataset.id);
      renderFavorites();
    });
  });
}
