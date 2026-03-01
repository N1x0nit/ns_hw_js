import { patchExerciseRating } from './api.js';
import { openModal, closeModal } from './modal.js';
import { showNotification } from './notify.js';

const overlay = document.getElementById('rating-modal-overlay');
const closeBtn = document.getElementById('rating-modal-close');
const form = document.getElementById('rating-form');
const starsContainer = document.getElementById('rating-stars');

let currentExerciseId = null;
let selectedRating = 0;

closeBtn.addEventListener('click', function() { closeModal(overlay); });

starsContainer.addEventListener('click', function(e) {
  const star = e.target.closest('.star');
  if (!star) return;
  selectedRating = parseInt(star.dataset.value, 10);
  updateStars(selectedRating);
});

function updateStars(value) {
  starsContainer.querySelectorAll('.star').forEach(function(s) {
    s.classList.toggle('active', parseInt(s.dataset.value, 10) <= value);
  });
}

form.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!selectedRating) {
    showNotification('Please select a rating', 'error');
    return;
  }
  const data = new FormData(form);
  const email = data.get('email')?.trim();
  const comment = data.get('comment')?.trim();
  try {
    await patchExerciseRating(currentExerciseId, { rating: selectedRating, email, comment });
    showNotification('Rating submitted! Thank you.', 'success');
    closeModal(overlay);
    form.reset();
    selectedRating = 0;
    updateStars(0);
  } catch {
    showNotification('Failed to submit rating. Try again.', 'error');
  }
});

export function openRatingModal(exerciseId) {
  currentExerciseId = exerciseId;
  selectedRating = 0;
  updateStars(0);
  form.reset();
  openModal(overlay);
}
