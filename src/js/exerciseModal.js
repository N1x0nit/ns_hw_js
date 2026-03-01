import { fetchExerciseById } from './api.js';
import { openModal, closeModal } from './modal.js';
import { saveFavorite, removeFavorite, isFavorite } from './storage.js';
import { openRatingModal } from './ratingModal.js';

const overlay = document.getElementById('exercise-modal-overlay');
const content = document.getElementById('exercise-modal-content');
const closeBtn = document.getElementById('exercise-modal-close');

closeBtn.addEventListener('click', function() { closeModal(overlay); });

export async function openExerciseModal(id) {
  content.innerHTML = '<p class="loading">Loading...</p>';
  openModal(overlay);
  try {
    const ex = await fetchExerciseById(id);
    renderExercise(ex);
  } catch {
    content.innerHTML = `<p class="error">Failed to load exercise.</p>`;
  }
}

function renderExercise(ex) {
  const fav = isFavorite(ex._id);
  content.innerHTML = `
    <div class="ex-modal-body">
      <img src="${ex.gifUrl || ''}" alt="${ex.name}" class="ex-modal-gif" />
      <div class="ex-modal-info">
        <h2 class="ex-modal-name">${ex.name}</h2>
        <ul class="ex-modal-meta">
          <li><span>Target:</span> ${ex.target || '—'}</li>
          <li><span>Body part:</span> ${ex.bodyPart || '—'}</li>
          <li><span>Equipment:</span> ${ex.equipment || '—'}</li>
          <li><span>Calories:</span> ${ex.burnedCalories || '—'} cal</li>
          <li><span>Rating:</span> ${ex.rating ? ex.rating.toFixed(1) : '—'} ★</li>
          <li><span>Time:</span> ${ex.time || '—'} min</li>
        </ul>
        <p class="ex-modal-desc">${ex.description || ''}</p>
        <div class="ex-modal-actions">
          <button class="btn-fav" id="ex-fav-btn">${fav ? 'Remove from favorites' : 'Add to favorites'}</button>
          <button class="btn-rate" id="ex-rate-btn">Give a rating</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('ex-fav-btn').addEventListener('click', function() {
    if (isFavorite(ex._id)) {
      removeFavorite(ex._id);
      document.getElementById('ex-fav-btn').textContent = 'Add to favorites';
    } else {
      saveFavorite(ex);
      document.getElementById('ex-fav-btn').textContent = 'Remove from favorites';
    }
  });

  document.getElementById('ex-rate-btn').addEventListener('click', function() {
    openRatingModal(ex._id);
  });
}
