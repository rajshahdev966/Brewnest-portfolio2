/**
 * BrewNest Café & Workspace — Google Sheets Integration Engine
 * Handles real-time café status, capacity metrics, upcoming events, and booking submissions.
 * Optimized with JSDoc documentation, self-documenting naming conventions, and stale-while-revalidate caching.
 */

if (!window.BREWNEST_SHEETS_LOADED) {
  window.BREWNEST_SHEETS_LOADED = true;

  // Intercept the legacy time-based 60-second status badge loop in animations.js
  const originalSetInterval = window.setInterval;
  window.setInterval = function (callback, delay, ...args) {
    if (delay === 60000) {
      console.log('Blocked animations.js café status interval.');
      return null;
    }
    return originalSetInterval(callback, delay, ...args);
  };

  /**
   * Global configuration for Google Sheets Apps Script API endpoints, cache keys, and refresh rates.
   * @type {Object}
   */
  const BREWNEST_CONFIG = {
    scriptUrl: 'https://script.google.com/macros/s/AKfycbxb-hKZqsr8ku2OWg60u2U7Lz9EmwwE3E2OqTPAbo_piF6FP6L6U2DshTkp70VWk3Gd/exec',
    refresh: {
      events:     5 * 60 * 1000,  // 5 minutes
      cafeStatus: 1 * 60 * 1000,  // 1 minute
      capacity:   2 * 60 * 1000,  // 2 minutes
    },
    cache: {
      events:     'bn_cache_events',
      cafeStatus: 'bn_cache_status',
      capacity:   'bn_cache_capacity',
      timestamp:  '_ts'
    }
  };

  /**
   * Helper function to generate a matching translucent border color (rgba with 0.25 opacity) from a solid color.
   * @param {string} baseColor - Solid HEX or RGBA color string.
   * @returns {string} Translucent rgba color string.
   */
  function getBorderColor(baseColor) {
    if (!baseColor) return 'rgba(245, 235, 221, 0.1)';
    if (baseColor.startsWith('rgba')) {
      return baseColor.replace(/[^,]+(?=\))/, '0.25');
    }
    try {
      const red = parseInt(baseColor.slice(1, 3), 16);
      const green = parseInt(baseColor.slice(3, 5), 16);
      const blue = parseInt(baseColor.slice(5, 7), 16);
      return `rgba(${red}, ${green}, ${blue}, 0.25)`;
    } catch {
      return 'rgba(245, 235, 221, 0.1)';
    }
  }

  /**
   * Generic API fetch utility to communicate with the Google Apps Script Web App.
   * @param {string} apiAction - The query action parameter (e.g., 'getCafeStatus', 'getEvents', 'getCapacity').
   * @returns {Promise<Object>} The data object returned from the API.
   * @throws {Error} If success property in response is false.
   */
  async function bnFetch(apiAction) {
    const requestUrl = BREWNEST_CONFIG.scriptUrl + '?action=' + apiAction;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();
    if (!responseJson.success) {
      throw new Error(responseJson.error || 'Fetch failed for action: ' + apiAction);
    }
    return responseJson.data;
  }

  /**
   * Retrieves and parses a JSON payload from localStorage if it has not expired.
   * @param {string} cacheKey - The cache key descriptor matching BREWNEST_CONFIG.cache.
   * @param {number} maxAgeMs - The maximum allowable age of the cache in milliseconds.
   * @returns {Object|null} Cached object payload or null if expired or missing.
   */
  function bnGetCache(cacheKey, maxAgeMs) {
    try {
      const cacheStorageKey = BREWNEST_CONFIG.cache[cacheKey];
      const timestampStorageKey = cacheStorageKey + BREWNEST_CONFIG.cache.timestamp;
      
      const savedTimestamp = localStorage.getItem(timestampStorageKey);
      const savedData = localStorage.getItem(cacheStorageKey);
      
      if (!savedTimestamp || !savedData) return null;
      if (Date.now() - parseInt(savedTimestamp) > maxAgeMs) {
        return null;
      }
      return JSON.parse(savedData);
    } catch { 
      return null; 
    }
  }

  /**
   * Serializes and stores a JSON payload with a timestamp in localStorage.
   * @param {string} cacheKey - The cache key descriptor matching BREWNEST_CONFIG.cache.
   * @param {Object} dataPayload - The JSON serializable data payload.
   */
  function bnSetCache(cacheKey, dataPayload) {
    try {
      const cacheStorageKey = BREWNEST_CONFIG.cache[cacheKey];
      const timestampStorageKey = cacheStorageKey + BREWNEST_CONFIG.cache.timestamp;
      
      localStorage.setItem(cacheStorageKey, JSON.stringify(dataPayload));
      localStorage.setItem(timestampStorageKey, Date.now().toString());
    } catch {}
  }

  /**
   * Initializes the Café Mood and Status components.
   * Leverages stale-while-revalidate caching to render instantly and update in the background.
   */
  async function initCafeStatus() {
    const cachedPayload = bnGetCache('cafeStatus', BREWNEST_CONFIG.refresh.cafeStatus);

    if (cachedPayload) {
      applyCafeStatus(cachedPayload);
    } else {
      // Temporarily dim indicator elements during first-load visual state
      const statusBadge = document.querySelector('.mood-indicator, #live-board');
      if (statusBadge) statusBadge.style.opacity = '0.5';
    }

    try {
      const apiData = await bnFetch('getCafeStatus');
      bnSetCache('cafeStatus', apiData);
      applyCafeStatus(apiData);

      console.log('BrewNest Status:', 
        apiData.status,
        apiData.source === 'supreme_priority' ? '(OVERRIDE ACTIVE)' : '(time-based)'
      );
    } catch (error) {
      console.warn('Status fetch failed:', error);
      const statusBadge = document.querySelector('.mood-indicator, #live-board');
      if (statusBadge) statusBadge.style.opacity = '1';
    }
  }

  /**
   * Applies the fetched café status data (color, dot animations, text labels) to DOM elements.
   * @param {Object} statusData - The café status data object.
   */
  function applyCafeStatus(statusData) {
    const statusTextElements = document.querySelectorAll('#live-cafe-mood, #lub-status-text');
    const moodDotElements = document.querySelectorAll('.mood-dot');
    const statusBadgeElements = document.querySelectorAll('.mood-indicator, #live-board');

    statusBadgeElements.forEach(badge => {
      badge.style.opacity = '1';
    });

    statusTextElements.forEach(textEl => {
      textEl.style.transition = 'opacity 300ms ease';
      textEl.style.opacity = '0';

      setTimeout(() => {
        if (textEl.id === 'lub-status-text') {
          let suffix = " Active";
          if (statusData.status.toLowerCase().includes("closed")) {
            suffix = "";
          }
          textEl.textContent = statusData.status + suffix;
        } else {
          textEl.textContent = statusData.status;
        }
        textEl.style.color = statusData.color;
        textEl.style.opacity = '1';
      }, 300);
    });

    // Update dot colors and pulse animation speeds
    moodDotElements.forEach(dotEl => {
      dotEl.style.transition = 'background 600ms ease';
      dotEl.style.background = statusData.color;

      dotEl.classList.remove(
        'pulse-slow', 
        'pulse-medium', 
        'pulse-fast', 
        'pulse-none'
      );

      const dotDescription = statusData.dot ? statusData.dot.toLowerCase() : '';

      if (dotDescription.includes('no pulse') || dotDescription.includes('static')) {
        dotEl.classList.add('pulse-none');
      } else if (dotDescription.includes('fast') || dotDescription.includes('energetic')) {
        dotEl.classList.add('pulse-fast');
      } else if (dotDescription.includes('medium')) {
        dotEl.classList.add('pulse-medium');
      } else {
        dotEl.classList.add('pulse-slow');
      }
    });

    // Match indicator container border colors with current state color
    const moodIndicators = document.querySelectorAll('.mood-indicator');
    moodIndicators.forEach(indicator => {
      indicator.style.borderColor = getBorderColor(statusData.color);
    });
    
    const liveBoard = document.getElementById('live-board');
    if (liveBoard) {
      liveBoard.style.borderColor = getBorderColor(statusData.color);
    }

    // Apply time-based capacity / lighting fallback updates to Workspace page if status changes
    const capacityValElement = document.getElementById('lub-capacity');
    const lightValElement = document.getElementById('lub-light');
    if (capacityValElement && lightValElement) {
      const statusTextLower = statusData.status.toLowerCase();
      if (statusTextLower.includes("closed")) {
        capacityValElement.textContent = "0% occupied";
        lightValElement.textContent = "Off";
      } else if (statusTextLower.includes("early bird")) {
        capacityValElement.textContent = "15% occupied";
        lightValElement.textContent = "Sunrise";
      } else if (statusTextLower.includes("morning brew")) {
        capacityValElement.textContent = "48% occupied";
        lightValElement.textContent = "Natural";
      } else if (statusTextLower.includes("lunch rush")) {
        capacityValElement.textContent = "94% occupied";
        lightValElement.textContent = "Full Day";
      } else if (statusTextLower.includes("quiet work")) {
        capacityValElement.textContent = "72% occupied";
        lightValElement.textContent = "Balanced";
      } else if (statusTextLower.includes("golden hour") || statusTextLower.includes("weekend wind down")) {
        capacityValElement.textContent = "58% occupied";
        lightValElement.textContent = "Warm Amber";
      } else if (statusTextLower.includes("social hours") || statusTextLower.includes("weekend morning")) {
        capacityValElement.textContent = "85% occupied";
        lightValElement.textContent = "Ambient";
      } else if (statusTextLower.includes("weekend energy")) {
        capacityValElement.textContent = "90% occupied";
        lightValElement.textContent = "Bright";
      }
    }

    if (statusData.supremePriority) {
      console.log('⚡ Supreme Priority Active:', statusData.status);
    }
  }

  /**
   * Initializes the Community Events section.
   * Leverages stale-while-revalidate caching to render instantly and update in the background.
   */
  async function initEvents() {
    const cachedPayload = bnGetCache('events', BREWNEST_CONFIG.refresh.events);

    if (cachedPayload) {
      renderEvents(cachedPayload);
    } else {
      showEventSkeletons();
    }

    try {
      const apiData = await bnFetch('getEvents');
      bnSetCache('events', apiData);
      renderEvents(apiData);

      console.log('BrewNest Events:', apiData.count, 'upcoming events loaded');
    } catch (error) {
      console.warn('Events fetch failed:', error);
      if (!cachedPayload) {
        hideEventSkeletons();
      }
    }
  }

  /**
   * Renders CSS shimmer skeleton loaders to indicate dynamic fetch loading.
   */
  function showEventSkeletons() {
    const eventsContainer = document.querySelector('.rooftop-cards-stack');
    if (!eventsContainer) return;

    if (!document.getElementById('bn-shimmer-styles')) {
      const shimmerStyles = document.createElement('style');
      shimmerStyles.id = 'bn-shimmer-styles';
      shimmerStyles.textContent = `
        @keyframes bnShimmer {
          0%   { background-position: -200% 0 }
          100% { background-position:  200% 0 }
        }
        .bn-skeleton-card {
          width: 100%;
          height: 108px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--glass-border, rgba(245, 235, 221, 0.12));
          border-radius: var(--radius-md, 16px);
          padding: 24px 28px;
          display: flex;
          gap: 20px;
          box-sizing: border-box;
        }
        .bn-shimmer-bg {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.02) 0%,
            rgba(255,255,255,0.07) 50%,
            rgba(255,255,255,0.02) 100%
          );
          background-size: 200% 100%;
          animation: bnShimmer 1.6s infinite linear;
        }
      `;
      document.head.appendChild(shimmerStyles);
    }

    eventsContainer.innerHTML = `
      <div class="bn-skeleton-card">
        <div class="bn-shimmer-bg" style="width: 60px; height: 60px; border-radius: var(--radius-md, 16px); flex-shrink: 0;"></div>
        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px; justify-content: center;">
          <div class="bn-shimmer-bg" style="width: 60%; height: 16px; border-radius: 4px;"></div>
          <div class="bn-shimmer-bg" style="width: 85%; height: 12px; border-radius: 4px;"></div>
          <div class="bn-shimmer-bg" style="width: 45%; height: 10px; border-radius: 4px;"></div>
        </div>
      </div>
      <div class="bn-skeleton-card">
        <div class="bn-shimmer-bg" style="width: 60px; height: 60px; border-radius: var(--radius-md, 16px); flex-shrink: 0;"></div>
        <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 8px; justify-content: center;">
          <div class="bn-shimmer-bg" style="width: 60%; height: 16px; border-radius: 4px;"></div>
          <div class="bn-shimmer-bg" style="width: 85%; height: 12px; border-radius: 4px;"></div>
          <div class="bn-shimmer-bg" style="width: 45%; height: 10px; border-radius: 4px;"></div>
        </div>
      </div>
    `;
  }

  /**
   * Fallback events list used when loading fails and cache is empty.
   * @type {Array<Object>}
   */
  const FALLBACK_EVENTS = [
    {
      day:         '31',
      month:       'MAY',
      name:        'Acoustic Lounge Fridays',
      description: 'Curated live music sets featuring local unplugged artists.',
      timings:     '7:30 PM Onwards',
      location:    'Rooftop Seating'
    },
    {
      day:         '05',
      month:       'JUN',
      name:        'Coffee Brewing Masterclass',
      description: 'Learn V60 and AeroPress extraction science from our head roasters.',
      timings:     '4:00 PM - 6:00 PM',
      location:    'Roastery Bar'
    }
  ];

  /**
   * Hides skeleton loaders and renders default fallback events.
   */
  function hideEventSkeletons() {
    renderEvents({ upcoming: FALLBACK_EVENTS });
  }

  /**
   * Renders the event object list into the HTML container stack.
   * @param {Object} eventsPayload - Object containing the events array list.
   */
  function renderEvents(eventsPayload) {
    const eventsToRender = (eventsPayload && (eventsPayload.events || eventsPayload.upcoming || eventsPayload.featured)) || [];
    const eventsContainer = document.querySelector('.rooftop-cards-stack');

    if (!eventsContainer) return;

    if (eventsToRender.length === 0) {
      eventsContainer.innerHTML = `
        <div style="
          text-align: center;
          padding: 32px 0;
          color: rgba(245,239,228,0.40);
          font-size: 14px;
          font-style: italic;
        ">
          No upcoming events right now.<br>
          Check back soon — always something brewing.
        </div>
      `;
      return;
    }

    eventsContainer.innerHTML = '';

    eventsToRender.forEach((eventItem, itemIndex) => {
      const cardHTML = buildEventCardHTML(eventItem, itemIndex);
      eventsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    eventsContainer.style.opacity = '0';
    eventsContainer.style.transition = 'opacity 400ms ease';
    requestAnimationFrame(() => {
      eventsContainer.style.opacity = '1';
    });
  }

  /**
   * Returns formatted HTML code for an individual event card element.
   * @param {Object} eventItem - The event data object.
   * @param {number} itemIndex - Iteration index.
   * @returns {string} Card HTML string.
   */
  function buildEventCardHTML(eventItem, itemIndex) {
    return `
      <div class="glass-card event-teaser-card" id="event-card-${itemIndex + 1}">
        <div class="etc-date-badge">
          <span class="etc-date-day">${eventItem.day}</span>
          <span class="etc-date-month">${eventItem.month}</span>
        </div>
        <div class="etc-details">
          <h4>${eventItem.name}</h4>
          <p>${eventItem.description}</p>
          <span>${eventItem.timings} • ${eventItem.location}</span>
        </div>
      </div>
    `;
  }

  /**
   * Initializes Seating Capacity metrics.
   * Leverages stale-while-revalidate caching to render instantly and update in the background.
   */
  async function initCapacity() {
    const cachedPayload = bnGetCache('capacity', BREWNEST_CONFIG.refresh.capacity);

    if (cachedPayload) {
      applyCapacity(cachedPayload);
    }

    try {
      const apiData = await bnFetch('getCapacity');
      bnSetCache('capacity', apiData);
      applyCapacity(apiData);

      console.log('BrewNest Capacity:', 
        apiData.summary.occupiedPercent + '% occupied —', 
        apiData.display.message
      );
    } catch (error) {
      console.warn('Capacity fetch failed:', error);
    }
  }

  /**
   * Formats and applies the capacity summaries to the UI.
   * Resolves spelling variations (e.g. "vaccant") client-side from raw table states.
   * @param {Object} capacityData - Seating capacity API object payload.
   */
  function applyCapacity(capacityData) {
    const tablesList = capacityData.tables || [];
    const totalTablesCount = tablesList.length || 14;
    let vacantSeatsCount = 0;
    let occupiedSeatsCount = 0;
    let reservedSeatsCount = 0;

    tablesList.forEach(table => {
      const tableStatus = (table.status || '').trim().toLowerCase();
      if (tableStatus === 'vacant' || tableStatus === 'vaccant') {
        vacantSeatsCount++;
      } else if (tableStatus === 'occupied') {
        occupiedSeatsCount++;
      } else if (tableStatus === 'reserved') {
        reservedSeatsCount++;
      } else {
        occupiedSeatsCount++; // Fallback count increment
      }
    });

    const occupiedPercentValue = totalTablesCount > 0 ? Math.round(((totalTablesCount - vacantSeatsCount) / totalTablesCount) * 100) : 0;
    const availablePercentValue = 100 - occupiedPercentValue;

    // Recalculate display colors and messages based on derived percentage
    let displayInfo = {};
    if (occupiedPercentValue >= 85) {
      displayInfo = {
        level: 'full',
        color: '#C0392B', // Red
        message: 'Almost Full'
      };
    } else if (occupiedPercentValue >= 50) {
      displayInfo = {
        level: 'moderate',
        color: '#E07B4A', // Orange
        message: 'Moderate Seating'
      };
    } else {
      displayInfo = {
        level: 'spacious',
        color: '#7EA87E', // Green
        message: 'Spacious'
      };
    }

    const calculatedSummary = {
      total: totalTablesCount,
      vacant: vacantSeatsCount,
      occupied: occupiedSeatsCount,
      reserved: reservedSeatsCount,
      occupiedPercent: occupiedPercentValue,
      availablePercent: availablePercentValue
    };

    // 1. Capacity Bar Fill Animation
    const barFillElement = document.querySelector('.bn-capacity-fill, .capacity-bar-fill, [data-capacity-fill]');
    if (barFillElement) {
      barFillElement.style.transition = 'width 800ms cubic-bezier(0.22,1,0.36,1)';
      barFillElement.style.width = calculatedSummary.occupiedPercent + '%';
      barFillElement.style.background = displayInfo.color;
    }

    // 2. Percentage Text Label
    const percentageTextElement = document.querySelector('.bn-capacity-percent, [data-capacity-percent], #lub-capacity');
    if (percentageTextElement) {
      percentageTextElement.textContent = calculatedSummary.occupiedPercent + '% occupied';
      percentageTextElement.style.color = displayInfo.color;
    }

    // 3. Overall Seating Message Indicator
    const statusLabelElement = document.querySelector('.bn-capacity-label, [data-capacity-label]');
    if (statusLabelElement) {
      statusLabelElement.textContent = displayInfo.message;
      statusLabelElement.style.color = displayInfo.color;
    }

    // 4. Detailed Count Updates
    const vacantCountElement = document.querySelector('[data-capacity-vacant]');
    if (vacantCountElement) {
      vacantCountElement.textContent = calculatedSummary.vacant;
    }

    const occupiedCountElement = document.querySelector('[data-capacity-occupied]');
    if (occupiedCountElement) {
      occupiedCountElement.textContent = calculatedSummary.occupied;
    }

    const reservedCountElement = document.querySelector('[data-capacity-reserved]');
    if (reservedCountElement) {
      reservedCountElement.textContent = calculatedSummary.reserved;
    }

    // 5. Total Seats Count
    const totalCountElement = document.querySelector('[data-capacity-total]');
    if (totalCountElement) {
      totalCountElement.textContent = calculatedSummary.total;
    }
  }

  /**
   * Attaches the booking reservation submit interception listener.
   */
  function initReservationForm() {
    const reservationForm = document.querySelector('.bn-reservation-form, #workspace-booking-form, [data-reservation-form], form');
    if (!reservationForm) return;

    reservationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation(); // Block reservation.js legacy callback hooks from executing prematurely

      let preferredZoneSelection = getFieldValue(reservationForm, ['booking-zone', 'preferredZone', 'zone', 'preferred_zone']);
      if (!preferredZoneSelection) {
        const selectedZoneCard = reservationForm.querySelector('.zone-option-card.selected');
        preferredZoneSelection = selectedZoneCard ? (selectedZoneCard.getAttribute('data-zone') || selectedZoneCard.textContent.trim()) : '';
      }

      const reservationData = {
        fullName: getFieldValue(reservationForm, ['booking-name', 'fullName', 'full_name', 'name', 'full-name']),
        phone: getFieldValue(reservationForm, ['booking-phone', 'phone', 'phoneNumber', 'phone_number', 'mobile']),
        guestCount: getFieldValue(reservationForm, ['booking-guests', 'guestCount', 'guest_count', 'guests', 'party_size', 'partySize']),
        date: getFieldValue(reservationForm, ['booking-date', 'date', 'reservationDate', 'booking_date']),
        timeSlot: getFieldValue(reservationForm, ['booking-time', 'timeSlot', 'time_slot', 'time', 'preferred_time']),
        preferredZone: preferredZoneSelection,
        additionalNotes: getFieldValue(reservationForm, ['booking-notes', 'additionalNotes', 'notes', 'message', 'special_requests'])
      };

      const requiredFields = ['fullName', 'phone', 'guestCount', 'date', 'timeSlot'];
      const missingRequired = requiredFields.filter(field => !reservationData[field]);

      if (missingRequired.length > 0) {
        showFormError('Please fill all required fields.');
        return;
      }

      if (reservationData.phone.length < 9) {
        showFormError('Please enter a valid phone number.');
        return;
      }

      const submitButtonElement = reservationForm.querySelector('button[type="submit"], input[type="submit"], .submit-btn, [data-submit]');
      const originalSubmitText = submitButtonElement ? submitButtonElement.textContent : 'Confirm Your Reservation';

      if (submitButtonElement) {
        submitButtonElement.disabled = true;
        submitButtonElement.textContent = 'Sending...';
        submitButtonElement.style.opacity = '0.7';
      }

      try {
        const fetchResponse = await fetch(
          BREWNEST_CONFIG.scriptUrl, 
          {
            method: 'POST',
            mode: 'cors',
            headers: { 
              'Content-Type': 'text/plain' // Direct bypass CORS preflight checks on Apps Script side
            },
            body: JSON.stringify({
              action: 'submitReservation',
              data:   reservationData
            })
          }
        );

        const submissionResult = await fetchResponse.json();

        if (submissionResult.success && submissionResult.data && !submissionResult.data.error) {
          showFormSuccess(
            `🍵 Reservation received! We'll confirm shortly. Your reference: ${submissionResult.data.reference}`
          );

          // Populate the dynamic receipt details inside Success Modal
          const targetDateObj = new Date(reservationData.date);
          const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
          const formattedDateString = targetDateObj.toLocaleDateString('en-US', dateOptions);

          document.getElementById('res-confirm-name').textContent = reservationData.fullName;
          document.getElementById('res-confirm-guests').textContent = reservationData.guestCount;
          document.getElementById('res-confirm-datetime').textContent = `${formattedDateString} @ ${reservationData.timeSlot.split(' ')[0]}`;
          document.getElementById('res-confirm-zone').textContent = reservationData.preferredZone;

          // Inject Reference Code Row to success receipt card
          const successModal = document.getElementById('booking-success-modal');
          if (successModal) {
            let refCodeRow = document.getElementById('res-confirm-reference-row');
            if (!refCodeRow) {
              const detailsCardElement = successModal.querySelector('.success-details-card');
              if (detailsCardElement) {
                refCodeRow = document.createElement('div');
                refCodeRow.className = 'success-detail-row';
                refCodeRow.id = 'res-confirm-reference-row';
                refCodeRow.innerHTML = `
                  <span class="success-detail-lbl">Ref Code:</span>
                  <span class="success-detail-val" id="res-confirm-reference" style="color: var(--color-success);">-</span>
                `;
                detailsCardElement.appendChild(refCodeRow);
              }
            }
            const refCodeValElement = document.getElementById('res-confirm-reference');
            if (refCodeValElement) {
              refCodeValElement.textContent = submissionResult.data.reference;
            }
          }

          // Trigger success modal overlay animations
          const modalBackdrop = document.getElementById('success-modal-backdrop');
          if (modalBackdrop) {
            modalBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
          }

          // Reset inputs and fields
          reservationForm.reset();
          const currentDateStr = new Date().toISOString().split('T')[0];
          const dateInputElement = document.getElementById('booking-date');
          if (dateInputElement) dateInputElement.value = currentDateStr;

          // Re-initialize custom zone selector layout state
          const zoneCardElements = document.querySelectorAll('.zone-option-card');
          zoneCardElements.forEach(card => card.classList.remove('selected'));
          const defaultZoneCard = document.querySelector('[data-zone="Quiet Work Zone"]');
          if (defaultZoneCard) defaultZoneCard.classList.add('selected');

          console.log('Reservation submitted:', submissionResult.data.reference);
        } else {
          const apiErrorMessage = (submissionResult.data && submissionResult.data.error)
            ? `Google Sheets Error: ${submissionResult.data.error}. ${submissionResult.data.hint || ''}`
            : (submissionResult.error || 'Something went wrong. Please call us directly.');
          showFormError(apiErrorMessage);
        }
      } catch (error) {
        console.error('Reservation error:', error);
        showFormError('Could not connect. Please call us or try again.');
      } finally {
        if (submitButtonElement) {
          submitButtonElement.disabled = false;
          submitButtonElement.textContent = originalSubmitText;
          submitButtonElement.style.opacity = '1';
        }
      }
    }, true);
  }

  /**
   * Helper utility to extract values from multiple possible input IDs or Names.
   * @param {HTMLFormElement} formElement - Form reference.
   * @param {Array<string>} possibleSelectors - Potential ID or Name descriptors.
   * @returns {string} Trimmed text content values.
   */
  function getFieldValue(formElement, possibleSelectors) {
    for (const selector of possibleSelectors) {
      const inputElement = formElement.querySelector(`[name="${selector}"], [id="${selector}"], [data-field="${selector}"]`);
      if (inputElement && inputElement.value.trim()) {
        return inputElement.value.trim();
      }
    }
    return '';
  }

  /**
   * Displays a green success notification element below the reservation form.
   * @param {string} textMessage - Message content.
   */
  function showFormSuccess(textMessage) {
    let messageBanner = document.querySelector('.bn-form-message');
    if (!messageBanner) {
      messageBanner = document.createElement('div');
      messageBanner.className = 'bn-form-message';
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.insertAdjacentElement('afterend', messageBanner);
      }
    }
    messageBanner.textContent = textMessage;
    messageBanner.style.cssText = `
      padding: 16px 20px;
      border-radius: 12px;
      background: rgba(126,168,126,0.12);
      border: 1px solid rgba(126,168,126,0.30);
      color: #7EA87E;
      font-size: 14px;
      line-height: 1.5;
      margin-top: 16px;
      transition: opacity 400ms ease;
      opacity: 1;
    `;
    setTimeout(() => {
      messageBanner.style.opacity = '0';
      setTimeout(() => messageBanner.remove(), 400);
    }, 8000);
  }

  /**
   * Displays a red error notification element below the reservation form.
   * @param {string} textMessage - Message content.
   */
  function showFormError(textMessage) {
    let errorBanner = document.querySelector('.bn-form-error');
    if (!errorBanner) {
      errorBanner = document.createElement('div');
      errorBanner.className = 'bn-form-error';
      const formElement = document.querySelector('form');
      if (formElement) {
        formElement.insertAdjacentElement('afterend', errorBanner);
      }
    }
    errorBanner.textContent = textMessage;
    errorBanner.style.cssText = `
      padding: 16px 20px;
      border-radius: 12px;
      background: rgba(192,57,43,0.10);
      border: 1px solid rgba(192,57,43,0.25);
      color: #E07B4A;
      font-size: 14px;
      line-height: 1.5;
      margin-top: 16px;
      transition: opacity 400ms ease;
      opacity: 1;
    `;
    setTimeout(() => {
      errorBanner.style.opacity = '0';
      setTimeout(() => errorBanner.remove(), 400);
    }, 6000);
  }

  // Page-specific initialization & Router
  document.addEventListener('DOMContentLoaded', () => {
    // Run on ALL pages immediately
    initCafeStatus();

    const currentUrlPath = window.location.pathname;

    // Run only on homepage
    if (currentUrlPath === '/' || currentUrlPath.endsWith('/') || currentUrlPath.endsWith('index.html') || currentUrlPath.includes('index')) {
      initEvents();
      setInterval(initEvents, BREWNEST_CONFIG.refresh.events);
    }

    // Run only on workspace page
    if (currentUrlPath.includes('workspace')) {
      initCapacity();
      initReservationForm();
      setInterval(initCapacity, BREWNEST_CONFIG.refresh.capacity);
    }

    // Global cafe status refresh polling loops
    setInterval(initCafeStatus, BREWNEST_CONFIG.refresh.cafeStatus);
  });
}
