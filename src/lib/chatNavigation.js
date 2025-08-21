// Chat Navigation Service
// Handles navigation logic and button generation for chat responses

export const NAVIGATION_ACTIONS = {
  SCROLL_TO_MENU: 'scroll_to_menu',
  SCROLL_TO_PACKAGES: 'scroll_to_packages',
  SCROLL_TO_GAMES: 'scroll_to_games',
  SCROLL_TO_TIMINGS: 'scroll_to_timings',
  SCROLL_TO_LOCATION: 'scroll_to_location',
  SCROLL_TO_CONTACT: 'scroll_to_contact',
  SCROLL_TO_ATMOSPHERE: 'scroll_to_atmosphere',
  SCROLL_TO_DRINKS: 'scroll_to_drinks',
  SCROLL_TO_STARTERS: 'scroll_to_starters',
  SCROLL_TO_MAIN_COURSE: 'scroll_to_main_course',
  SCROLL_TO_DESSERTS: 'scroll_to_desserts',
  SCROLL_TO_POLICIES: 'scroll_to_policies',
  SCROLL_TO_BOOKING: 'scroll_to_booking',
  // Direct contact actions
  CALL_PHONE: 'call_phone',
  OPEN_WHATSAPP: 'open_whatsapp',
  OPEN_LOCATION: 'open_location',
  OPEN_INSTAGRAM: 'open_instagram',
  OPEN_FACEBOOK: 'open_facebook',
  // Booking actions
  CONFIRM_BOOKING: 'confirm_booking',
  MODIFY_BOOKING: 'modify_booking'
};

// Keywords that trigger specific navigation buttons
const NAVIGATION_KEYWORDS = {
  // Menu related
  menu: [NAVIGATION_ACTIONS.SCROLL_TO_MENU],
  food: [NAVIGATION_ACTIONS.SCROLL_TO_MENU],
  eat: [NAVIGATION_ACTIONS.SCROLL_TO_MENU],
  dishes: [NAVIGATION_ACTIONS.SCROLL_TO_MENU],
  cuisine: [NAVIGATION_ACTIONS.SCROLL_TO_MENU],
  
  // Specific menu categories
  starters: [NAVIGATION_ACTIONS.SCROLL_TO_STARTERS],
  main: [NAVIGATION_ACTIONS.SCROLL_TO_MAIN_COURSE],
  course: [NAVIGATION_ACTIONS.SCROLL_TO_MAIN_COURSE],
  dessert: [NAVIGATION_ACTIONS.SCROLL_TO_DESSERTS],
  sweets: [NAVIGATION_ACTIONS.SCROLL_TO_DESSERTS],
  
  // Drinks
  drinks: [NAVIGATION_ACTIONS.SCROLL_TO_DRINKS],
  beverages: [NAVIGATION_ACTIONS.SCROLL_TO_DRINKS],
  cocktails: [NAVIGATION_ACTIONS.SCROLL_TO_DRINKS],
  beer: [NAVIGATION_ACTIONS.SCROLL_TO_DRINKS],
  alcohol: [NAVIGATION_ACTIONS.SCROLL_TO_DRINKS],
  
  // Party packages
  packages: [NAVIGATION_ACTIONS.SCROLL_TO_PACKAGES],
  party: [NAVIGATION_ACTIONS.SCROLL_TO_PACKAGES],
  booking: [NAVIGATION_ACTIONS.SCROLL_TO_BOOKING],
  reservation: [NAVIGATION_ACTIONS.SCROLL_TO_BOOKING],
  event: [NAVIGATION_ACTIONS.SCROLL_TO_PACKAGES],
  
  // Games
  games: [NAVIGATION_ACTIONS.SCROLL_TO_GAMES],
  carroms: [NAVIGATION_ACTIONS.SCROLL_TO_GAMES],
  pool: [NAVIGATION_ACTIONS.SCROLL_TO_GAMES],
  foosball: [NAVIGATION_ACTIONS.SCROLL_TO_GAMES],
  bowling: [NAVIGATION_ACTIONS.SCROLL_TO_GAMES],
  play: [NAVIGATION_ACTIONS.SCROLL_TO_GAMES],
  
  // Timings
  timing: [NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS],
  hours: [NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS],
  open: [NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS],
  close: [NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS],
  schedule: [NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS],
  
  // Location
  location: [NAVIGATION_ACTIONS.SCROLL_TO_LOCATION],
  address: [NAVIGATION_ACTIONS.SCROLL_TO_LOCATION],
  where: [NAVIGATION_ACTIONS.SCROLL_TO_LOCATION],
  map: [NAVIGATION_ACTIONS.SCROLL_TO_LOCATION],
  directions: [NAVIGATION_ACTIONS.SCROLL_TO_LOCATION],
  
  // Contact
  contact: [NAVIGATION_ACTIONS.CALL_PHONE, NAVIGATION_ACTIONS.OPEN_WHATSAPP, NAVIGATION_ACTIONS.OPEN_LOCATION],
  phone: [NAVIGATION_ACTIONS.CALL_PHONE, NAVIGATION_ACTIONS.OPEN_WHATSAPP],
  call: [NAVIGATION_ACTIONS.CALL_PHONE],
  whatsapp: [NAVIGATION_ACTIONS.OPEN_WHATSAPP],
  instagram: [NAVIGATION_ACTIONS.OPEN_INSTAGRAM],
  facebook: [NAVIGATION_ACTIONS.OPEN_FACEBOOK],
  social: [NAVIGATION_ACTIONS.OPEN_INSTAGRAM, NAVIGATION_ACTIONS.OPEN_FACEBOOK],
  reach: [NAVIGATION_ACTIONS.CALL_PHONE, NAVIGATION_ACTIONS.OPEN_WHATSAPP],
  
  // Atmosphere
  atmosphere: [NAVIGATION_ACTIONS.SCROLL_TO_ATMOSPHERE],
  vibe: [NAVIGATION_ACTIONS.SCROLL_TO_ATMOSPHERE],
  ambience: [NAVIGATION_ACTIONS.SCROLL_TO_ATMOSPHERE],
  environment: [NAVIGATION_ACTIONS.SCROLL_TO_ATMOSPHERE],
  
  // Policies
  policies: [NAVIGATION_ACTIONS.SCROLL_TO_POLICIES],
  rules: [NAVIGATION_ACTIONS.SCROLL_TO_POLICIES],
  dress: [NAVIGATION_ACTIONS.SCROLL_TO_POLICIES],
  code: [NAVIGATION_ACTIONS.SCROLL_TO_POLICIES],
  age: [NAVIGATION_ACTIONS.SCROLL_TO_POLICIES],
  minimum: [NAVIGATION_ACTIONS.SCROLL_TO_POLICIES]
};

// Enhanced button configurations with icons
const BUTTON_CONFIGS = {
  [NAVIGATION_ACTIONS.SCROLL_TO_MENU]: {
    label: 'View Full Menu',
    icon: '🍽️',
    action: NAVIGATION_ACTIONS.SCROLL_TO_MENU
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_PACKAGES]: {
    label: 'See Party Packages',
    icon: '🎉',
    action: NAVIGATION_ACTIONS.SCROLL_TO_PACKAGES
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_GAMES]: {
    label: 'Explore Games',
    icon: '🎮',
    action: NAVIGATION_ACTIONS.SCROLL_TO_GAMES
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS]: {
    label: 'Check Timings',
    icon: '🕐',
    action: NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_LOCATION]: {
    label: 'Get Directions',
    icon: '📍',
    action: NAVIGATION_ACTIONS.SCROLL_TO_LOCATION
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_CONTACT]: {
    label: 'Contact Us',
    icon: '📞',
    action: NAVIGATION_ACTIONS.SCROLL_TO_CONTACT
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_ATMOSPHERE]: {
    label: 'Feel the Vibe',
    icon: '✨',
    action: NAVIGATION_ACTIONS.SCROLL_TO_ATMOSPHERE
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_DRINKS]: {
    label: 'Browse Drinks',
    icon: '🍹',
    action: NAVIGATION_ACTIONS.SCROLL_TO_DRINKS
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_STARTERS]: {
    label: 'View Starters',
    icon: '🥗',
    action: NAVIGATION_ACTIONS.SCROLL_TO_STARTERS
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_MAIN_COURSE]: {
    label: 'Main Dishes',
    icon: '🍖',
    action: NAVIGATION_ACTIONS.SCROLL_TO_MAIN_COURSE
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_DESSERTS]: {
    label: 'Sweet Treats',
    icon: '🍰',
    action: NAVIGATION_ACTIONS.SCROLL_TO_DESSERTS
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_POLICIES]: {
    label: 'View Policies',
    icon: '📋',
    action: NAVIGATION_ACTIONS.SCROLL_TO_POLICIES
  },
  [NAVIGATION_ACTIONS.SCROLL_TO_BOOKING]: {
    label: 'Book Now',
    icon: '📅',
    action: NAVIGATION_ACTIONS.SCROLL_TO_BOOKING
  },
  // Direct contact buttons
  [NAVIGATION_ACTIONS.CALL_PHONE]: {
    label: 'Call Now',
    icon: '📞',
    action: NAVIGATION_ACTIONS.CALL_PHONE
  },
  [NAVIGATION_ACTIONS.OPEN_WHATSAPP]: {
    label: 'WhatsApp',
    icon: '💬',
    action: NAVIGATION_ACTIONS.OPEN_WHATSAPP
  },
  [NAVIGATION_ACTIONS.OPEN_LOCATION]: {
    label: 'Get Directions',
    icon: '📍',
    action: NAVIGATION_ACTIONS.OPEN_LOCATION
  },
  [NAVIGATION_ACTIONS.OPEN_INSTAGRAM]: {
    label: 'Instagram',
    icon: '📸',
    action: NAVIGATION_ACTIONS.OPEN_INSTAGRAM
  },
  [NAVIGATION_ACTIONS.OPEN_FACEBOOK]: {
    label: 'Facebook',
    icon: '👥',
    action: NAVIGATION_ACTIONS.OPEN_FACEBOOK
  },
  // Booking confirmation buttons
  [NAVIGATION_ACTIONS.CONFIRM_BOOKING]: {
    label: 'Confirm & Book',
    icon: '✅',
    action: NAVIGATION_ACTIONS.CONFIRM_BOOKING
  },
  [NAVIGATION_ACTIONS.MODIFY_BOOKING]: {
    label: 'Modify Details',
    icon: '✏️',
    action: NAVIGATION_ACTIONS.MODIFY_BOOKING
  }
};

// Detect navigation intent from user message
export const detectNavigationIntent = (userMessage) => {
  if (!userMessage) return [];
  
  const message = userMessage.toLowerCase();
  const detectedActions = new Set();
  
  // Check for keywords
  Object.entries(NAVIGATION_KEYWORDS).forEach(([keyword, actions]) => {
    if (message.includes(keyword)) {
      actions.forEach(action => detectedActions.add(action));
    }
  });
  
  // Convert to array and limit to 3 buttons max
  return Array.from(detectedActions).slice(0, 3);
};

// Generate navigation buttons based on detected actions
export const generateNavigationButtons = (actions) => {
  if (!actions || actions.length === 0) return [];
  
  return actions.map(action => BUTTON_CONFIGS[action]).filter(Boolean);
};

// Enhanced navigation handling with smooth scrolling and proper section targeting
export const handleNavigationClick = (action) => {
  console.log(`🎯 Navigating to: ${action}`);
  
  switch (action) {
    case NAVIGATION_ACTIONS.SCROLL_TO_MENU:
      scrollToSection('menu-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_PACKAGES:
      scrollToSection('party-packages');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_GAMES:
      scrollToSection('games-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_TIMINGS:
      scrollToSection('timings-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_LOCATION:
      scrollToSection('home');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_CONTACT:
      scrollToSection('contact-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_ATMOSPHERE:
      scrollToSection('vibes');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_DRINKS:
      scrollToSection('menu-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_STARTERS:
      scrollToSection('menu-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_MAIN_COURSE:
      scrollToSection('menu-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_DESSERTS:
      scrollToSection('menu-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_POLICIES:
      scrollToSection('policies-section');
      break;
    case NAVIGATION_ACTIONS.SCROLL_TO_BOOKING:
      scrollToSection('booking-section');
      break;
    // Direct contact actions
    case NAVIGATION_ACTIONS.CALL_PHONE:
      window.open('tel:+919274696969', '_self');
      break;
    case NAVIGATION_ACTIONS.OPEN_WHATSAPP:
      window.open('https://wa.me/919274696969', '_blank');
      break;
    case NAVIGATION_ACTIONS.OPEN_LOCATION:
      window.open('https://share.google/BXjbfRXWSfciwBVIS', '_blank');
      break;
    case NAVIGATION_ACTIONS.OPEN_INSTAGRAM:
      window.open('https://www.instagram.com/kiik69sportsbar.gachibowli/', '_blank');
      break;
    case NAVIGATION_ACTIONS.OPEN_FACEBOOK:
      window.open('https://www.facebook.com/kiik69sportsbar/', '_blank');
      break;
    // Booking actions
    case NAVIGATION_ACTIONS.CONFIRM_BOOKING:
      // This will be handled in the Chat component
      console.log('Confirming booking with smart defaults...');
      break;
    case NAVIGATION_ACTIONS.MODIFY_BOOKING:
      // This will be handled in the Chat component
      console.log('Modifying booking details...');
      break;
    default:
      console.log('Unknown navigation action:', action);
  }
};

// Enhanced smooth scroll to section with better targeting
const scrollToSection = (sectionId) => {
  console.log(`🎯 Scrolling to section: ${sectionId}`);
  
  // Try multiple selectors to find the section
  const selectors = [
    `#${sectionId}`,
    `[data-section="${sectionId}"]`,
    `.${sectionId}`,
    `[id*="${sectionId}"]`
  ];
  
  let element = null;
  
  for (const selector of selectors) {
    element = document.querySelector(selector);
    if (element) {
      console.log(`✅ Found section with selector: ${selector}`);
      break;
    }
  }
  
  if (element) {
    // Close chat modal first for better UX
    const chatModal = document.querySelector('[data-chat-modal]');
    if (chatModal) {
      chatModal.style.display = 'none';
    }
    
    // Smooth scroll with offset for navbar
    const navbarHeight = 80; // Approximate navbar height
    const elementPosition = element.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
    
    // Add highlight effect
    element.style.transition = 'all 0.3s ease';
    element.style.boxShadow = '0 0 30px rgba(255, 0, 60, 0.5)';
    
    setTimeout(() => {
      element.style.boxShadow = '';
    }, 2000);
    
    console.log(`✅ Successfully scrolled to ${sectionId}`);
  } else {
    console.log(`❌ Section ${sectionId} not found. Available sections:`, 
      Array.from(document.querySelectorAll('section[id]')).map(s => s.id)
    );
    
    // Fallback: scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// Main function to get navigation buttons for a user message
export const getNavigationButtonsForMessage = (userMessage) => {
  const actions = detectNavigationIntent(userMessage);
  return generateNavigationButtons(actions);
};
