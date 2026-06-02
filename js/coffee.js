/**
 * js/coffee.js
 * Controls the product carousel sliding, scroll indicators, and coffee subscription waitlist validation.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Indicator
  const scrollIndicator = document.getElementById('scroll-to-products');
  const targetProductsSection = document.getElementById('roasted-beans');
  
  if (scrollIndicator && targetProductsSection) {
    scrollIndicator.addEventListener('click', () => {
      targetProductsSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 2. Video Ping-Pong Loop (Forward-Reverse-Forward)
  const coffeeVideo = document.querySelector('.coffee-hero-video');
  const VIDEO_REVERSE_THRESHOLD = 0.1;
  
  if (coffeeVideo) {
    let isReversing = false;
    let lastTime = 0;

    coffeeVideo.addEventListener('ended', () => {
      isReversing = true;
      lastTime = performance.now();
      requestAnimationFrame(reversePlay);
    });

    /**
     * Reverses the video playback seamlessly.
     * @param {number} now - The current performance timestamp.
     */
    function reversePlay(now) {
      if (!isReversing || !coffeeVideo) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      
      const nextTime = coffeeVideo.currentTime - dt;
      if (nextTime <= VIDEO_REVERSE_THRESHOLD) {
        coffeeVideo.currentTime = 0;
        isReversing = false;
        coffeeVideo.play().catch(err => console.warn('Video play interrupted:', err));
      } else {
        coffeeVideo.currentTime = nextTime;
        requestAnimationFrame(reversePlay);
      }
    }
  }

  // 3. Waitlist Email Submission
  const waitlistForm = document.getElementById('coffee-waitlist-form');
  const responseMsg = document.getElementById('waitlist-response-message');
  const submitBtn = document.getElementById('coffee-waitlist-submit-btn');

  if (waitlistForm && responseMsg && submitBtn) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = waitlistForm.querySelector('input[type="email"]');
      if (!emailInput) return;
      
      const email = emailInput.value.trim();
      if (!email) return;

      // Change button state
      submitBtn.textContent = "Access Granted";
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "var(--color-success)";
      submitBtn.style.borderColor = "var(--color-success)";
      submitBtn.style.color = "var(--color-surface-lowest)";
      
      // Update response message
      const queueNumber = Math.floor(Math.random() * 500) + 120;
      responseMsg.textContent = `Welcome, member! You are #${queueNumber} in queue. Early access details sent to ${email}.`;
      responseMsg.style.color = "var(--color-success)";
      responseMsg.style.fontWeight = "600";
      
      emailInput.disabled = true;
    });
  }
});
