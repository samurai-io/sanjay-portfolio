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

document.querySelectorAll('[data-study-carousel]').forEach((carousel) => {
  const slides = [...carousel.querySelectorAll('.study')];
  if (slides.length < 2) return;

  const previousButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const toggleButton = carousel.querySelector('[data-carousel-toggle]');
  const counter = carousel.querySelector('.study-carousel-counter');
  const liveRegion = carousel.querySelector('[data-carousel-live]');
  const animationTimers = new Map();
  let currentIndex = 0;
  let rotationPaused = reduceMotion;
  let isHovered = false;
  let hasFocus = false;
  let isReadingNotes = false;
  let isInView = true;

  carousel.dataset.enhanced = 'true';
  slides.forEach((slide, index) => {
    const title = slide.querySelector('.study-description h3')?.textContent.trim() ?? 'Study';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}: ${title}`);
    slide.classList.toggle('is-active', index === currentIndex);
    slide.classList.toggle('is-visible', index === currentIndex);
    slide.inert = index !== currentIndex;
    slide.setAttribute('aria-hidden', String(index !== currentIndex));
  });

  const updateCounter = () => {
    if (counter) counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const updateRotationControl = () => {
    if (!toggleButton) return;
    toggleButton.textContent = rotationPaused ? 'Resume rotation' : 'Pause rotation';
    toggleButton.setAttribute('aria-label', rotationPaused ? 'Resume automatic project rotation' : 'Pause automatic project rotation');
  };

  const moveTo = (nextIndex, direction, announce = false) => {
    if (nextIndex === currentIndex) return;
    const previousSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];
    const leavingClass = direction > 0 ? 'is-leaving-next' : 'is-leaving-previous';
    const enteringClass = direction > 0 ? 'is-entering-next' : 'is-entering-previous';

    [previousSlide, nextSlide].forEach((slide) => {
      const timer = animationTimers.get(slide);
      if (timer) window.clearTimeout(timer);
      animationTimers.delete(slide);
      slide.classList.remove('is-entering-next', 'is-entering-previous', 'is-leaving-next', 'is-leaving-previous');
    });

    previousSlide.classList.remove('is-active');
    previousSlide.classList.add(leavingClass);
    previousSlide.inert = true;
    previousSlide.setAttribute('aria-hidden', 'true');

    nextSlide.classList.add('is-active', 'is-visible', enteringClass);
    nextSlide.inert = false;
    nextSlide.setAttribute('aria-hidden', 'false');
    currentIndex = nextIndex;
    isReadingNotes = [...nextSlide.querySelectorAll('details')].some((details) => details.open);
    updateCounter();

    if (announce && liveRegion) {
      const title = nextSlide.querySelector('.study-description h3')?.textContent.trim() ?? 'Study';
      liveRegion.textContent = `${carousel.dataset.carouselLabel ?? 'Study'} ${currentIndex + 1} of ${slides.length}: ${title}`;
    }

    [
      [previousSlide, leavingClass],
      [nextSlide, enteringClass]
    ].forEach(([slide, className]) => {
      const timer = window.setTimeout(() => {
        slide.classList.remove(className);
        animationTimers.delete(slide);
      }, reduceMotion ? 30 : 850);
      animationTimers.set(slide, timer);
    });
  };

  const step = (amount, announce = true) => {
    const nextIndex = (currentIndex + amount + slides.length) % slides.length;
    moveTo(nextIndex, amount, announce);
  };

  previousButton?.addEventListener('click', () => step(-1));
  nextButton?.addEventListener('click', () => step(1));
  toggleButton?.addEventListener('click', () => {
    rotationPaused = !rotationPaused;
    updateRotationControl();
  });
  if (toggleButton && reduceMotion) toggleButton.hidden = true;
  updateCounter();
  updateRotationControl();

  carousel.addEventListener('mouseenter', () => { isHovered = true; });
  carousel.addEventListener('mouseleave', () => { isHovered = false; });
  carousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') {
      rotationPaused = true;
      updateRotationControl();
    }
  });
  carousel.addEventListener('focusin', () => { hasFocus = true; });
  carousel.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => { hasFocus = carousel.contains(document.activeElement); });
  });
  slides.forEach((slide) => {
    slide.querySelectorAll('details').forEach((details) => {
      details.addEventListener('toggle', () => {
        isReadingNotes = [...slides].some((activeSlide) => activeSlide.classList.contains('is-active') && [...activeSlide.querySelectorAll('details')].some((item) => item.open));
      });
    });
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof Element && event.target.closest('input, textarea, select'))) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveTo(0, -1);
    } else if (event.key === 'End') {
      event.preventDefault();
      moveTo(slides.length - 1, 1);
    }
  });

  if ('IntersectionObserver' in window) {
    const carouselObserver = new IntersectionObserver(([entry]) => { isInView = entry.isIntersecting; }, { threshold: .15 });
    carouselObserver.observe(carousel);
  }

  window.setInterval(() => {
    if (!rotationPaused && !isHovered && !hasFocus && !isReadingNotes && isInView && !root.classList.contains('motion-paused') && document.visibilityState === 'visible') step(1, false);
  }, 3000);
});

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
