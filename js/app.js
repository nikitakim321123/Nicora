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

  var formError = document.getElementById('formError');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(contactForm);
      var payload = {
        name: (data.get('name') || '').toString().trim(),
        phone: (data.get('phone') || '').toString().trim(),
        city: (data.get('city') || '').toString().trim(),
        message: (data.get('message') || '').toString().trim()
      };

      var submitBtn = contactForm.querySelector('.form-submit');
      if (submitBtn) submitBtn.disabled = true;
      if (formError) formError.hidden = true;

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('request failed');
          contactForm.hidden = true;
          formSuccess.hidden = false;
        })
        .catch(function () {
          if (submitBtn) submitBtn.disabled = false;
          if (formError) formError.hidden = false;
        });
    });
  }

  /* ---------- product gallery ---------- */
  Array.prototype.slice.call(document.querySelectorAll('[data-gallery]')).forEach(function (gallery) {
    var mainImg = gallery.querySelector('[data-gallery-img]');
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-thumb]'));
    var prevBtn = gallery.querySelector('[data-gallery-prev]');
    var nextBtn = gallery.querySelector('[data-gallery-next]');
    if (!mainImg || !thumbs.length) return;
    var index = 0;

    function show(i) {
      index = (i + thumbs.length) % thumbs.length;
      var thumb = thumbs[index];
      mainImg.src = thumb.getAttribute('data-src');
      mainImg.alt = thumb.getAttribute('data-alt') || mainImg.alt;
      thumbs.forEach(function (t, ti) { t.classList.toggle('is-active', ti === index); });
    }

    thumbs.forEach(function (t, ti) {
      t.addEventListener('click', function () { show(ti); });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });
  });

  /* ---------- init ---------- */
  render(location.pathname, { scroll: false });
})();
