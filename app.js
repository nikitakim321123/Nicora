(function () {
  'use strict';

  var ROUTES = {
    '/': 'home',
    '/models': 'models',
    '/models/nicora-m9': 'product',
    '/about': 'about',
    '/contacts': 'contacts',
  };

  var NAV_KEY_FOR_PAGE = {
    home: 'home',
    models: 'models',
    product: 'models',
    about: 'about',
    contacts: 'contacts',
  };

  var pages = Array.prototype.slice.call(document.querySelectorAll('.page'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('[data-page-link]'));

  function resolvePage(pathname) {
    return ROUTES[pathname] || 'home';
  }

  function render(pathname, opts) {
    var scroll = !opts || opts.scroll !== false;
    var page = resolvePage(pathname);
    var navKey = NAV_KEY_FOR_PAGE[page];

    pages.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-page') === page);
    });
    navLinks.forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-page-link') === navKey);
    });

    closeMobileMenu();

    if (scroll) {
      window.scrollTo(0, 0);
    }

    if (page === 'home') {
      startTypewriterWatcher();
    }

    document.title = pageTitle(page);
  }

  function pageTitle(page) {
    switch (page) {
      case 'models': return 'Модели — NICORA';
      case 'product': return 'Nicora M9 — NICORA';
      case 'about': return 'О бренде — NICORA';
      case 'contacts': return 'Контакты — NICORA';
      default: return 'NICORA — Умная бытовая техника';
    }
  }

  function navigate(pathname, opts) {
    if (location.pathname !== pathname) {
      history.pushState({}, '', pathname);
    }
    render(pathname, opts);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-link]');
    if (!link) return;
    var url = new URL(link.href, location.origin);
    if (url.origin !== location.origin) return;
    e.preventDefault();
    navigate(url.pathname);
  });

  window.addEventListener('popstate', function () {
    render(location.pathname);
  });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- typewriter ---------- */
  var TYPEWRITER_TEXT = 'Умная техника. Высокое качество. Бескомпромиссная поддержка наших клиентов.';
  var typewriterStarted = false;
  var typewriterObserver = null;

  function startTypewriterWatcher() {
    if (typewriterStarted) return;
    var section = document.getElementById('typewriterSection');
    var textEl = document.getElementById('typewriterText');
    var cursor = document.getElementById('typewriterCursor');
    if (!section || !textEl || !cursor) return;

    if (typewriterObserver) return;

    typewriterObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !typewriterStarted) {
        typewriterStarted = true;
        textEl.textContent = '';
        cursor.classList.add('is-visible');
        var i = 0;
        (function tick() {
          if (i < TYPEWRITER_TEXT.length) {
            textEl.textContent += TYPEWRITER_TEXT[i++];
            setTimeout(tick, 42);
          }
        })();
        typewriterObserver.disconnect();
      }
    }, { threshold: 0.2 });
    typewriterObserver.observe(section);
  }

  /* ---------- contact form ---------- */
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactForm.hidden = true;
      formSuccess.hidden = false;
    });
  }

  /* ---------- init ---------- */
  render(location.pathname, { scroll: false });
})();
