/**
 * script.js — Mangalam HDPE Pipes Product Page
 * Handles: Sticky Header, Image Carousel, Zoom Preview, FAQ, Process Tabs, Mobile Nav
 */

'use strict';

/* ============================================================
   1. STICKY HEADER
   ============================================================
   - Appears above the navbar when user scrolls past first fold
   - Disappears when scrolling back to top
   - Navbar shifts down to accommodate sticky header
   - Smooth CSS transition handles animation
   ============================================================ */
(function initStickyHeader() {
  const stickyHeader = document.getElementById('sticky-header');
  const navbar = document.getElementById('navbar');

  if (!stickyHeader || !navbar) return;

  // "First fold" = one viewport height
  const SCROLL_THRESHOLD = window.innerHeight * 0.9;

  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    lastScrollY = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(function () {
        if (lastScrollY > SCROLL_THRESHOLD) {
          // Show sticky header: slide it down to top:0
          stickyHeader.classList.add('visible');
          // Push navbar below the sticky header
          navbar.classList.add('with-sticky');
        } else {
          // Hide sticky header: slide it back up
          stickyHeader.classList.remove('visible');
          navbar.classList.remove('with-sticky');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
})();


/* ============================================================
   2. IMAGE CAROUSEL WITH ZOOM PREVIEW
   ============================================================
   - Thumbnail click changes main image
   - Arrow buttons cycle through images
   - Mouse hover on main image shows:
     (a) a small lens rectangle tracking the cursor
     (b) a zoomed preview panel beside the image
   ============================================================ */
(function initCarousel() {
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=85',
      alt: 'HDPE Pipes on site'
    },
    {
      src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=85',
      alt: 'Industrial pipeline'
    },
    {
      src: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=85',
      alt: 'Pipe manufacturing'
    },
    {
      src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&q=85',
      alt: 'HDPE coils'
    },
    {
      src: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=900&q=85',
      alt: 'Installation process'
    }
  ];

  let currentIndex = 0;

  const mainImg = document.getElementById('mainImg');
  const thumbsContainer = document.getElementById('thumbs');
  const zoomLens = document.getElementById('zoomLens');
  const zoomResult = document.getElementById('zoomResult');
  const zoomResultImg = document.getElementById('zoomResultImg');
  const mainWrapper = document.querySelector('.gallery-main-wrapper');

  if (!mainImg || !thumbsContainer) return;

  /* ── Build thumbnails ── */
  images.forEach(function (imgData, index) {
    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb' + (index === 0 ? ' active' : '');
    thumb.setAttribute('role', 'button');
    thumb.setAttribute('aria-label', 'View image ' + (index + 1));
    thumb.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.loading = 'lazy';

    thumb.appendChild(img);

    // Click handler
    thumb.addEventListener('click', function () { setImage(index); });

    // Keyboard accessibility
    thumb.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setImage(index);
      }
    });

    thumbsContainer.appendChild(thumb);
  });

  /* ── Set active image ── */
  function setImage(index) {
    currentIndex = index;
    mainImg.src = images[index].src;
    mainImg.alt = images[index].alt;

    // Update zoom result image source too
    if (zoomResultImg) {
      zoomResultImg.src = images[index].src;
    }

    // Update thumbnail active state
    const thumbs = thumbsContainer.querySelectorAll('.gallery-thumb');
    thumbs.forEach(function (t, i) {
      t.classList.toggle('active', i === index);
    });
  }

  /* ── Arrow navigation ── */
  window.nextImg = function () {
    setImage((currentIndex + 1) % images.length);
  };

  window.prevImg = function () {
    setImage((currentIndex - 1 + images.length) % images.length);
  };

  /* ── Keyboard navigation on arrows ── */
  document.addEventListener('keydown', function (e) {
    if (document.activeElement && document.activeElement.closest('.gallery')) {
      if (e.key === 'ArrowRight') window.nextImg();
      if (e.key === 'ArrowLeft') window.prevImg();
    }
  });

  /* ── ZOOM FUNCTIONALITY ── */
  if (!mainWrapper || !zoomLens || !zoomResult || !zoomResultImg) return;

  // Zoom multiplier (how much the preview zooms in)
  const ZOOM_FACTOR = 3;

  function getImageNaturalSize(img) {
    return { w: img.naturalWidth || 900, h: img.naturalHeight || 675 };
  }

  function updateZoom(e) {
    const rect = mainWrapper.getBoundingClientRect();

    // Mouse position relative to the wrapper
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Dimensions of the main image display
    const displayW = rect.width;
    const displayH = rect.height;

    // Dimensions of the zoom lens rectangle
    const lensW = zoomLens.offsetWidth;
    const lensH = zoomLens.offsetHeight;

    // Position lens so mouse is at its center, clamped to image bounds
    let lensX = mouseX - lensW / 2;
    let lensY = mouseY - lensH / 2;

    lensX = Math.max(0, Math.min(lensX, displayW - lensW));
    lensY = Math.max(0, Math.min(lensY, displayH - lensH));

    zoomLens.style.left = lensX + 'px';
    zoomLens.style.top = lensY + 'px';

    // Calculate background-position for zoom result
    // Ratio of cursor within the image
    const ratioX = lensX / (displayW - lensW);
    const ratioY = lensY / (displayH - lensH);

    // Zoomed image dimensions inside the result box
    const zoomedW = zoomResult.offsetWidth * ZOOM_FACTOR;
    const zoomedH = zoomResult.offsetHeight * ZOOM_FACTOR;

    const bgX = -(ratioX * (zoomedW - zoomResult.offsetWidth));
    const bgY = -(ratioY * (zoomedH - zoomResult.offsetHeight));

    zoomResultImg.style.width = zoomedW + 'px';
    zoomResultImg.style.height = zoomedH + 'px';
    zoomResultImg.style.left = bgX + 'px';
    zoomResultImg.style.top = bgY + 'px';
  }

  mainWrapper.addEventListener('mouseenter', function () {
    // Only show zoom on large screens
    if (window.innerWidth < 1025) return;

    zoomResultImg.src = images[currentIndex].src;
    zoomLens.style.display = 'block';
    zoomResult.style.display = 'block';
  });

  mainWrapper.addEventListener('mousemove', function (e) {
    if (window.innerWidth < 1025) return;
    updateZoom(e);
  });

  mainWrapper.addEventListener('mouseleave', function () {
    zoomLens.style.display = 'none';
    zoomResult.style.display = 'none';
  });
})();


/* ============================================================
   3. MANUFACTURING PROCESS TABS
   ============================================================ */
(function initProcessTabs() {
  const steps = [
    {
      title: 'High-Grade Raw Material Selection',
      desc: 'Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.',
      bullets: ['PE100 grade material', 'Optimal molecular weight distribution']
    },
    {
      title: 'Precision Extrusion Process',
      desc: 'State-of-the-art extruders melt and shape the raw HDPE granules into continuous pipe profiles with consistent dimensions.',
      bullets: ['Temperature-controlled zones', 'Consistent melt flow index']
    },
    {
      title: 'Controlled Cooling System',
      desc: 'Water cooling tanks rapidly cool the extruded pipe to lock in dimensions and ensure structural integrity throughout the pipe wall.',
      bullets: ['Uniform cooling gradient', 'Prevents internal stress formation']
    },
    {
      title: 'Precision Sizing & Calibration',
      desc: 'Sizing sleeves and vacuum calibration ensure the pipe maintains exact outer diameter tolerances throughout production.',
      bullets: ['Dimensional accuracy ±0.1mm', 'Roundness verification at every batch']
    },
    {
      title: 'Rigorous Quality Control',
      desc: 'Each pipe undergoes comprehensive testing for pressure, wall thickness, and ovality before proceeding to the next stage.',
      bullets: ['Hydrostatic pressure testing', 'Wall thickness measurement']
    },
    {
      title: 'Permanent Marking',
      desc: 'Laser or inkjet marking systems apply permanent identification including size, pressure rating, and batch number.',
      bullets: ['Permanent UV-resistant ink', 'Full batch traceability']
    },
    {
      title: 'Precision Cutting',
      desc: 'Automated cutting systems produce clean, square pipe ends at specified lengths for standard or custom order fulfillment.',
      bullets: ['Automated length control', 'Clean square-end finish']
    },
    {
      title: 'Protective Packaging',
      desc: 'Finished pipes are carefully bundled, strapped, and packaged to protect against damage during transportation and storage.',
      bullets: ['UV-protective wrapping', 'Custom packaging available on request']
    }
  ];

  const titleEl = document.getElementById('processTitle');
  const descEl = document.getElementById('processDesc');
  const bulletsEl = document.getElementById('processBullets');
  const tabs = document.querySelectorAll('.process-tab');

  if (!titleEl || !tabs.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Deactivate all
      tabs.forEach(function (t) { t.classList.remove('active'); });
      // Activate clicked
      tab.classList.add('active');

      const stepData = steps[parseInt(tab.dataset.step, 10)];
      if (!stepData) return;

      // Fade-update content
      titleEl.style.opacity = '0';
      descEl.style.opacity = '0';

      setTimeout(function () {
        titleEl.textContent = stepData.title;
        descEl.textContent = stepData.desc;

        if (bulletsEl) {
          bulletsEl.innerHTML = '';
          stepData.bullets.forEach(function (b) {
            const li = document.createElement('li');
            li.textContent = b;
            bulletsEl.appendChild(li);
          });
        }

        titleEl.style.opacity = '1';
        descEl.style.opacity = '1';
      }, 150);
    });
  });

  // Smooth fade transition via inline style
  if (titleEl) titleEl.style.transition = 'opacity 0.15s ease';
  if (descEl) descEl.style.transition = 'opacity 0.15s ease';
})();


/* ============================================================
   4. FAQ ACCORDION
   ============================================================ */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(function (el) {
        el.classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
      }
    });

    // Keyboard support
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Open first item by default
  const firstItem = document.querySelector('.faq-item');
  if (firstItem) firstItem.classList.add('open');
})();


/* ============================================================
   5. MOBILE NAVIGATION
   ============================================================ */
(function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a, button').forEach(function (el) {
    el.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   6. INDUSTRIES CAROUSEL (prev/next buttons)
   ============================================================ */
(function initIndustriesCarousel() {
  // Simple scroll-based carousel for the industries section
  const carousel = document.querySelector('.industries-carousel');
  if (!carousel) return;

  const prevBtn = document.querySelector('.nav-btn.prev-btn');
  const nextBtn = document.querySelector('.nav-btn.next-btn');

  if (!prevBtn || !nextBtn) return;

  const cardWidth = carousel.querySelector('.industry-card');
  if (!cardWidth) return;

  nextBtn.addEventListener('click', function () {
    carousel.scrollBy({ left: 300, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', function () {
    carousel.scrollBy({ left: -300, behavior: 'smooth' });
  });
})();


/* ============================================================
   7. SCROLL REVEAL ANIMATIONS
   ============================================================
   Fade-in sections as they enter the viewport
   ============================================================ */
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const revealTargets = document.querySelectorAll(
    '.feature-card, .testimonial-card, .portfolio-card, .spec-row, .industry-card'
  );

  revealTargets.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease ' + (i % 4) * 0.08 + 's, transform 0.5s ease ' + (i % 4) * 0.08 + 's';
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(function (el) { observer.observe(el); });
})();
