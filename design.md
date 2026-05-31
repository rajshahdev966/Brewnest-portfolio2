---
version: "1.0"
name: "BrewNest Cinematic UI"
description: "A premium cinematic café and workspace design system crafted for BrewNest Café. The interface combines warm luxury minimalism, immersive hospitality visuals, subtle glassmorphism, and modern workspace aesthetics optimized for mobile-first café experiences."

colors:
  primary: "#2A1E17"
  secondary: "#F5EBDD"
  tertiary: "#C89B63"
  neutral: "#111111"
  background: "#0F0F10"

  surface: "#171717"
  surface-dim: "#141414"
  surface-bright: "#232323"

  surface-container-lowest: "#0C0C0D"
  surface-container-low: "#161616"
  surface-container: "#1D1D1E"
  surface-container-high: "#262627"
  surface-container-highest: "#313132"

  text-primary: "#F5EBDD"
  text-secondary: "#CFC3B8"
  text-muted: "#8A817B"

  border: "#2F2B28"
  border-light: "#F5EBDD1A"

  accent: "#C89B63"
  accent-soft: "#E0C29C"

  outline: "#5C534C"
  outline-variant: "#312C28"

  success: "#A7D7B5"
  warning: "#F0C674"
  error: "#FF8A80"

  glass-surface: "rgba(255,255,255,0.04)"
  glass-border: "rgba(245,235,221,0.12)"

  overlay-dark: "rgba(0,0,0,0.62)"
  overlay-soft: "rgba(0,0,0,0.35)"

  hero-gradient:
    - "#000000CC"
    - "#00000066"
    - "#000000B3"

typography:

  display-xl:
    fontFamily: "Playfair Display"
    fontSize: "88px"
    fontWeight: 700
    lineHeight: "0.95"
    letterSpacing: "-0.05em"

  display-lg:
    fontFamily: "Playfair Display"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: "1"
    letterSpacing: "-0.04em"

  display-md:
    fontFamily: "Playfair Display"
    fontSize: "56px"
    fontWeight: 600
    lineHeight: "1.05"
    letterSpacing: "-0.03em"

  headline-lg:
    fontFamily: "Playfair Display"
    fontSize: "42px"
    fontWeight: 600
    lineHeight: "1.1"

  headline-md:
    fontFamily: "Playfair Display"
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "1.2"

  headline-sm:
    fontFamily: "Playfair Display"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: "1.3"

  body-lg:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "1.7"
    letterSpacing: "-0.01em"

  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.6"

  body-sm:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"

  label-lg:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "1.4"
    letterSpacing: "0.12em"
    textTransform: "uppercase"

  label-md:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "1.4"
    letterSpacing: "0.1em"
    textTransform: "uppercase"

  navigation:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "1"
    letterSpacing: "0.02em"

rounded:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  card: "28px"
  button: "9999px"
  full: "9999px"

spacing:
  base: "8px"

  xs: "4px"
  sm: "12px"
  md: "24px"
  lg: "48px"
  xl: "80px"
  xxl: "120px"

  gap-xs: "8px"
  gap-sm: "16px"
  gap-md: "24px"
  gap-lg: "40px"

  card-padding: "32px"
  section-padding: "120px"

  container-max: "1440px"

  desktop-margin: "80px"
  tablet-margin: "48px"
  mobile-margin: "20px"

layout:
  composition: "Editorial Cinematic Grid"

  desktop:
    columns: 12
    gutter: "24px"
    margins: "80px"

  tablet:
    columns: 8
    gutter: "20px"
    margins: "48px"

  mobile:
    columns: 4
    gutter: "16px"
    margins: "20px"

  hero-height: "100vh"
  section-gap: "120px"

elevation:

  surface-style: "Cinematic Glassmorphism"

  glass:
    background: "rgba(255,255,255,0.04)"
    border: "1px solid rgba(245,235,221,0.12)"
    backdropBlur: "20px"

  shadow-soft:
    shadow: "0px 10px 40px rgba(0,0,0,0.35)"

  shadow-card:
    shadow: "0px 24px 60px rgba(0,0,0,0.45)"

  shadow-glow:
    shadow: "0px 0px 60px rgba(200,155,99,0.08)"

  overlay:
    background: "linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.45), rgba(0,0,0,0.82))"

motion:
  motion-level: "Subtle Premium"

  durations:
    fast: "180ms"
    normal: "300ms"
    slow: "700ms"
    cinematic: "1400ms"

  easing:
    smooth: "cubic-bezier(0.22, 1, 0.36, 1)"
    cinematic: "cubic-bezier(0.16, 1, 0.3, 1)"

  hover-patterns:
    - soft-scale
    - image-zoom
    - glow-shift
    - blur-transition
    - magnetic-button

  scroll-effects:
    - fade-reveal
    - parallax-overlay
    - cinematic-mask-reveal
    - subtle-float

shapes:
  language: "Soft Luxury"

  corners:
    cards: "28px"
    buttons: "9999px"
    images: "24px"
    inputs: "18px"

  iconography:
    style: "Minimal Linear"
    strokeWidth: "1.8px"

components:

  navbar:
    style: "Floating Glass Navigation"

    background: "rgba(15,15,16,0.55)"
    backdropBlur: "20px"

    borderBottom: "1px solid rgba(245,235,221,0.08)"

    padding: "20px 32px"

    desktopHeight: "88px"
    mobileHeight: "72px"

  hero:
    style: "Cinematic Immersive"

    videoOverlay: true

    contentAlignment: "Left"

    floatingCards: true

    overlayGradient:
      - "rgba(0,0,0,0.82)"
      - "rgba(0,0,0,0.45)"
      - "rgba(0,0,0,0.72)"

  buttons:

    primary:
      background: "#F5EBDD"
      textColor: "#2A1E17"

      padding: "18px 36px"

      radius: "9999px"

      shadow: "0px 8px 24px rgba(245,235,221,0.12)"

      hover:
        scale: "1.03"
        brightness: "1.05"

    secondary:
      background: "rgba(255,255,255,0.02)"

      border: "1px solid rgba(245,235,221,0.12)"

      textColor: "#F5EBDD"

      backdropBlur: "14px"

      padding: "18px 36px"

      radius: "9999px"

    tertiary:
      background: "#C89B63"
      textColor: "#111111"

  cards:

    feature-card:
      background: "rgba(255,255,255,0.03)"

      border: "1px solid rgba(245,235,221,0.08)"

      backdropBlur: "18px"

      radius: "28px"

      padding: "32px"

      shadow: "0px 20px 50px rgba(0,0,0,0.35)"

    menu-card:
      background: "#171717"

      border: "1px solid rgba(245,235,221,0.05)"

      radius: "24px"

      overflow: "hidden"

      hover:
        imageScale: "1.06"
        lift: "-4px"

  inputs:

    background: "rgba(255,255,255,0.03)"

    border: "1px solid rgba(245,235,221,0.08)"

    radius: "18px"

    padding: "18px 20px"

    textColor: "#F5EBDD"

    placeholder: "#8A817B"

    focus:
      border: "#C89B63"
      glow: "0px 0px 0px 4px rgba(200,155,99,0.12)"

  chips:
    background: "rgba(255,255,255,0.04)"

    border: "1px solid rgba(245,235,221,0.08)"

    radius: "9999px"

    padding: "10px 18px"

  delivery-badges:
    style: "Minimal Pill"

    background: "rgba(255,255,255,0.04)"

    border: "1px solid rgba(245,235,221,0.08)"

    hoverGlow: "rgba(200,155,99,0.18)"

pages:

  landing-page:
    mood: "Luxury Workspace Café"

    sections:
      - Hero Experience
      - Brand Highlights
      - Interactive Menu
      - Workspace Experience
      - Rooftop Showcase
      - Community Events
      - Coffee Subscription
      - Testimonials
      - Footer

  reservation-page:
    mood: "Minimal Hospitality"

    sections:
      - Reservation Hero
      - Booking Form
      - Workspace Zones
      - Live Atmosphere Panel

  coffee-product-page:
    mood: "Premium Artisan Product"

    sections:
      - Product Hero
      - Roast Collections
      - Brewing Recommendations
      - Subscription Waitlist

seo:
  strategy: "Local Premium Hospitality SEO"

  primary-keywords:
    - "specialty coffee café in Bengaluru"
    - "best café for work in Bengaluru"
    - "workspace café Bengaluru"
    - "rooftop café Bengaluru"
    - "pet friendly café Bengaluru"
    - "artisan coffee Bengaluru"
    - "coffee shop with wifi Bengaluru"

  technical:
    - semantic-html
    - local-business-schema
    - optimized-alt-tags
    - compressed-video
    - lazy-loading
    - mobile-performance
    - open-graph-tags

performance:
  target: "High Performance Cinematic UX"

  recommendations:
    - use-webm-video
    - lazy-load-media
    - mobile-optimized-video
    - limit-heavy-blur
    - optimize-animation-paints

brand-style:

  aesthetic: "Cinematic Minimal Luxury"

  emotional-tone:
    - warm
    - immersive
    - premium
    - focused
    - creative
    - social

  inspirations:
    - luxury hotel websites
    - premium Japanese cafés
    - Apple product pages
    - editorial lifestyle magazines

do:
  - use subtle cinematic motion
  - maintain dark luxury atmosphere
  - prioritize mobile-first responsiveness
  - keep typography spacious and elegant
  - use glassmorphism sparingly
  - preserve immersive visual hierarchy
  - maintain strong SEO structure

dont:
  - use loud neon accents
  - overcrowd layouts
  - overuse animations
  - introduce sharp geometry
  - use generic restaurant styling
  - create overly bright surfaces
  - break spacing rhythm
---