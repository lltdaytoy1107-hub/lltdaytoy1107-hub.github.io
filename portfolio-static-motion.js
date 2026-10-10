(() => {
  const root = document.querySelector('[data-warp-react-root]');
  const text = root?.querySelector('.warp-text-static-fallback');
  if (!root || !text) return;
  let frame = 0;
  root.addEventListener('pointermove', event => {
    const rect = root.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      root.style.setProperty('--static-x', x.toFixed(3));
      root.style.setProperty('--static-y', y.toFixed(3));
      root.classList.add('static-motion-active');
    });
  });
  root.addEventListener('pointerleave', () => {
    root.style.setProperty('--static-x', '0');
    root.style.setProperty('--static-y', '0');
    root.classList.remove('static-motion-active');
  });
})();
