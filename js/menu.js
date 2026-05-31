/**
 * js/menu.js
 * Controls the interactive menu tab filters and dynamic card injection.
 */

const MENU_DATA = [
  // COFFEE CATEGORY
  {
    id: 'm1',
    title: 'Hand-Poured V60',
    price: '₹280',
    category: 'coffee',
    badge: 'Pour Over',
    description: 'Bright single-origin Ethiopian beans with floral notes of jasmine, white peach, and bergamot. Brewed with precision.',
    pairing: 'Pairs perfectly with Almond Croissant',
    image: 'assets/menu_v60.png'
  },
  {
    id: 'm2',
    title: 'Signature Flat White',
    price: '₹220',
    category: 'coffee',
    badge: 'Ristretto',
    description: 'Velvet-textured microfoam folded over a double ristretto shot of our house roast, showcasing a sweet, nutty profile.',
    pairing: 'Pairs perfectly with Classic Tiramisu',
    image: 'assets/menu_flat_white.png'
  },
  
  // COLD BREWS CATEGORY
  {
    id: 'm3',
    title: '18-Hour Cold Brew',
    price: '₹240',
    category: 'cold-brews',
    badge: 'Slow Steeped',
    description: 'Slowly steeped single-origin beans, resulting in a low-acidity, naturally sweet, heavy-bodied chocolatey brew.',
    pairing: 'Pairs perfectly with Vegan Banana Bread',
    image: 'assets/menu_cold_brew.png'
  },
  {
    id: 'm4',
    title: 'Citrus Tonic Cold Brew',
    price: '₹260',
    category: 'cold-brews',
    badge: 'Sparkling',
    description: 'Fever-Tree premium tonic water layered with cold brew concentrate, orange oil extracts, and fresh rosemary sprig.',
    pairing: 'Pairs perfectly with Almond Croissant',
    image: 'assets/menu_cold_brew.png'
  },

  // BREAKFAST CATEGORY
  {
    id: 'm5',
    title: 'Smashed Avocado Toast',
    price: '₹340',
    category: 'breakfast',
    badge: 'All Day',
    description: 'Fresh Haas avocados on toasted sourdough, served with cherry tomatoes, feta crumbles, chili flakes, and olive oil drizzle.',
    pairing: 'Pairs perfectly with Signature Flat White',
    image: 'assets/workspace_cafe.png'
  },
  {
    id: 'm6',
    title: 'Spiced Shakshuka skillet',
    price: '₹360',
    category: 'breakfast',
    badge: 'Skillet',
    description: 'Two poached farm eggs in a robust spiced tomato, bell pepper, and onion sauce, topped with coriander and served with fresh baguette.',
    pairing: 'Pairs perfectly with Hand-Poured V60',
    image: 'assets/workspace_cafe.png'
  },

  // DESSERTS CATEGORY
  {
    id: 'm7',
    title: 'Classic Tiramisu',
    price: '₹290',
    category: 'desserts',
    badge: 'House Baked',
    description: 'Espresso-soaked ladyfingers layered with fresh eggless mascarpone cream, dusted heavily with rich dark cocoa.',
    pairing: 'Pairs perfectly with 18-Hour Cold Brew',
    image: 'assets/menu_flat_white.png'
  },
  {
    id: 'm8',
    title: 'Almond Croissant',
    price: '₹190',
    category: 'desserts',
    badge: 'Viennoiserie',
    description: 'Twice-baked buttery puff pastry loaded with sweet almond frangipane filling, topped with toasted almond flakes.',
    pairing: 'Pairs perfectly with Signature Flat White',
    image: 'assets/menu_v60.png'
  },

  // VEGAN CATEGORY
  {
    id: 'm9',
    title: 'Oat Milk Chia Pudding',
    price: '₹220',
    category: 'vegan',
    badge: 'Superfood',
    description: 'Organic chia seeds soaked overnight in vanilla-infused oat milk, topped with forest berries, roasted pumpkin seeds, and maple syrup.',
    pairing: 'Pairs perfectly with Hand-Poured V60',
    image: 'assets/menu_cold_brew.png'
  },
  {
    id: 'm10',
    title: 'Vegan Banana Bread',
    price: '₹180',
    category: 'vegan',
    badge: 'Plant-Based',
    description: 'Warm, spiced slice of banana-walnut bread, served with house-made creamy maple-coconut butter.',
    pairing: 'Pairs perfectly with Citrus Tonic Cold Brew',
    image: 'assets/menu_flat_white.png'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('#menu-tabs .tab-btn');
  const grid = document.getElementById('menu-items-grid');
  
  if (!grid) return; // Exit if not on the landing page

  // Render a specific category of menu items
  const renderMenu = (category) => {
    // Filter data
    const filteredItems = MENU_DATA.filter(item => item.category === category);
    
    // Set opacity to 0 first for transition
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(15px)';
    grid.style.transition = 'opacity 200ms ease-out, transform 200ms ease-out';
    
    setTimeout(() => {
      // Clear grid
      grid.innerHTML = '';
      
      // Inject cards
      filteredItems.forEach(item => {
        const cardHtml = `
          <div class="menu-card fade-reveal active" id="${item.id}">
            <div class="menu-card-img-container">
              <img src="${item.image}" alt="${item.title}">
              <div class="menu-card-badge">${item.badge}</div>
            </div>
            <div class="menu-card-content">
              <div class="menu-card-header">
                <h3 class="menu-card-title">${item.title}</h3>
                <span class="menu-card-price">${item.price}</span>
              </div>
              <p class="menu-card-description">${item.description}</p>
              <div class="menu-card-pairing">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                <span>${item.pairing}</span>
              </div>
              <div class="menu-card-actions">
                <a href="workspace.html" class="btn btn-secondary" style="width: 100%; padding: 10px; text-align: center;">Order at Table</a>
              </div>
            </div>
          </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHtml);
      });
      
      // Reveal items
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 200);
  };

  // Add event listener to each tab button
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      // Deactivate other tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Activate clicked tab
      tab.classList.add('active');
      
      // Get category and render
      const category = tab.getAttribute('data-category');
      renderMenu(category);
    });
  });

  // Initial render of the default "coffee" category
  renderMenu('coffee');
});
