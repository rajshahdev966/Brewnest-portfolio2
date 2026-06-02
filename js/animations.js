/**
 * js/animations.js
 * Controls high-fidelity micro-interactions:
 * - Scroll reveals using Intersection Observer.
 * - Magnetic hover effects on action buttons and social links.
 * - Parallax translation effects on hero background layers.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements Caching
  const heroBg = document.querySelector('.hero-video-container');
  const coffeeHeroBg = document.querySelector('.coffee-hero-bg');
  const coffeeHeroVideo = document.querySelector('.coffee-hero-video-container');
  const revealElements = document.querySelectorAll('.fade-reveal');
  const magneticElements = document.querySelectorAll('.btn, .social-icon, .carousel-nav-btn');
  const track = document.getElementById('testimonials-carousel-track');

  // Constants
  const PARALLAX_SPEED = 0.35;
  const MAGNETIC_STRENGTH = 0.2;
  const REVEAL_THRESHOLD = 0.02;
  const REVEAL_ROOT_MARGIN = "0px 0px -50px 0px";
  const MOOD_UPDATE_INTERVAL_MS = 60000;

  // 1. Scroll Parallax on Hero backgrounds
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Landing page hero background video parallax
    if (heroBg) {
      heroBg.style.transform = `translate3d(0, ${scrolled * PARALLAX_SPEED}px, 0)`;
    }

    // Coffee page hero background
    if (coffeeHeroBg) {
      coffeeHeroBg.style.transform = `translate3d(0, ${scrolled * PARALLAX_SPEED}px, 0)`;
    }

    if (coffeeHeroVideo) {
      coffeeHeroVideo.style.transform = `translate3d(0, ${scrolled * PARALLAX_SPEED}px, 0)`;
    }
  }, { passive: true });

  // 2. Intersection Observer for Scroll Reveals
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Once revealed, we don't need to observe it anymore
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: REVEAL_THRESHOLD, 
        rootMargin: REVEAL_ROOT_MARGIN
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('active'));
    }
  }

  // 3. Magnetic Hover Animation on Buttons and Social Icons
  if (magneticElements.length > 0) {
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        // Calculate mouse offset from center of the button
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Pull button slightly towards the mouse (magnetic effect)
        el.style.transform = `translate3d(${x * MAGNETIC_STRENGTH}px, ${y * MAGNETIC_STRENGTH}px, 0) scale(1.03)`;
        
        // Add dynamic hover shadows
        if (el.classList.contains('btn-primary')) {
          el.style.boxShadow = `0px 14px 32px rgba(245, 235, 221, 0.25)`;
        } else if (el.classList.contains('btn-tertiary')) {
          el.style.boxShadow = `0px 12px 28px rgba(200, 155, 99, 0.3)`;
        }
      });

      el.addEventListener('mouseleave', () => {
        // Restore initial state on mouse leave
        el.style.transform = '';
        el.style.boxShadow = '';
      });
    });
  }

  // 4. Testimonials carousel dragging gesture simulation or swipe logic for touch interfaces
  if (track) {
    let isDown = false;
    let startX;
    let scrollLeft;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.animationPlayState = 'paused';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.style.transform;
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.style.animationPlayState = 'running';
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.style.animationPlayState = 'running';
    });
  }

  // 5. Automated Live Café Mood Status
  let prevMoodLabel = "";
  let prevWorkspaceMoodLabel = "";

  /**
   * Helper function to extract and convert border color based on mood.
   * @param {string} color - The base color string (rgba or hex).
   * @returns {string} The transformed rgba color for borders.
   */
  function getBorderColor(color) {
    if (color.startsWith('rgba')) {
      return color.replace(/[^,]+(?=\))/, '0.25');
    }
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.25)`;
  }

  /**
   * Calculates the current cafe mood based on time of day and day of week.
   * @returns {Object} An object containing the label, color, and pulseSpeed for the mood.
   */
  function getCafeMood() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    let mood = {
      label: "",
      color: "",
      pulseSpeed: ""
    };

    if (isWeekend) {
      if (hours >= 9 && hours < 12) {
        mood.label = "Weekend Morning Vibes";
        mood.color = "#C8A96E";
        mood.pulseSpeed = "slow";
      } else if (hours >= 12 && hours < 17) {
        mood.label = "Buzzing Weekend Energy";
        mood.color = "#E07B4A";
        mood.pulseSpeed = "fast";
      } else if (hours >= 17 && hours < 22) {
        mood.label = "Weekend Wind Down";
        mood.color = "#7EA87E";
        mood.pulseSpeed = "slow";
      } else {
        mood.label = "We're Closed — See You Tomorrow";
        mood.color = "rgba(245,239,228,0.35)";
        mood.pulseSpeed = "none";
      }
    } else {
      if (hours >= 6 && hours < 9) {
        mood.label = "Early Bird Hours";
        mood.color = "#C8A96E";
        mood.pulseSpeed = "slow";
      } else if (hours >= 9 && hours < 12) {
        mood.label = "Morning Brew Hours";
        mood.color = "#C8A96E";
        mood.pulseSpeed = "slow";
      } else if (hours >= 12 && hours < 14) {
        mood.label = "Lunch Rush — Limited Seating";
        mood.color = "#E07B4A";
        mood.pulseSpeed = "fast";
      } else if (hours >= 14 && hours < 17) {
        mood.label = "Quiet Work Hours";
        mood.color = "#7EA87E";
        mood.pulseSpeed = "slow";
      } else if (hours >= 17 && hours < 19) {
        mood.label = "Golden Hour — Winding Down";
        mood.color = "#C8A96E";
        mood.pulseSpeed = "slow";
      } else if (hours >= 19 && hours < 22) {
        mood.label = "Evening Social Hours";
        mood.color = "#A07EC8";
        mood.pulseSpeed = "medium";
      } else {
        mood.label = "We're Closed — See You Tomorrow";
        mood.color = "rgba(245,239,228,0.35)";
        mood.pulseSpeed = "none";
      }
    }

    return mood;
  }

  /**
   * Updates the UI with the latest cafe mood if it has changed.
   */
  function updateCafeMood() {
    if (window.BREWNEST_SHEETS_LOADED) return;
    const moodTextHighlight = document.getElementById('live-cafe-mood');
    const moodIndicator = document.querySelector('.mood-indicator');
    const moodDot = document.querySelector('.mood-indicator .mood-dot');
    
    if (!moodTextHighlight || !moodIndicator || !moodDot) return;
    
    const mood = getCafeMood();
    
    if (mood.label === prevMoodLabel) {
      return;
    }
    
    if (prevMoodLabel === "") {
      console.log('BrewNest Mood:', mood.label);
    }
    
    moodTextHighlight.style.transition = 'opacity 200ms ease';
    moodTextHighlight.style.opacity = '0';
    
    setTimeout(() => {
      moodTextHighlight.textContent = mood.label;
      moodTextHighlight.style.color = mood.color;
      moodTextHighlight.style.transition = 'opacity 400ms ease, color 600ms ease';
      moodTextHighlight.style.opacity = '1';
    }, 200);
    
    moodDot.style.background = mood.color;
    moodDot.classList.remove('pulse-slow', 'pulse-medium', 'pulse-fast');
    if (mood.pulseSpeed !== 'none') {
      moodDot.classList.add(`pulse-${mood.pulseSpeed}`);
    }
    
    moodIndicator.style.borderColor = getBorderColor(mood.color);
    prevMoodLabel = mood.label;
  }

  /**
   * Updates the live board on the workspace page if it has changed.
   */
  function updateWorkspaceLiveBoard() {
    if (window.BREWNEST_SHEETS_LOADED) return;
    const statusText = document.getElementById('lub-status-text');
    const statusDesc = document.getElementById('lub-status-desc');
    const capacityVal = document.getElementById('lub-capacity');
    const lightVal = document.getElementById('lub-light');
    const liveBoard = document.getElementById('live-board');
    const moodDot = document.querySelector('#live-board .mood-dot');

    if (!statusText || !liveBoard || !moodDot) return;

    const mood = getCafeMood();

    if (mood.label === prevWorkspaceMoodLabel) {
      return;
    }

    statusText.style.transition = 'opacity 200ms ease';
    statusText.style.opacity = '0';
    if (statusDesc) {
      statusDesc.style.transition = 'opacity 200ms ease';
      statusDesc.style.opacity = '0';
    }
    if (capacityVal) {
      capacityVal.style.transition = 'opacity 200ms ease';
      capacityVal.style.opacity = '0';
    }
    if (lightVal) {
      lightVal.style.transition = 'opacity 200ms ease';
      lightVal.style.opacity = '0';
    }

    setTimeout(() => {
      let suffix = " Active";
      if (mood.label.includes("Closed")) {
        suffix = "";
      }
      statusText.textContent = mood.label + suffix;
      statusText.style.color = mood.color;

      if (capacityVal && lightVal) {
        if (mood.label.includes("Closed")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 12dB • Cafe is Closed";
          capacityVal.textContent = "0%";
          lightVal.textContent = "Off";
        } else if (mood.label.includes("Early Bird")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 28dB • Serene Morning Vibe";
          capacityVal.textContent = "15%";
          lightVal.textContent = "Sunrise";
        } else if (mood.label.includes("Morning Brew")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 36dB • Fresh Coffee Aroma";
          capacityVal.textContent = "48%";
          lightVal.textContent = "Natural";
        } else if (mood.label.includes("Lunch Rush")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 52dB • Lively Social Energy";
          capacityVal.textContent = "94%";
          lightVal.textContent = "Full Day";
        } else if (mood.label.includes("Quiet Work")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 32dB • Library Atmosphere";
          capacityVal.textContent = "72%";
          lightVal.textContent = "Balanced";
        } else if (mood.label.includes("Golden Hour") || mood.label.includes("Weekend Wind Down")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 38dB • Cozy Twilight Vibe";
          capacityVal.textContent = "58%";
          lightVal.textContent = "Warm Amber";
        } else if (mood.label.includes("Social Hours") || mood.label.includes("Weekend Morning")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 45dB • Acoustic Background";
          capacityVal.textContent = "85%";
          lightVal.textContent = "Ambient";
        } else if (mood.label.includes("Weekend Energy")) {
          if (statusDesc) statusDesc.textContent = "Ambient Noise: 50dB • Buzzing Vibe";
          capacityVal.textContent = "90%";
          lightVal.textContent = "Bright";
        }
      }

      statusText.style.transition = 'opacity 400ms ease, color 600ms ease';
      statusText.style.opacity = '1';
      if (statusDesc) {
        statusDesc.style.transition = 'opacity 400ms ease';
        statusDesc.style.opacity = '1';
      }
      if (capacityVal) {
        capacityVal.style.transition = 'opacity 400ms ease';
        capacityVal.style.opacity = '1';
      }
      if (lightVal) {
        lightVal.style.transition = 'opacity 400ms ease';
        lightVal.style.opacity = '1';
      }
    }, 200);

    moodDot.style.background = mood.color;
    moodDot.style.transition = 'background 600ms ease';
    moodDot.classList.remove('pulse-slow', 'pulse-medium', 'pulse-fast');
    if (mood.pulseSpeed !== 'none') {
      moodDot.classList.add(`pulse-${mood.pulseSpeed}`);
    }

    liveBoard.style.borderColor = getBorderColor(mood.color);
    prevWorkspaceMoodLabel = mood.label;
  }

  // Initial load
  updateCafeMood();
  updateWorkspaceLiveBoard();

  // Polling interval
  const moodInterval = setInterval(() => {
    const hasPill = document.querySelector('.mood-indicator');
    const hasBoard = document.getElementById('live-board');
    if (!hasPill && !hasBoard) {
      clearInterval(moodInterval);
      return;
    }
    updateCafeMood();
    updateWorkspaceLiveBoard();
  }, MOOD_UPDATE_INTERVAL_MS);
});
