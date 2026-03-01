const activeModals = new WeakMap();

export function openModal(overlayEl) {
  overlayEl.classList.remove('hidden');
  document.body.classList.add('no-scroll');

  function onKey(e) {
    if (e.key === 'Escape') closeModal(overlayEl);
  }
  function onBackdrop(e) {
    if (e.target === overlayEl) closeModal(overlayEl);
  }

  document.addEventListener('keydown', onKey);
  overlayEl.addEventListener('click', onBackdrop);

  activeModals.set(overlayEl, { onKey, onBackdrop });
}

export function closeModal(overlayEl) {
  overlayEl.classList.add('hidden');
  document.body.classList.remove('no-scroll');

  const handlers = activeModals.get(overlayEl);
  if (handlers) {
    document.removeEventListener('keydown', handlers.onKey);
    overlayEl.removeEventListener('click', handlers.onBackdrop);
    activeModals.delete(overlayEl);
  }
}
