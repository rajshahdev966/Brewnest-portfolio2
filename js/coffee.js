/**
 * js/coffee.js
 * Controls the product carousel sliding, scroll indicators, and coffee subscription waitlist validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Indicator
  const scrollIndicator = document.getElementById('scroll-to-products');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const target = document.getElementById('roasted-beans');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 2. Video Ping-Pong Loop (Forward-Reverse-Forward)
  const coffeeVideo = document.querySelector('.coffee-hero-video');
  if (coffeeVideo) {
    let isReversing = false;
    let lastTime = 0;

    coffeeVideo.addEventListener('ended', () => {
      isReversing = true;
      lastTime = performance.now();
      requestAnimationFrame(reversePlay);
    });

    function reversePlay(now) {
      if (!isReversing) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      
      const nextTime = coffeeVideo.currentTime - dt;
      if (nextTime <= 0.1) {
        coffeeVideo.currentTime = 0;
        isReversing = false;
        coffeeVideo.play();
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

  if (waitlistForm && responseMsg) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = waitlistForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!email) return;

      // Change button state
      submitBtn.textContent = "Access Granted";
      submitBtn.disabled = true;
      submitBtn.style.backgroundColor = "var(--color-success)";
      submitBtn.style.borderColor = "var(--color-success)";
      submitBtn.style.color = "var(--color-surface-lowest)";
      
      // Update response message
      responseMsg.textContent = `Welcome, member! You are #${Math.floor(Math.random() * 500) + 120} in queue. Early access details sent to ${email}.`;
      responseMsg.style.color = "var(--color-success)";
      responseMsg.style.fontWeight = "600";
      
      emailInput.disabled = true;
    });
  }
});
