const BASE_URL = 'https://your-energy.b.goit.study/api';

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function fetchQuote() {
  const key = `ef_quote_${new Date().toDateString()}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);
  const data = await request('/quote');
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

export async function fetchFilters(filter) {
  return request(`/filters?filter=${encodeURIComponent(filter)}`);
}

export async function fetchExercises({ bodyPart, equipment, muscles, keyword, page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (bodyPart) params.set('bodyPart', bodyPart);
  if (equipment) params.set('equipment', equipment);
  if (muscles) params.set('muscles', muscles);
  if (keyword) params.set('keyword', keyword);
  return request(`/exercises?${params}`);
}

export async function fetchExerciseById(id) {
  return request(`/exercises/${id}`);
}

export async function patchExerciseRating(id, { rating, email, comment }) {
  const body = { rating };
  if (email) body.email = email;
  if (comment) body.comment = comment;
  const res = await fetch(`${BASE_URL}/exercises/${id}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function postSubscription(email) {
  const res = await fetch(`${BASE_URL}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
