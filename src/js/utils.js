export function renderStars(rating) {
  const filled = Math.round(rating || 0);
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < filled) {
      html += '<span class="star-icon filled">★</span>';
    } else {
      html += '<span class="star-icon">★</span>';
    }
  }
  return html;
}
