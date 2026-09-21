// ---------- Nav scroll state ----------
    const navEl = document.getElementById('nav');
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    const closeMobileNav = () => {
      primaryNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    primaryNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMobileNav();
        navToggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMobileNav();
    });
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) { navEl.classList.add('scrolled'); } else { navEl.classList.remove('scrolled'); }
    }, { passive: true });

    // ---------- Reveal on scroll ----------
    const revealEls = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); }
      });
    }, { threshold: .15 });
    revealEls.forEach(el => io.observe(el));

    // ---------- Hero pinned mask reveal + parallax ----------
    const heroSpacer = document.getElementById('hero-spacer');
    const heroPhoto = document.getElementById('hero-photo');
    const heroPhotoFull = document.getElementById('hero-photo-full');
    const heroContent = document.querySelector('.hero-content');
    function updateHero() {
      const rect = heroSpacer.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      let progress = (-rect.top) / total;
      progress = Math.max(0, Math.min(1, progress));
      const maskPct = 130 + progress * 480; // the brand pattern scales up as you scroll
      heroPhoto.style.webkitMaskSize = maskPct + '% ' + maskPct + '%';
      heroPhoto.style.maskSize = maskPct + '% ' + maskPct + '%';
      const revealProgress = Math.max(0, (progress - 0.5) / 0.5);
      heroPhotoFull.style.opacity = revealProgress;
      heroContent.style.transform = 'translateY(' + (progress * 80) + 'px)';
      heroContent.style.opacity = 1 - progress * 0.9;
    }
    window.addEventListener('scroll', () => window.requestAnimationFrame(updateHero), { passive: true });
    updateHero();

    // ---------- Pinned horizontal card stories ----------
    function setupPinnedHorizontal(section, track) {
      if (!section || !track) return;
      let maxShift = 0;
      let raf = 0;

      const update = () => {
        raf = 0;
        const travel = Math.max(1, section.offsetHeight - window.innerHeight);
        const rect = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / travel));
        track.style.transform = 'translate3d(' + (-maxShift * progress).toFixed(2) + 'px,0,0)';
      };

      const requestUpdate = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };

      const refresh = () => {
        maxShift = Math.max(0, track.scrollWidth - window.innerWidth);
        /* A slightly longer scroll runway makes every card readable before release. */
        const pinDistance = Math.max(
          window.innerHeight * 1.15,
          maxShift * 1.55 + window.innerHeight * .42
        );
        section.style.setProperty('--pin-distance', pinDistance.toFixed(0) + 'px');
        requestUpdate();
      };

      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', refresh, { passive: true });
      window.addEventListener('load', refresh, { once: true });
      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(refresh);
        ro.observe(track);
      }
      refresh();
    }

    setupPinnedHorizontal(document.getElementById('motion'), document.getElementById('gtrack'));
    setupPinnedHorizontal(document.getElementById('arsenal'), document.querySelector('#arsenal .arsenal-track'));

    // ---------- Vision photo parallax ----------
    const visionImg = document.getElementById('vision-parallax-img');
    function updateVision() {
      if (!visionImg) return;
      const rect = visionImg.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2 - vh / 2;
      const offset = center * -0.08;
      visionImg.querySelector('img').style.transform = 'translateY(' + offset + 'px) scale(1.12)';
    }
    window.addEventListener('scroll', () => window.requestAnimationFrame(updateVision), { passive: true });
    updateVision();

    // ---------- 3D tilt on hover (values cards) ----------
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-y * 10) + 'deg) rotateY(' + (x * 10) + 'deg) translateY(-4px) scale(1.015)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
      });
    });

    // ---------- Manifesto word reveal ----------
    const manifestoP = document.getElementById('manifesto-heading');
    const emphasize = ['exercise.', 'living', 'limits.'];
    manifestoP.innerHTML = manifestoP.dataset.full.split(' ').map(w => {
      const cls = emphasize.includes(w) ? 'word lime' : 'word';
      return '<span class="' + cls + '">' + w + '</span>';
    }).join(' ');
    const manifestoWords = document.querySelectorAll('#manifesto-heading .word');
    const manifestoSection = document.getElementById('manifesto');
    function updateManifesto() {
      const rect = manifestoSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const revealDistance = window.matchMedia('(max-width: 900px)').matches
        ? vh
        : vh + rect.height * 0.6;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / revealDistance));
      manifestoWords.forEach((w, i) => {
        const thresh = i / manifestoWords.length;
        w.style.opacity = progress > thresh ? (w.classList.contains('lime') ? 1 : 0.85) : 0.16;
      });
      const bg = document.getElementById('manifesto-bg');
      if (bg) bg.style.transform = 'translateY(' + (progress * -60) + 'px)';
    }
    window.addEventListener('scroll', () => window.requestAnimationFrame(updateManifesto), { passive: true });
    updateManifesto();


    // ---------- Mouse parallax for the green graph backgrounds ----------
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.interactive-graph-section').forEach(section => {
        const svg = section.querySelector('.section-graph');
        const lines = svg && svg.querySelector('.graph-lines');
        const dots = svg && svg.querySelector('.graph-dots');
        if (!svg) return;
        let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
        const animateGraph = () => {
          cx += (tx - cx) * 0.09;
          cy += (ty - cy) * 0.09;
          svg.style.transform = 'translate3d(calc(-50% + ' + cx + 'px),calc(-50% + ' + cy + 'px),0) scale(1.015)';
          if (lines) lines.style.transform = 'translate3d(' + (-cx * .12) + 'px,' + (-cy * .12) + 'px,0)';
          if (dots) dots.style.transform = 'translate3d(' + (cx * .28) + 'px,' + (cy * .28) + 'px,0)';
          if (Math.abs(tx - cx) > .05 || Math.abs(ty - cy) > .05) { raf = requestAnimationFrame(animateGraph); }
          else { raf = 0; }
        };
        section.addEventListener('mousemove', e => {
          const r = section.getBoundingClientRect();
          tx = ((e.clientX - r.left) / r.width - .5) * 28;
          ty = ((e.clientY - r.top) / r.height - .5) * 20;
          if (!raf) raf = requestAnimationFrame(animateGraph);
        });
        section.addEventListener('mouseleave', () => {
          tx = 0; ty = 0;
          if (!raf) raf = requestAnimationFrame(animateGraph);
        });
      });
    }

    // ---------- Staggered principle cards: individual scroll-parallax motion ----------
    const principleCards = [...document.querySelectorAll('.principle-parallax')];
    const principlesSection = document.getElementById('values');
    let principlesRaf = 0;
    function updateValues() {
      principlesRaf = 0;
      if (!principlesSection || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = principlesSection.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (vh + rect.height);
      const progress = Math.max(0, Math.min(1, raw));
      const centered = (progress - .5) * 2;
      principleCards.forEach((card, index) => {
        const speed = parseFloat(card.dataset.speed || '0.8');
        const drift = parseFloat(card.dataset.drift || '0');
        const rotate = parseFloat(card.dataset.rotate || '0');
        const y = centered * speed * 82;
        const x = centered * drift;
        const r = centered * rotate;
        card.style.setProperty('--principle-y', y.toFixed(2) + 'px');
        card.style.setProperty('--principle-x', x.toFixed(2) + 'px');
        card.style.setProperty('--principle-r', r.toFixed(3) + 'deg');
      });
    }
    function requestValues() {
      if (!principlesRaf) principlesRaf = requestAnimationFrame(updateValues);
    }
    window.addEventListener('scroll', requestValues, { passive: true });
    window.addEventListener('resize', requestValues, { passive: true });
    updateValues();

    // ---------- Final statement word-by-word scroll illumination ----------
    const uvpHighlight = document.getElementById('uvp-highlight');
    if (uvpHighlight) {
      const finalEmphasis = ['moving.'];
      uvpHighlight.innerHTML = uvpHighlight.dataset.full.split(' ').map(word => {
        const cls = finalEmphasis.includes(word) ? 'word moving-white' : 'word';
        return '<span class="' + cls + '">' + word + '</span>';
      }).join(' ');
      const uvpWords = [...uvpHighlight.querySelectorAll('.word')];
      const uvpSection = document.getElementById('uvp');
      const updateUvpHighlight = () => {
        const r = uvpSection.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height * .42)));
        uvpWords.forEach((word, i) => {
          const threshold = i / uvpWords.length;
          word.classList.toggle('active', progress > threshold);
        });
      };
      window.addEventListener('scroll', () => requestAnimationFrame(updateUvpHighlight), { passive: true });
      updateUvpHighlight();
    }
