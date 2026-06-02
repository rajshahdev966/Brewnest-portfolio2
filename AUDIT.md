# BrewNest Website — Code Audit Report
Date: 2026-06-02

## Files Analyzed

### HTML Pages
- `index.html`: Main landing page featuring the hero video, dynamic menu, community events, and testimonials.
- `workspace.html`: Booking page for workspace reservations with live capacity tracking and environment status.
- `coffee.html`: Roastery page showcasing coffee products, waitlist, and background video.

### CSS Stylesheets (`/css`)
- `variables.css`: Core design tokens (colors, spacing, typography, shadows).
- `global.css`: Reset, base typography, and global utility classes.
- `navbar.css`: Responsive navigation bar and mobile drawer styling.
- `landing.css`: Homepage-specific styles (hero, brand strip, menu layout).
- `cards.css`: Card component styles (features, menu items, products, testimonials).
- `components.css`: Form inputs, chips, mood indicators, and tabs.
- `buttons.css`: Button variants and delivery badges.
- `footer.css`: Footer layout, newsletter form, and map embed.
- `workspace.css`: Booking form, live updates board, and success modal.
- `coffee.css`: Roastery hero, products carousel, and membership teaser.

### JavaScript Modules (`/js` & root)
- `brewnest-sheets.js`: Core data engine connecting to Google Apps Script for live events, capacity, reservations, and café mood.
- `animations.js`: High-fidelity micro-interactions, scroll reveals, and magnetic hovers.
- `coffee.js`: Coffee page specific logic (ping-pong video loop, waitlist form).
- `menu.js`: Interactive menu tab filtering and dynamic card injection.
- `navbar.js`: Scroll transition and mobile drawer toggle logic.
- `reservation.js`: Booking form handling, zone selection, and modal display.

## Issues Found

### Critical (breaks performance/security)
- `brewnest-sheets.js`: Lacks retry logic on network fetches, making the live data vulnerable to temporary connection drops.
- **Multiple JS files**: Missing defensive null-checks before executing DOM manipulations or attaching event listeners, which could cause script execution to halt if an element is missing on a specific page.

### Major (hurts maintainability)
- **DOM Query Inefficiency**: Files like `animations.js` and `navbar.js` query the DOM repeatedly for the same elements instead of caching them.
- **Tight Coupling**: JavaScript files target elements using styling class names instead of dedicated `data-*` attributes, meaning a CSS class change could break JS functionality.
- **Magic Numbers**: Various JS files contain hardcoded literal values (e.g., `60000`, `200`, `0.02`) without contextual named constants.

### Minor (style/consistency)
- **Missing Documentation**: Functions lack JSDoc comments. Files lack standardized header blocks explaining their purpose.
- **HTML Structure**: Missing clear section boundary comments (`<!-- HERO -->`) making large HTML files hard to navigate.
- **CSS Repetition**: Media queries are scattered instead of grouped at the bottom. Some duplicate properties exist.
- **Variable Opportunities**: Some hardcoded values in CSS can be moved to `variables.css`.
- **Variable Declarations**: Some instances of `let` could be `const`.

## What Will Be Changed

### CSS
1. Add standardized file headers and section comments to every CSS file.
2. Consolidate repeated hardcoded values into `variables.css` (e.g., `var(--bn-color-...)`).
3. Group all media queries at the bottom of each file in descending order.
4. Remove duplicate/redundant rules safely.

### JavaScript
1. Add `'use strict'` and standardized file headers.
2. Add JSDoc comments to every function.
3. Cache all repeated DOM queries.
4. Replace magic numbers with named constants at the top of files.
5. Add defensive guard clauses (`if (!element) return`) everywhere.
6. Refactor `brewnest-sheets.js` to use `bnFetchWithRetry` and log connection status.

### HTML
1. Add `<!-- ════ SECTION ════ -->` comments around all major blocks.
2. Standardize `<head>` order across all three pages.
3. Add `data-*` attributes to elements targeted by JS (e.g., `data-nav-drawer`), and update the corresponding JS to use them.
4. Enforce consistent 2-space indentation.

### Documentation
1. Create a comprehensive `README.md` for developer onboarding.

## What Will NOT Be Changed
- **Visuals**: No changes to colors, fonts, layouts, spacings, or animations.
- **Functionality**: No changes to Google Sheets integration logic, form submissions, or the café status display behavior. The site will behave exactly as it does now.

## Expected Improvements
- **Maintainability**: Massive improvement. Code will be self-documenting and strictly structured.
- **Performance**: Slight improvement from reduced DOM queries and grouped CSS media queries.
- **Reliability**: High improvement. Retry logic and guard clauses will prevent silent crashes.
