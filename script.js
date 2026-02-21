// =============================================
// Climate Positive Roadmap - Interactive Scripts
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar ---
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
  document.body.prepend(progressBar);
  const progressFill = progressBar.querySelector('.scroll-progress-fill');

  // --- Back-to-Top Button ---
  const topBtn = document.createElement('button');
  topBtn.className = 'back-to-top';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(topBtn);
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Theme Toggle (Dark/Light Mode) ---
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle light/dark mode');
  themeToggle.innerHTML = `
    <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
    <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
  `;
  document.body.appendChild(themeToggle);

  const savedTheme = localStorage.getItem('cp-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('cp-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });

  // --- Navbar scroll effect ---
  const nav = document.getElementById('nav');
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Nav scroll effect
    if (scrollTop > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Progress bar
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = progress + '%';

    // Back-to-top visibility
    if (scrollTop > 600) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }

    // Parallax for hero backgrounds
    const heroes = document.querySelectorAll('.hero-bg, .page-hero-bg');
    heroes.forEach(hero => {
      const rect = hero.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const parallaxOffset = scrollTop * 0.3;
        hero.style.transform = `translateY(${parallaxOffset}px)`;
      }
    });
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- Active page highlight in nav ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Mobile menu toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // --- Tabs (if present on page) ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // --- Animated Counters ---
  const animateCounter = (el) => {
    const text = el.textContent.trim();
    // Match patterns like "22 Mt", "14 Mt", "3:1", "84x", "10-30%", "2030", "$1.7B", "0.6%", "~25%", etc.
    const match = text.match(/^([~$]?)([0-9,.]+)(\s*[-–]\s*([0-9,.]+))?(.*)/);
    if (!match) return;

    const prefix = match[1];
    const startNum = 0;
    const endNum = parseFloat(match[2].replace(/,/g, ''));
    const hasRange = match[3];
    const rangeEnd = match[4] ? parseFloat(match[4].replace(/,/g, '')) : null;
    const suffix = match[5];

    if (isNaN(endNum)) return;

    // Skip very large numbers like years (2030, 2040, 2050) - keep those static
    if (endNum >= 1900 && endNum <= 2100 && !suffix) return;

    const duration = 1800;
    const startTime = performance.now();
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = startNum + (endNum - startNum) * eased;
      let display = decimals > 0 ? current.toFixed(decimals) : Math.round(current);

      if (hasRange && rangeEnd !== null) {
        const currentEnd = startNum + (rangeEnd - startNum) * eased;
        const displayEnd = decimals > 0 ? currentEnd.toFixed(decimals) : Math.round(currentEnd);
        el.textContent = prefix + display + match[3].replace(match[4], displayEnd) + suffix;
      } else {
        el.textContent = prefix + display + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Restore original text exactly
        el.textContent = text;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-box-number, .hero-stat-number').forEach(el => {
    counterObserver.observe(el);
  });

  // --- Accordion for Myth Cards ---
  const mythSections = document.querySelectorAll('#myths');
  mythSections.forEach(section => {
    const cards = section.querySelectorAll('.card-glass');
    cards.forEach(card => {
      const h3 = card.querySelector('h3');
      const p = card.querySelector('p');
      if (!h3 || !p) return;

      card.classList.add('accordion');
      // Wrap content for animation
      const content = document.createElement('div');
      content.className = 'accordion-content';
      content.appendChild(p);
      card.appendChild(content);

      // Add toggle indicator
      const toggle = document.createElement('span');
      toggle.className = 'accordion-toggle';
      toggle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
      h3.appendChild(toggle);

      h3.style.cursor = 'pointer';
      h3.addEventListener('click', () => {
        const isOpen = card.classList.contains('accordion-open');
        // Close all others in this section
        section.querySelectorAll('.accordion-open').forEach(c => c.classList.remove('accordion-open'));
        if (!isOpen) {
          card.classList.add('accordion-open');
        }
      });
    });
  });

  // --- Interactive Emissions Chart ---
  const emissionBars = document.querySelectorAll('.emission-bar');
  emissionBars.forEach(bar => {
    const fill = bar.querySelector('.emission-bar-fill');
    if (!fill) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    const label = bar.getAttribute('data-label') || '';
    const value = bar.getAttribute('data-value') || '';
    tooltip.textContent = `${label}: ${value}`;
    fill.appendChild(tooltip);

    fill.addEventListener('mouseenter', () => {
      fill.classList.add('bar-hover');
      tooltip.classList.add('visible');
    });
    fill.addEventListener('mouseleave', () => {
      fill.classList.remove('bar-hover');
      tooltip.classList.remove('visible');
    });
  });

  // --- Tooltip Definitions ---
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.classList.add('has-tooltip');
    const tip = document.createElement('span');
    tip.className = 'tooltip-popup';
    tip.textContent = el.getAttribute('data-tooltip');
    el.appendChild(tip);
  });

  // --- Scroll-triggered fade-in animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateElements = document.querySelectorAll(
    '.card, .card-glass, .info-card, .action-card, .five-action-card, ' +
    '.principle-card, .benefit-category, .definition-card, .document-card, ' +
    '.stakeholder-card, .state-card, .timeline-item, .callout, ' +
    '.precinct-type-card, .cta-action-item, .pathway-step, ' +
    '.topic-card, .stat-box, .case-study-card, .tech-card, .process-step, ' +
    '.criteria-item, .document-card-sm, .info-box'
  );

  animateElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(index % 6) * 0.08}s`;
    observer.observe(el);
  });

  // --- Staggered reveal for stat rows ---
  const statRows = document.querySelectorAll('.stat-row');
  const statRowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const boxes = entry.target.querySelectorAll('.stat-box');
        boxes.forEach((box, i) => {
          setTimeout(() => {
            box.classList.add('stat-pop');
          }, i * 150);
        });
        statRowObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  statRows.forEach(row => statRowObserver.observe(row));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Active nav link highlight for anchor sections (landing page) ---
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (navAnchors.length > 0) {
    const highlightNav = () => {
      const scrollPos = window.scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navAnchors.forEach(a => {
            a.style.opacity = '0.6';
            if (a.getAttribute('href') === `#${id}`) {
              a.style.opacity = '1';
            }
          });
        }
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
  }
});
