'use strict';

const root = document.documentElement;
const toggle = document.querySelector('.theme-switch');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

toggle.addEventListener('click', () => {
  const light = root.dataset.theme !== 'light';
  root.dataset.theme = light ? 'light' : 'dark';
  toggle.setAttribute('aria-checked', String(light));
  toggle.setAttribute('aria-label', light ? '다크 모드로 전환' : '화이트 모드로 전환');
  document.querySelector('meta[name="theme-color"]').content = light ? '#f0f0f0' : '#101010';
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const id = target.id;
    const offset = id === 'home' ? 0 : document.querySelector('.site-header').getBoundingClientRect().height + 16;
    const top = id === 'home' ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: motion.matches ? 'instant' : 'smooth' });
    history.replaceState(null, '', '#' + id);
    if (id !== 'home') {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });
});

if ('IntersectionObserver' in window && !motion.matches) {
  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -3% 0px' });
  // Reset off screen, beyond the 30px reveal movement, to avoid edge flicker.
  const resetObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) entry.target.classList.remove('is-visible');
    });
  }, { rootMargin: '64px 0px 64px 0px' });
  document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
    resetObserver.observe(element);
  });
}

const heroTitle = document.querySelector('.hero-title');
const hero = document.querySelector('.hero');
const footer = document.querySelector('.contact');
const lamp = document.querySelector('.lamp-wrap');
let frame = 0;
function paintScroll() {
  frame = 0;
  if (motion.matches) return;
  if (window.scrollY < hero.offsetHeight) {
    heroTitle.style.setProperty('--hero-drift', Math.min(window.scrollY * .14, 110) + 'px');
  }
  const rect = footer.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / Math.min(window.innerHeight, rect.height)));
    lamp.style.setProperty('--lamp-drift', (1 - progress) * 26 + 'px');
    lamp.style.setProperty('--lamp-rotate', (1 - progress) * -2 + 'deg');
  }
}
function scheduleScroll() { if (!frame) frame = requestAnimationFrame(paintScroll); }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
paintScroll();
