(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- gracefully hide any image that fails to load ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.opacity = '0';
    });
  });

  /* ---------- keep "CE QU'ON FAIT POUR TOI." on one line at any width ---------- */
  var fitTitle = document.querySelector('.vp-services-title');
  if (fitTitle) {
    var fitTitleBaseSize = null;
    var fitTitleTimer = null;
    var fitOneLine = function () {
      fitTitle.style.fontSize = '';
      if (fitTitleBaseSize === null) {
        fitTitleBaseSize = parseFloat(getComputedStyle(fitTitle).fontSize);
      }
      var available = fitTitle.clientWidth;
      var needed = fitTitle.scrollWidth;
      if (needed > available) {
        fitTitle.style.fontSize = (fitTitleBaseSize * (available / needed) * 0.97) + 'px';
      }
    };
    fitOneLine();
    window.addEventListener('resize', function () {
      fitTitleBaseSize = null;
      window.clearTimeout(fitTitleTimer);
      fitTitleTimer = window.setTimeout(fitOneLine, 150);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { fitTitleBaseSize = null; fitOneLine(); });
    }
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.site-reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- top scroll progress bar ---------- */
  var progressBar = document.getElementById('progressBar');
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  /* ---------- parallax on service media ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  function updateParallax() {
    var vh = window.innerHeight;
    parallaxEls.forEach(function (wrap) {
      var rect = wrap.getBoundingClientRect();
      var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      var img = wrap.querySelector('img');
      if (img) img.style.transform = 'translateY(' + (progress * -34) + 'px)';
    });
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateProgress();
        if (!reduceMotion) updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- cursor spotlight ---------- */
  if (!reduceMotion) {
    ['spotlight', 'spotlightCta'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var parent = el.parentElement;
      parent.addEventListener('mousemove', function (e) {
        var rect = parent.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--x', x + '%');
        el.style.setProperty('--y', y + '%');
      });
    });
  }

  /* ---------- count-up stats ---------- */
  var stats = document.querySelectorAll('.stat strong[data-count]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var start = 0;
    var duration = 1400;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  if (stats.length) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    stats.forEach(function (el) { statsObserver.observe(el); });
  }

  /* ---------- hero slider (one slide per service) ---------- */
  var slider = document.querySelector('.hero-slider');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slider-dot]'));
    var prevBtn = slider.querySelector('[data-slider-prev]');
    var nextBtn = slider.querySelector('[data-slider-next]');
    var current = 0;
    var autoplayDelay = 6500;
    var autoplayTimer = null;

    function goTo(index) {
      index = (index + slides.length) % slides.length;
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      dots[current].setAttribute('aria-selected', 'false');
      current = index;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(next, autoplayDelay);
    }
    function stopAutoplay() {
      if (autoplayTimer) { window.clearInterval(autoplayTimer); autoplayTimer = null; }
    }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); restartAutoplay(); });
    });

    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); restartAutoplay(); }
      if (e.key === 'ArrowLeft') { prev(); restartAutoplay(); }
    });

    var touchStartX = null;
    slider.addEventListener('touchstart', function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); restartAutoplay(); }
      touchStartX = null;
    }, { passive: true });

    startAutoplay();
  }

  /* ---------- mobile menu ---------- */
  var menuButton = document.getElementById('menuButton');
  var menuClose = document.getElementById('menuClose');
  var mobileMenu = document.getElementById('mobileMenu');
  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (menuButton) menuButton.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  /* ---------- desktop nav dropdown (Portfolio) ---------- */
  document.querySelectorAll('[data-dropdown]').forEach(function (dropdown) {
    var trigger = dropdown.querySelector('[data-dropdown-trigger]');
    var closeTimer = null;
    function open() {
      window.clearTimeout(closeTimer);
      dropdown.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      dropdown.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
    function scheduleClose() {
      window.clearTimeout(closeTimer);
      // grace period so the cursor can cross the visual gap between the
      // trigger and the menu below it without the menu closing mid-move
      closeTimer = window.setTimeout(close, 300);
    }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.contains('is-open') ? close() : open();
    });
    dropdown.addEventListener('mouseenter', open);
    dropdown.addEventListener('mouseleave', scheduleClose);
    document.addEventListener('click', function (e) { if (!dropdown.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  });

  /* ---------- mobile nav dropdown (disclosure) ---------- */
  document.querySelectorAll('[data-mobile-dropdown-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = btn.closest('.mobile-menu-item').querySelector('[data-mobile-dropdown-panel]');
      var isOpen = panel.classList.toggle('is-open');
      btn.classList.toggle('is-open', isOpen);
    });
  });

  /* ---------- video portfolio modal ---------- */
  var videoModal = document.getElementById('videoModal');
  if (videoModal) {
    var videoModalWrap = videoModal.querySelector('[data-video-modal-wrap]');
    var videoModalClose = videoModal.querySelector('[data-video-modal-close]');

    function openVideoModal(src, title) {
      if (src) {
        videoModalWrap.innerHTML = '<iframe src="' + src + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + (title || 'Lecteur vidéo') + '"></iframe>';
      } else {
        videoModalWrap.innerHTML = '<div class="video-modal-placeholder">Vidéo à venir — remplace l’attribut<br><code>data-video-src</code><br>par le lien d’intégration Vimeo ou YouTube réel.</div>';
      }
      videoModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeVideoModal() {
      videoModal.classList.remove('is-open');
      videoModalWrap.innerHTML = '';
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-video-src]').forEach(function (card) {
      card.addEventListener('click', function () {
        openVideoModal(card.getAttribute('data-video-src'), card.getAttribute('data-video-title'));
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openVideoModal(card.getAttribute('data-video-src'), card.getAttribute('data-video-title'));
        }
      });
    });
    videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', function (e) { if (e.target === videoModal) closeVideoModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVideoModal(); });
  }
})();
