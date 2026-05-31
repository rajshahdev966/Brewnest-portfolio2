/**
 * js/navbar.js
 * Controls the transparent-to-glassmorphism transition and responsive mobile drawer state.
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  
  // 1. Scroll Effect: Transparent to Blurred Glass
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run on load and add listener
  handleScroll();
  window.addEventListener('scroll', handleScroll);

  // 2. Mobile Menu Toggle
  const toggleMobileMenu = () => {
    mobileToggle.classList.toggle('open');
    mobileDrawer.classList.toggle('open');
    mobileBackdrop.classList.toggle('open');
    
    // Prevent background scrolling when drawer is open
    if (mobileDrawer.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile drawer when clicking on links
  const mobileLinks = document.querySelectorAll('.mobile-item a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });
});
