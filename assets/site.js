// Small progressive enhancements for the static GitHub Pages edition.
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close −' : 'Explore +';
  navigation?.classList.toggle('is-open', open);
});

const container = document.querySelector('.travel-gallery-layout');
const gallery = container?.querySelector('.travel-gallery');
const turtle = container?.querySelector('.gallery-inserted-photo');
if (container && gallery && turtle) {
  function positionTurtle() {
    const figures = Array.from(gallery.querySelectorAll('figure'));
    const geometry = figures.find(
      (figure) => figure.dataset.image === '/photos/museum.jpg',
    );
    if (!geometry) return;
    const bounds = container.getBoundingClientRect();
    const target = geometry.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(gallery).columnGap) || 30;
    if (bounds.width < target.width * 2 + gap - 2) {
      turtle.removeAttribute('style');
      container.style.minHeight = '';
      return;
    }
    const right = target.right - bounds.left + gap;
    const left =
      right + target.width <= bounds.width + 2
        ? right
        : target.left - bounds.left - gap - target.width;
    let top = target.top - bounds.top;
    for (const figure of figures) {
      const rect = figure.getBoundingClientRect();
      if (Math.abs(rect.left - bounds.left - left) < 3)
        top = Math.max(top, rect.bottom - bounds.top + 38);
    }
    Object.assign(turtle.style, {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${target.width}px`,
    });
    container.style.minHeight = `${Math.max(gallery.offsetHeight, top + turtle.offsetHeight + 38)}px`;
  }
  const observer = new ResizeObserver(positionTurtle);
  observer.observe(gallery);
  observer.observe(turtle);
  gallery.addEventListener('load', positionTurtle, true);
  positionTurtle();
}
