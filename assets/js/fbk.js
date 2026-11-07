/* Interactions for the forest/sage layout.
   Progressive enhancement only: every section is readable with JS disabled. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------- mobile menu */
  var toggle = document.querySelector('.nav__toggle');
  var navList = document.getElementById('nav-list');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.getAttribute('data-open') === 'true';
      navList.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });

    navList.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        navList.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------- nav shadow */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------- scroll spy */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var setCurrent = function (id) {
      navLinks.forEach(function (link) {
        link.setAttribute('aria-current', String(link.getAttribute('href') === '#' + id));
      });
    };

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setCurrent(entry.target.id); }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* --------------------------------------------------------- reveals */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!revealables.length) { return; }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { revealer.observe(el); });
  }
}());

/* ------------------------------------------------------- experience tabs */
(function () {
  'use strict';

  var tablist = document.querySelector('[data-xp-tablist]');
  if (!tablist) { return; }

  var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));

  function select(index, focus) {
    tabs.forEach(function (tab, i) {
      var selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('tabindex', selected ? '0' : '-1');
      if (selected && focus) { tab.focus(); }
    });

    panels.forEach(function (panel, i) {
      panel.setAttribute('data-active', String(i === index));
    });
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { select(index, false); });

    tab.addEventListener('keydown', function (event) {
      var next = null;
      var vertical = window.matchMedia('(min-width: 1001px)').matches;

      if (event.key === 'ArrowRight' || (vertical && event.key === 'ArrowDown')) { next = index + 1; }
      if (event.key === 'ArrowLeft' || (vertical && event.key === 'ArrowUp')) { next = index - 1; }
      if (event.key === 'Home') { next = 0; }
      if (event.key === 'End') { next = tabs.length - 1; }

      if (next === null) { return; }
      event.preventDefault();
      select((next + tabs.length) % tabs.length, true);
    });
  });

  select(0, false);
}());

/* ------------------------------------------------ current-work carousel
   Two cards, one in view. The chevrons, the dots, the arrow keys and a
   drag all move between them. The track is a plain stack until this runs,
   so the cards stay readable with scripting off.                        */
(function () {
  'use strict';

  var root = document.querySelector('[data-carousel]');
  if (!root) { return; }

  var track = root.querySelector('[data-carousel-track]');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel__slide'));
  var dots = Array.prototype.slice.call(root.querySelectorAll('.carousel__dot'));
  var status = root.querySelector('[data-carousel-status]');
  var prev = root.querySelector('[data-carousel-prev]');
  var next = root.querySelector('[data-carousel-next]');

  if (!track || slides.length < 2) { return; }

  var index = 0;
  var count = slides.length;

  function render(announce) {
    track.style.transform = 'translateX(' + (-index * 100) + '%)';

    slides.forEach(function (slide, i) {
      var active = i === index;
      slide.setAttribute('data-active', String(active));
      slide.setAttribute('aria-hidden', String(!active));
      // keeps links in the hidden card out of the tab order
      if ('inert' in slide) { slide.inert = !active; }
    });

    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-current', String(i === index));
    });

    if (announce && status) {
      // the wording comes from the page, so it follows its language
      var template = status.getAttribute('data-status-template') || 'Card %n of %total';
      status.textContent = template.replace('%n', index + 1).replace('%total', count)
        + ': ' + slides[index].querySelector('.panel__title').textContent.trim();
    }
  }

  function go(to, announce) {
    index = (to + count) % count;   // wraps, so neither chevron is ever dead
    render(announce);
  }

  if (prev) { prev.addEventListener('click', function () { go(index - 1, true); }); }
  if (next) { next.addEventListener('click', function () { go(index + 1, true); }); }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { go(i, true); });
  });

  root.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1, true); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1, true); }
  });

  /* drag / swipe — pointer events cover mouse, pen and touch alike */
  var startX = null;
  var startY = null;
  var dragging = false;

  track.addEventListener('pointerdown', function (event) {
    if (event.button !== undefined && event.button !== 0) { return; }
    startX = event.clientX;
    startY = event.clientY;
    dragging = true;
  });

  track.addEventListener('pointerup', function (event) {
    if (!dragging || startX === null) { return; }
    dragging = false;

    var dx = event.clientX - startX;
    var dy = event.clientY - startY;
    startX = null;

    // horizontal intent only, so a vertical scroll never flips the card
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      go(index + (dx < 0 ? 1 : -1), true);
    }
  });

  track.addEventListener('pointercancel', function () {
    dragging = false;
    startX = null;
  });

  root.setAttribute('data-ready', 'true');
  render(false);
}());

/* ------------------------------------------------- portrait simulation
   The photograph is sampled into a field of particles. Each one is held
   to its pixel by a spring, drifts slightly, and scatters away from the
   pointer before easing back. Decorative enhancement only: the canvas
   carries role="img" with a label, and a plain <img> stands in without
   scripting.                                                            */
(function () {
  'use strict';

  var canvas = document.querySelector('[data-sim="portrait"]');
  if (!canvas || !canvas.getContext) { return; }

  var ctx = canvas.getContext('2d');
  var W = canvas.width;
  var H = canvas.height;

  // derived from the backing size so the grain stays the same at any scale
  var STEP = Math.max(4, Math.round(W / 73));   // sampling grid, in canvas pixels
  var DOT = W / 129;                            // particle size
  var SPRING = 0.055;                           // pull back to the sampled pixel
  var DAMPING = 0.88;
  var POINTER_R = W * 0.177;                    // scatter radius
  var POINTER_F = W / 169;                      // scatter strength

  var IVORY = '244, 241, 232';
  var SAGE = '167, 197, 163';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var particles = [];
  var buckets = [];

  var image = new Image();
  image.onload = build;
  image.onerror = function () { canvas.style.display = 'none'; };
  image.src = canvas.getAttribute('data-src');

  function build() {
    var off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    var octx = off.getContext('2d');

    // cover-fit the photograph into the square canvas
    var scale = Math.max(W / image.width, H / image.height);
    var dw = image.width * scale;
    var dh = image.height * scale;
    octx.drawImage(image, (W - dw) / 2, (H - dh) / 2, dw, dh);

    var data;
    try {
      data = octx.getImageData(0, 0, W, H).data;
    } catch (e) {
      canvas.style.display = 'none';
      return;
    }

    for (var y = 0; y < H; y += STEP) {
      for (var x = 0; x < W; x += STEP) {
        var idx = (y * W + x) * 4;
        var alpha = data[idx + 3];
        if (alpha < 24) { continue; }

        var lum = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
        var strength = Math.pow(lum, 1.15) * (alpha / 255);
        if (strength < 0.1) { continue; }

        particles.push({
          hx: x, hy: y,
          x: x, y: y,
          vx: 0, vy: 0,
          a: strength,
          sage: strength > 0.78 && Math.random() < 0.14
        });
      }
    }

    // group by opacity so a frame costs a handful of state changes
    for (var b = 0; b < 5; b++) { buckets.push([]); }
    particles.forEach(function (p) {
      var slot = Math.min(4, Math.floor(p.a * 5));
      buckets[slot].push(p);
    });

    draw();
    if (reduceMotion) { return; }
    observe();
  }

  var pointer = { x: -9999, y: -9999, on: false };

  function trackPointer(event) {
    var rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) * (W / rect.width);
    pointer.y = (event.clientY - rect.top) * (H / rect.height);
    pointer.on = true;
  }

  function dropPointer() {
    pointer.on = false;
    pointer.x = pointer.y = -9999;
  }

  canvas.addEventListener('pointermove', trackPointer);
  canvas.addEventListener('pointerdown', trackPointer);
  canvas.addEventListener('pointerleave', dropPointer);
  canvas.addEventListener('pointercancel', dropPointer);

  function step() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (pointer.on) {
        var dx = p.x - pointer.x;
        var dy = p.y - pointer.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < POINTER_R * POINTER_R && d2 > 0.5) {
          var d = Math.sqrt(d2);
          var push = (1 - d / POINTER_R) * POINTER_F;
          p.vx += (dx / d) * push;
          p.vy += (dy / d) * push;
        }
      }

      p.vx += (p.hx - p.x) * SPRING;
      p.vy += (p.hy - p.y) * SPRING;
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var b = 0; b < buckets.length; b++) {
      var list = buckets[b];
      if (!list.length) { continue; }
      var alpha = ((b + 0.5) / buckets.length).toFixed(2);
      ctx.fillStyle = 'rgba(' + IVORY + ',' + alpha + ')';
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (p.sage) { continue; }
        ctx.fillRect(p.x - DOT / 2, p.y - DOT / 2, DOT, DOT);
      }
      ctx.fillStyle = 'rgba(' + SAGE + ',' + alpha + ')';
      for (var j = 0; j < list.length; j++) {
        var q = list[j];
        if (!q.sage) { continue; }
        ctx.fillRect(q.x - DOT / 2, q.y - DOT / 2, DOT, DOT);
      }
    }
  }

  var running = false;
  var frame = null;

  function loop() {
    step();
    draw();
    frame = window.requestAnimationFrame(loop);
  }

  function start() {
    if (running) { return; }
    running = true;
    loop();
  }

  function stop() {
    running = false;
    if (frame) { window.cancelAnimationFrame(frame); frame = null; }
  }

  function observe() {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { start(); } else { stop(); }
        });
      }, { threshold: 0.05 }).observe(canvas);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else { start(); }
    });
  }
}());
