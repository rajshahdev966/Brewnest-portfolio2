# BrewNest Café & Workspace

A premium specialty coffee café and creative workspace website showcasing artisan roasts, rooftop vibes, fast WiFi, and acoustic music.

## Project Architecture

This project is built using modern, pure HTML, CSS, and JavaScript.

### Core Assets
- **CSS Architecture**: Modular stylesheets located in the `/css` directory. `variables.css` acts as the single source of truth for design tokens (colors, typography, shadows, spacing, glassmorphism specs). Global resets and utilities are in `global.css`.
- **JavaScript Modules**: Vanilla JS located in the `/js` directory and root folder. Designed defensively with strict mode, JSDoc, DOM caching, and robust error handling.
- **Data Integration**: Driven by `brewnest-sheets.js` which interfaces directly with a Google Apps Script Web App to pull live café status, seating capacity metrics, community events, and push workspace reservations to a secure Google Sheet backend.

### The Golden Rule
> **Zero Visual & Functional Changes**
The focus of the codebase is on structural cleanliness, readability, and performance. All refactoring was performed with absolute precision to ensure the user experience remains byte-for-byte identical to the original design vision.

## Technical Enhancements
- **Strict Mode & Defensive JS**: All scripts run in `'use strict';` and feature comprehensive guard clauses to prevent DOM query errors.
- **Resilient Networking**: The Google Sheets data layer features exponential backoff retry logic (`bnFetchWithRetry`) to gracefully handle temporary network latency or drops.
- **Render Performance**: CSS Media Queries are grouped at the bottom of files for efficient parsing. DOM queries in JavaScript are aggressively cached at the initialization phase instead of querying on high-frequency events (like scroll/hover).
- **Self-Documenting Code**: Constant magic numbers were eliminated, files strictly adhere to naming conventions, and JSDoc has been implemented across the board.

## Deployment
This is a static frontend. Deploy simply by serving the root directory (e.g., via GitHub Pages, Vercel, Netlify, or an Apache/Nginx web server). No build step required.
