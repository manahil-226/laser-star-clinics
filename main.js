// ==========================================================================
// LASER STAR CLINICS — INTERACTIVE ANIMATION & FUN WIDGET ENGINE
// Features: 3D Card Tilt, Rolling Number Counters, Canvas Confetti,
//           Skin Treatment Matcher Quiz, Before/After Slider & WhatsApp Sync
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. HIGHLIGHT ACTIVE NAV LINK
  // ------------------------------------------------------------------------
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ------------------------------------------------------------------------
  // 2. MOBILE MENU TOGGLE
  // ------------------------------------------------------------------------
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-links');

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. NAVBAR ELEVATION ON SCROLL
  // ------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ------------------------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // ------------------------------------------------------------------------
  // 5. ANIMATED NUMBER COUNTERS (ROLLING UP)
  // ------------------------------------------------------------------------
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (counterElements.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter-target'));
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
          const duration = 1800; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = (target * easeProgress).toFixed(decimals);

            el.textContent = currentVal + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = target.toFixed(decimals) + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ------------------------------------------------------------------------
  // 6. 3D CARD TILT EFFECT ON MOUSEMOVE
  // ------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ------------------------------------------------------------------------
  // 7. INTERACTIVE BEFORE & AFTER SLIDER (WITH LIVE PERCENTAGE BADGE)
  // ------------------------------------------------------------------------
  const comparisonWrapper = document.querySelector('.ba-comparison-wrapper');
  const afterLayer = document.querySelector('.ba-layer-after');
  const handle = document.querySelector('.ba-handle');
  const percentageBadge = document.querySelector('.ba-live-percentage');

  if (comparisonWrapper && afterLayer && handle) {
    let isDragging = false;

    const setPosition = (clientX) => {
      const rect = comparisonWrapper.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      afterLayer.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;

      if (percentageBadge) {
        percentageBadge.textContent = `${Math.round(percentage)}% Results`;
      }
    };

    comparisonWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    comparisonWrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // ------------------------------------------------------------------------
  // 8. FUN INTERACTIVE "FIND MY SKIN TREATMENT" QUIZ
  // ------------------------------------------------------------------------
  const quizForm = document.getElementById('skinTreatmentQuiz');
  const quizResultBox = document.getElementById('quizResultBox');

  if (quizForm && quizResultBox) {
    const quizData = {
      'hair-face': {
        title: 'Facial Triple-Wave Diode Laser',
        desc: 'Permanent, pain-free hair reduction for upper lip, chin, and sideburns with sapphire skin cooling.',
        sessions: '6 – 8 Sessions',
        time: '20 Mins',
        tag: 'Laser Hair Removal'
      },
      'hair-body': {
        title: 'Full Body Smooth Diode Laser',
        desc: 'Full body silky smooth treatment targeting arms, legs, back, and underarms with zero burns.',
        sessions: '6 – 8 Sessions',
        time: '45 – 60 Mins',
        tag: 'Full Body Protocol'
      },
      'scars-face': {
        title: 'Fractional CO2 Laser Resurfacing',
        desc: 'Ablative microscopic laser columns to smooth acne scars, tighten enlarged pores, and generate fresh collagen.',
        sessions: '3 – 5 Sessions',
        time: '45 Mins',
        tag: 'Scar Revision'
      },
      'glow-face': {
        title: 'Hollywood Carbon Laser + HydraFacial MD',
        desc: 'Vortex deep extraction followed by Q-Switched carbon peel for red-carpet radiance and zero downtime.',
        sessions: 'Monthly Refresh',
        time: '50 Mins',
        tag: 'Instant Red Carpet Glow'
      },
      'pigment-face': {
        title: 'Melasma & Spot Target Laser',
        desc: 'Photoacoustic Q-Switched fragmentation to clear dark sun spots, hormonal melasma, and uneven tone.',
        sessions: '4 – 6 Sessions',
        time: '30 Mins',
        tag: 'Pigmentation Clear'
      },
      'aging-face': {
        title: 'Bioremodeling & Platelet-Rich Plasma (PRP)',
        desc: 'Doctor-administered dermal volumizing and vampire therapy to naturally lift contours and smooth fine lines.',
        sessions: '1 – 2 Sessions',
        time: '40 Mins',
        tag: 'Anti-Aging Restoration'
      }
    };

    quizForm.addEventListener('change', () => {
      const concern = quizForm.elements['quizConcern'] ? quizForm.elements['quizConcern'].value : '';
      const area = quizForm.elements['quizArea'] ? quizForm.elements['quizArea'].value : '';

      if (concern && area) {
        let key = `${concern}-${area}`;
        if (!quizData[key]) {
          key = `${concern}-face`;
        }
        const result = quizData[key] || quizData['hair-face'];

        document.getElementById('quizTreatmentTitle').textContent = result.title;
        document.getElementById('quizTreatmentDesc').textContent = result.desc;
        document.getElementById('quizSessions').textContent = result.sessions;
        document.getElementById('quizTime').textContent = result.time;
        document.getElementById('quizTag').textContent = result.tag;

        const whatsappBtn = document.getElementById('quizWhatsAppBtn');
        if (whatsappBtn) {
          const text = `Hi Laser Star Clinics! I used your online Skin Quiz and was recommended: *${encodeURIComponent(result.title)}*. I would like to book an in-clinic consultation in Defence Phase 5, Karachi.`;
          whatsappBtn.href = `https://wa.me/923085222700?text=${text}`;
        }

        quizResultBox.classList.add('show');
        launchConfetti();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 9. DELIGHTFUL CANVAS CONFETTI BURST
  // ------------------------------------------------------------------------
  function launchConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#B85C42', '#C4A65C', '#2E2A26', '#EADBC8', '#25D366'];
    const particles = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // gravity
        p.rotation += p.spin;
        p.alpha -= 0.015;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive) {
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    }
    render();
  }

  // ------------------------------------------------------------------------
  // 10. TREATMENT CALCULATOR (HOMEPAGE)
  // ------------------------------------------------------------------------
  const treatmentData = {
    'laser-hair': {
      title: 'Triple-Wave Laser Hair Removal',
      description: 'Medical-grade 755nm, 808nm & 1064nm diode laser for pain-free, permanent reduction on all skin types.',
      duration: '30 – 45 Minutes',
      sessions: '6 – 8 Sessions Recommended',
      downtime: 'Zero Downtime',
      technology: 'Cooling Diode & Nd:YAG'
    },
    'fractional-co2': {
      title: 'Fractional CO2 Laser Resurfacing',
      description: 'Deep dermal ablation for severe acne scars, deep pores, and profound skin tightening and regeneration.',
      duration: '45 – 60 Minutes',
      sessions: '3 – 5 Sessions',
      downtime: '3 – 5 Days Mild Peeling',
      technology: 'Ablative Micro-Fractional CO2'
    },
    'carbon-peel': {
      title: 'Hollywood Carbon Laser Peel',
      description: 'Liquid carbon laser exfoliation for immediate pore tightening, blackhead elimination, and glowing clarity.',
      duration: '40 Minutes',
      sessions: 'Monthly Refresh or Event Prep',
      downtime: 'None (Instant Glow)',
      technology: 'Q-Switched Nd:YAG Laser'
    },
    'pigmentation': {
      title: 'Melasma & Spot Target Removal',
      description: 'Precision pigment fragmentation breaking melanin clusters without damaging adjacent healthy tissue.',
      duration: '30 Minutes',
      sessions: '4 – 6 Sessions',
      downtime: '24 Hours Mild Redness',
      technology: 'Q-Switched 1064nm / 532nm'
    },
    'hydrafacial': {
      title: 'Medical HydraFacial & Infusion',
      description: 'Vortex suction extraction, salicylic peel, hyaluronic acid and peptide antioxidant infusion.',
      duration: '50 Minutes',
      sessions: 'Monthly Maintenance',
      downtime: 'None',
      technology: 'Vortex Cleansing & Serum Infusion'
    },
    'anti-aging': {
      title: 'Aesthetic Fillers & Rejuvenation',
      description: 'Doctor-administered dermal contouring, botox relaxation, and skin booster bioremodeling.',
      duration: '30 – 45 Minutes',
      sessions: '1 – 2 Sessions (6-12 mo longevity)',
      downtime: 'Minimal (under 24 hours)',
      technology: 'US FDA-Approved Biologics'
    }
  };

  const selectPills = document.querySelectorAll('.select-pill');
  const resultTitle = document.getElementById('calcResultTitle');
  const resultDesc = document.getElementById('calcResultDesc');
  const metaDuration = document.getElementById('calcDuration');
  const metaSessions = document.getElementById('calcSessions');
  const metaDowntime = document.getElementById('calcDowntime');
  const metaTech = document.getElementById('calcTech');

  if (selectPills.length > 0 && resultTitle) {
    selectPills.forEach(pill => {
      pill.addEventListener('click', () => {
        selectPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const key = pill.getAttribute('data-service');
        const data = treatmentData[key];
        if (data) {
          resultTitle.textContent = data.title;
          resultDesc.textContent = data.description;
          metaDuration.textContent = data.duration;
          metaSessions.textContent = data.sessions;
          metaDowntime.textContent = data.downtime;
          metaTech.textContent = data.technology;
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 11. FAQ ACCORDION
  // ------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(other => {
          other.classList.remove('active');
          const otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // ------------------------------------------------------------------------
  // 12. APPOINTMENT FORM WITH CONFETTI CELEBRATION
  // ------------------------------------------------------------------------
  const appointmentForm = document.getElementById('appointmentBookingForm');
  const toastNotice = document.getElementById('toastNotice');

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.querySelector('.toast-text').textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4500);
  }

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName').value;
      const phone = document.getElementById('formPhone').value;
      const service = document.getElementById('formService').value;
      const date = document.getElementById('formDate').value;
      const notes = document.getElementById('formNotes').value;

      launchConfetti();
      showToast('Appointment requested! Redirecting to WhatsApp to confirm...');

      const text = `Hello Laser Star Clinics (Defence Phase 5, Karachi)! I would like to schedule an in-clinic consultation:%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(service)}%0A*Preferred Date:* ${encodeURIComponent(date || 'Earliest Available')}%0A*Notes:* ${encodeURIComponent(notes || 'None')}%0A%0APlease confirm my appointment. Thank you!`;

      setTimeout(() => {
        window.open(`https://wa.me/923085222700?text=${text}`, '_blank');
      }, 1200);

      appointmentForm.reset();
    });
  }
});
