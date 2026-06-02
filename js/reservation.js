/**
 * js/reservation.js
 * Controls zone selector cards, validation, success modals, and simulates live environment metrics.
 */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements Caching
  const form = document.getElementById('workspace-booking-form');
  const zoneCards = document.querySelectorAll('.zone-option-card');
  const dateInput = document.getElementById('booking-date');
  const modalBackdrop = document.getElementById('success-modal-backdrop');
  const modalClose = document.getElementById('success-modal-close');
  
  const nameInput = document.getElementById('booking-name');
  const phoneInput = document.getElementById('booking-phone');
  const guestsInput = document.getElementById('booking-guests');
  const timeInput = document.getElementById('booking-time');

  const confirmName = document.getElementById('res-confirm-name');
  const confirmGuests = document.getElementById('res-confirm-guests');
  const confirmDatetime = document.getElementById('res-confirm-datetime');
  const confirmZone = document.getElementById('res-confirm-zone');

  // Constants
  const MIN_PHONE_LENGTH = 9;
  const DEFAULT_ZONE = "Quiet Work Zone";
  const DEFAULT_ZONE_SELECTOR = '[data-zone="Quiet Work Zone"]';

  if (!form) return; // Exit if not on the booking page

  // 1. Minimum Date Restriction (Only allow today and future bookings)
  const today = new Date().toISOString().split('T')[0];
  if (dateInput) {
    dateInput.setAttribute('min', today);
    dateInput.value = today;
  }

  // 2. Zone Option Card Selector
  let selectedZone = DEFAULT_ZONE;

  if (zoneCards.length > 0) {
    zoneCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove selected class from all
        zoneCards.forEach(c => c.classList.remove('selected'));
        
        // Add selected class to current card
        card.classList.add('selected');
        
        // Update local state
        selectedZone = card.getAttribute('data-zone') || DEFAULT_ZONE;
      });
    });
  }

  // 3. Form Submission & Success Modal Display
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Defensive checks for inputs
    if (!nameInput || !phoneInput || !guestsInput || !dateInput || !timeInput) return;

    // Retrieve values
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const guests = guestsInput.value;
    const date = dateInput.value;
    const time = timeInput.value;
    
    // Validate phone length simple
    if (phone.length < MIN_PHONE_LENGTH) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Format Date nicely (e.g. May 30, 2026)
    const dateObj = new Date(date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    // Inject values into the success modal details
    if (confirmName) confirmName.textContent = name;
    if (confirmGuests) confirmGuests.textContent = guests;
    if (confirmDatetime) confirmDatetime.textContent = `${formattedDate} @ ${time.split(' ')[0]}`;
    if (confirmZone) confirmZone.textContent = selectedZone;

    // Show modal
    if (modalBackdrop) {
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
  });

  /**
   * Closes the success modal and resets the form.
   */
  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Reset Form
    if (form) form.reset();
    if (dateInput) dateInput.value = today;
    
    // Reset Zone to default card
    if (zoneCards.length > 0) {
      zoneCards.forEach(c => c.classList.remove('selected'));
      const defaultCard = document.querySelector(DEFAULT_ZONE_SELECTOR);
      if (defaultCard) defaultCard.classList.add('selected');
      selectedZone = DEFAULT_ZONE;
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }
});
