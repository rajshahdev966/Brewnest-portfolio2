/**
 * js/navbar.js
 * Controls the transparent-to-glassmorphism transition and responsive mobile drawer state.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Constants for DOM Elements
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-item a');
  
  const SCROLL_THRESHOLD = 20;

  /**
   * Handles the scroll event to toggle the glassmorphism class on the navbar.
   */
  const handleScroll = () => {
    if (!navbar) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  if (navbar) {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Toggles the mobile drawer menu and body scroll lock.
   */
  const toggleMobileMenu = () => {
    if (!mobileToggle || !mobileDrawer || !mobileBackdrop) return;
    
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
  if (mobileLinks.length > 0 && mobileDrawer) {
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }
});
