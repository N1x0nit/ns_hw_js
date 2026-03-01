import { fetchFilters, fetchExercises, fetchQuote } from './api.js';
import { openExerciseModal } from './exerciseModal.js';
import { renderStars } from './utils.js';

let currentFilter = 'Muscles';
let currentFilterValue = null;
let currentPage = 1;
let currentKeyword = '';
const LIMIT = 10;

function toTitleCase(str) {
  return (str || '').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

const FILTER_KEY_MAP = {
  Muscles: 'muscles',
  'Body parts': 'bodyPart',
  Equipment: 'equipment',
};

export async function initHome() {
  await loadQuote();
  setupFilterCards();
  await loadFilterCards('Muscles');
  setupFilterTabs();
  setupBackBtn();
  setupSearch();
}

async function loadQuote() {
  try {
    const { quote, author } = await fetchQuote();
    document.getElementById('quote-text').textContent = `"${quote}"`;
    document.getElementById('quote-author').textContent = `— ${author}`;
  } catch {
  }
}

async function loadFilterCards(filter) {
  currentFilter = filter;
  currentFilterValue = null;
  currentKeyword = '';

  if (filter === 'Body parts') {
    const container = document.getElementById('filter-cards');
    container.innerHTML = '';
    currentPage = 1;
    const titleEl = document.getElementById('exercises-panel-title');
    if (titleEl) titleEl.textContent = 'Exercises';
    const input = document.getElementById('search-input');
    if (input) input.value = '';
    showPanel(true);
    await loadExercises();
    return;
  }

  showPanel(false);

  const container = document.getElementById('filter-cards');
  container.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const { results } = await fetchFilters(filter);
    let html = '';
    for (let i = 0; i < results.length; i++) {
      const item = results[i];
      html += `
      <button class="filter-card" data-value="${item.name}" style="background-image: url('${item.imgURL || ''}')">
        <div class="filter-card-body">
          <span class="filter-card-name">${toTitleCase(item.name || item.filter)}</span>
          <span class="filter-card-type">${filter}</span>
        </div>
      </button>
    `;
    }
    container.innerHTML = html;
  } catch {
    container.innerHTML = '<p class="error">Failed to load filters.</p>';
  }
}

async function selectFilterCard(value) {
  currentFilterValue = value;
  currentPage = 1;
  currentKeyword = '';
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  updateExercisesTitle();
  showPanel(true);
  await loadExercises();
}

function updateExercisesTitle() {
  const titleEl = document.getElementById('exercises-panel-title');
  if (titleEl) {
    if (currentFilterValue) {
      titleEl.innerHTML = `Exercises / <span class="exercises-category">${toTitleCase(currentFilterValue)}</span>`;
    } else {
      titleEl.textContent = 'Exercises';
    }
  }
}

async function loadExercises() {
  const list = document.getElementById('exercises-list');
  list.innerHTML = '<li class="loading">Loading...</li>';

  const filterKey = FILTER_KEY_MAP[currentFilter] || 'muscles';

  try {
    const params = { page: currentPage, limit: LIMIT };
    if (currentFilterValue) params[filterKey] = currentFilterValue;
    if (currentKeyword) params.keyword = currentKeyword;

    const { results, totalPages } = await fetchExercises(params);
    if (!results.length) {
      list.innerHTML = '<li class="empty">No exercises found.</li>';
    } else {
      let html = '';
      for (let i = 0; i < results.length; i++) {
        const ex = results[i];
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
          <button class="ex-start-btn" data-id="${ex._id}">Start <span class="ex-start-arrow">→</span></button>
        </li>
      `;
      }
      list.innerHTML = html;
      list.querySelectorAll('.ex-start-btn').forEach(function(btn) {
        btn.addEventListener('click', function() { openExerciseModal(btn.dataset.id); });
      });
    }
    renderPagination(totalPages);
  } catch {
    list.innerHTML = '<li class="error">Failed to load exercises.</li>';
  }
}

function renderPagination(totalPages) {
  const pag = document.getElementById('pagination');
  if (totalPages <= 1) {
    pag.innerHTML = '';
    return;
  }
  let html = '';
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
  }
  pag.innerHTML = html;
  pag.querySelectorAll('.page-btn').forEach(function(btn) {
    btn.addEventListener('click', async function() {
      currentPage = parseInt(btn.dataset.page, 10);
      await loadExercises();
      document.querySelector('.exercises-panel')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function showPanel(show) {
  const panel = document.getElementById('exercises-panel');
  const filterCards = document.getElementById('filter-cards');
  const backBtn = document.getElementById('back-to-filters');
  panel.classList.toggle('hidden', !show);
  filterCards.classList.toggle('hidden', show);
  if (backBtn) {
    const noGridToReturn = show && currentFilter === 'Body parts' && !currentFilterValue;
    backBtn.classList.toggle('hidden', noGridToReturn);
  }
}

function setupFilterCards() {
  document.getElementById('filter-cards').addEventListener('click', function(e) {
    const btn = e.target.closest('.filter-card');
    if (btn) selectFilterCard(btn.dataset.value);
  });
}

function setupFilterTabs() {
  document.getElementById('filter-tabs').addEventListener('click', async function(e) {
    const btn = e.target.closest('.filter-tab');
    if (!btn) return;
    document.querySelectorAll('.filter-tab').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    await loadFilterCards(btn.dataset.filter);
  });
}

function setupBackBtn() {
  document.getElementById('back-to-filters').addEventListener('click', function() {
    showPanel(false);
  });
}

function setupSearch() {
  document.getElementById('search-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    currentKeyword = document.getElementById('search-input').value.trim();
    currentPage = 1;
    await loadExercises();
  });
}
