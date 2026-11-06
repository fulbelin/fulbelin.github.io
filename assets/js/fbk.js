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
