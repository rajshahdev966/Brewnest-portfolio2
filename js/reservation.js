/**
 * js/reservation.js
 * Controls zone selector cards, validation, success modals, and simulates live environment metrics.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('workspace-booking-form');
  const zoneCards = document.querySelectorAll('.zone-option-card');
  const dateInput = document.getElementById('booking-date');
  const modalBackdrop = document.getElementById('success-modal-backdrop');
  const modalClose = document.getElementById('success-modal-close');
  
  if (!form) return; // Exit if not on the booking page

  // 1. Minimum Date Restriction (Only allow today and future bookings)
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
  dateInput.value = today;

  // 2. Zone Option Card Selector
  let selectedZone = "Quiet Work Zone"; // Default

  zoneCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove selected class from all
      zoneCards.forEach(c => c.classList.remove('selected'));
      
      // Add selected class to current card
      card.classList.add('selected');
      
      // Update local state
      selectedZone = card.getAttribute('data-zone');
    });
  });

  // 3. Form Submission & Success Modal Display
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Retrieve values
    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const guests = document.getElementById('booking-guests').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    
    // Validate phone length simple
    if (phone.length < 9) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Format Date nicely (e.g. May 30, 2026)
    const dateObj = new Date(date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    // Inject values into the success modal details
    document.getElementById('res-confirm-name').textContent = name;
    document.getElementById('res-confirm-guests').textContent = guests;
    document.getElementById('res-confirm-datetime').textContent = `${formattedDate} @ ${time.split(' ')[0]}`;
    document.getElementById('res-confirm-zone').textContent = selectedZone;

    // Show modal
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  });

  // 4. Close Success Modal
  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Reset Form
    form.reset();
    dateInput.value = today;
    
    // Reset Zone to default card
    zoneCards.forEach(c => c.classList.remove('selected'));
    document.querySelector('[data-zone="Quiet Work Zone"]').classList.add('selected');
    selectedZone = "Quiet Work Zone";
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
