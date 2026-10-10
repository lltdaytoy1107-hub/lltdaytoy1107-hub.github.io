(() => {
  document.querySelectorAll('[data-warp-text]').forEach(root => {
    const text = root.querySelector('.warp-text__fallback');
    if (!text) return;
    let frame = 0;
    const move = event => {
      const rect = root.getBoundingClientRect();
      const x = (event.clientX - rect.left) / Math.max(1, rect.width) - .5;
      const y = (event.clientY - rect.top) / Math.max(1, rect.height) - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--warp-x', x.toFixed(3));
        root.style.setProperty('--warp-y', y.toFixed(3));
        root.style.setProperty('--warp-distance', Math.min(1, Math.hypot(x, y) * 1.6).toFixed(3));
        root.classList.add('warp-pointer-active');
      });
    };
    const leave = () => {
      root.style.setProperty('--warp-x', '0');
      root.style.setProperty('--warp-y', '0');
      root.style.setProperty('--warp-distance', '0');
      root.classList.remove('warp-pointer-active');
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
  });
})();
