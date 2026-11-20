const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');
const finePointer = window.matchMedia('(pointer: fine)').matches;

const menuButton = document.querySelector('[data-menu-toggle]');
const mainNav = document.getElementById('main-nav');
const motionButton = document.querySelector('[data-motion-toggle]');
motionButton?.addEventListener('click', () => {
  const paused = root.classList.toggle('motion-paused');
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? 'Resume motion' : 'Pause motion');
  motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
});

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
  mainNav?.classList.toggle('is-open', open);
});
mainNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
  mainNav.classList.remove('is-open');
  if (window.matchMedia('(max-width: 680px)').matches) {
    const section = document.querySelector(link.hash);
    const heading = section?.matches('h1, h2, h3') ? section : section?.querySelector('h1, h2, h3');
    window.setTimeout(() => heading?.focus({ preventScroll: true }), 0);
  }
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
    mainNav?.classList.remove('is-open');
    menuButton.focus();
  }
});

const cursorTracker = document.querySelector('[data-cursor-tracker]');
if (cursorTracker && finePointer && !reduceMotion) {
  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    cursorX = event.clientX;
    cursorY = event.clientY;
    if (!cursorFrame) {
      cursorFrame = requestAnimationFrame(() => {
        cursorFrame = 0;
        cursorTracker.style.setProperty('--cursor-x', `${cursorX}px`);
        cursorTracker.style.setProperty('--cursor-y', `${cursorY}px`);
      });
    }
    const isInteractive = event.target instanceof Element && event.target.closest('a, button, summary, input, select, textarea, [role="button"]');
    root.classList.toggle('cursor-hover', Boolean(isInteractive));
    root.classList.add('cursor-visible');
  }, { passive: true });

  root.addEventListener('pointerleave', () => root.classList.remove('cursor-visible', 'cursor-hover'));
  window.addEventListener('blur', () => root.classList.remove('cursor-visible', 'cursor-hover'));
}

const studyControls = document.querySelector('[data-study-controls]');
if (studyControls) {
  const searchInput = studyControls.querySelector('[data-study-search]');
  const filterButtons = [...studyControls.querySelectorAll('[data-study-filter]')];
  const studies = [...document.querySelectorAll('.study[data-kind]')];
  const resultMessage = document.querySelector('[data-study-results]');
  const emptyMessage = document.querySelector('[data-study-empty]');
  let selectedKind = 'all';

  const updateStudies = () => {
    const query = searchInput?.value.trim().toLocaleLowerCase() ?? '';
    let visibleCount = 0;

    studies.forEach((study) => {
      const matchesKind = selectedKind === 'all' || study.dataset.kind === selectedKind;
      const matchesQuery = !query || study.dataset.search?.toLocaleLowerCase().includes(query);
      study.hidden = !(matchesKind && matchesQuery);
      if (!study.hidden) visibleCount += 1;
    });

    if (resultMessage) resultMessage.textContent = `Showing ${visibleCount} of ${studies.length} projects.`;
    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  };

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    selectedKind = button.dataset.studyFilter ?? 'all';
    filterButtons.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    updateStudies();
  }));
  searchInput?.addEventListener('input', updateStudies);

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !event.altKey && !event.ctrlKey && !event.metaKey && !(event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]'))) {
      event.preventDefault();
      searchInput?.focus();
    } else if (event.key === 'Escape' && document.activeElement === searchInput && searchInput?.value) {
      searchInput.value = '';
      updateStudies();
      searchInput.focus();
    }
  });

  studyControls.hidden = false;
  updateStudies();
}

let scrollFrame = 0;
const updateScroll = () => {
  scrollFrame = 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  root.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, progress))));
  header?.classList.toggle('is-scrolled', window.scrollY > 84);
  if (!reduceMotion) {
    const viewport = window.innerHeight || 1;
    const heroProgress = Math.max(0, Math.min(1, window.scrollY / (viewport * .82)));
    root.style.setProperty('--hero-title-scroll', `${(heroProgress * -18).toFixed(1)}px`);
    root.style.setProperty('--hero-image-scroll', `${(heroProgress * 16).toFixed(1)}px`);
    document.querySelectorAll('[data-depth]').forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const center = rect.top + rect.height / 2;
      const drift = Math.max(-10, Math.min(10, (center - viewport / 2) * -.016));
      element.style.setProperty('--scene-scroll-y', `${drift.toFixed(1)}px`);
    });
    document.querySelectorAll('[data-tilt]').forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewport) return;
      const center = rect.top + rect.height / 2;
      const drift = Math.max(-12, Math.min(12, (center - viewport / 2) * -.018));
      element.style.setProperty('--scroll-drift', `${drift.toFixed(1)}px`);
    });
  }
};
const scheduleScroll = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
};
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
updateScroll();

if (!reduceMotion && 'IntersectionObserver' in window) {
  root.classList.add('motion-ready');

  const staggerGroups = ['.capability-list', '.study-list', '.toolkit-list', '.principle-list'];
  staggerGroups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((group) => {
      [...group.children]
        .filter((child) => child.classList.contains('reveal'))
        .forEach((child, index) => child.style.setProperty('--reveal-delay', `${Math.min(index * 90, 360)}ms`));
    });
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .13, rootMargin: '0px 0px -38px 0px' });
  document.querySelectorAll('.reveal, .split-reveal, .intro-object').forEach((element) => revealObserver.observe(element));

  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const navSections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.removeAttribute('aria-current'));
    navLinks.find((link) => link.hash === `#${entry.target.id}`)?.setAttribute('aria-current', 'location');
  }), { rootMargin: '-35% 0px -58% 0px' });
  navSections.forEach((section) => navObserver.observe(section));

  const portrait = document.querySelector('.hero-portrait');
  if (hero && portrait && finePointer) {
    hero.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      portrait.style.setProperty('--hero-x', `${(x * -12).toFixed(1)}px`);
      portrait.style.setProperty('--hero-y', `${(y * -9).toFixed(1)}px`);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      portrait.style.setProperty('--hero-x', '0px');
      portrait.style.setProperty('--hero-y', '0px');
    });
  }

  const helmet = document.querySelector('[data-depth]');
  const introScene = helmet?.closest('.intro') ?? helmet;
  if (helmet && introScene && finePointer) {
    const moveHelmet = (event) => {
      const bounds = introScene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      helmet.style.setProperty('--pointer-x', `${(x * -18).toFixed(1)}px`);
      helmet.style.setProperty('--pointer-y', `${(y * -12).toFixed(1)}px`);
      helmet.style.setProperty('--pointer-rotate', `${(x * -2.2).toFixed(2)}deg`);
    };
    introScene.addEventListener('pointermove', moveHelmet, { passive: true });
    introScene.addEventListener('pointerleave', () => {
      helmet.style.setProperty('--pointer-x', '0px');
      helmet.style.setProperty('--pointer-y', '0px');
      helmet.style.setProperty('--pointer-rotate', '0deg');
    });
  }

  if (finePointer) {
    document.querySelectorAll('[data-tilt]').forEach((visual) => {
      visual.addEventListener('pointermove', (event) => {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;
        visual.style.setProperty('--tilt-y', `${(x * 3.6).toFixed(2)}deg`);
        visual.style.setProperty('--tilt-x', `${(y * -2.8).toFixed(2)}deg`);
      }, { passive: true });
      visual.addEventListener('pointerleave', () => {
        visual.style.setProperty('--tilt-x', '0deg');
        visual.style.setProperty('--tilt-y', '0deg');
      });
    });
  }
}
