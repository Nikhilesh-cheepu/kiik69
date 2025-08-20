// KIIK 69 Sports Bar Knowledge Base
// This file contains all the information the AI assistant needs to answer customer queries

export const KIIK69_KNOWLEDGE = {
  // Basic Information
  basicInfo: {
    name: "KIIK 69 Sports Bar",
    tagline: "THE ULTIMATE EXPERIENCE - Bowling. Beer. Beats. All in One Place",
    description: "KIIK 69 is a premier sports bar and entertainment venue located in Gachibowli, Hyderabad. We offer a unique combination of sports viewing, gaming, dining, and nightlife entertainment."
  },

  // Timings
  timings: {
    "Sunday–Thursday": "11:00 AM to 11:30 PM",
    "Friday & Saturday": "11:00 AM to 1:00 AM",
    note: "Extended hours on weekends for late-night entertainment"
  },

  // Location
  location: {
    address: "Gachibowli, Hyderabad",
    googleMaps: "https://maps.app.goo.gl/7fnCVGpoy7rqxjAz5",
    area: "Located in the heart of Gachibowli, easily accessible from major tech hubs"
  },

  // Party Packages (Current 2024)
  partyPackages: {
    "Power Play": {
      price: "₹1300",
      originalPrice: "₹1800",
      discount: "28% OFF",
      badge: "POPULAR",
      includes: [
        "Bar Snack: Peanut Masala (on table throughout)",
        "Starters: 3 Veg & 3 Non-Veg (served for 90 mins)",
        "Main Course (60 mins): 2 Veg, 2 Non-Veg, 1 Dal, Steam Rice, Roti & Naan Basket, 2 Salads",
        "Dessert: 1 Ice Cream, 1 Gulab Jamun",
        "Games: Carroms, Pool, Foosball"
      ]
    },
    "Super Sixer": {
      price: "₹1800",
      originalPrice: "₹2400",
      discount: "25% OFF",
      badge: "BEST VALUE",
      includes: [
        "Drinks: 3 KF & Bud Craft Beers per head",
        "Same food as Power Play",
        "Access to all indoor games"
      ]
    },
    "The Hat-trick": {
      price: "₹2100",
      originalPrice: "₹2800",
      discount: "25% OFF",
      badge: "PREMIUM",
      includes: [
        "Drinks: Unlimited Indian Made Liquor + Craft Beers (120 mins)",
        "Same food as above",
        "Games + Dance Floor Access"
      ]
    },
    "Master Blaster": {
      price: "₹2500",
      originalPrice: "₹3200",
      discount: "22% OFF",
      badge: "ELITE",
      includes: [
        "Drinks: Unlimited Indian Made Foreign Liquor + Craft Beers (120 mins)",
        "Same food as above",
        "Games + Dance Floor"
      ]
    },
    "Champions League": {
      price: "₹2900",
      originalPrice: "₹3800",
      discount: "24% OFF",
      badge: "VIP",
      includes: [
        "Drinks: Unlimited Imported Liquor (Ballantine's & equivalents) + Craft Beers",
        "Same food as above",
        "Games + Dance Floor"
      ]
    },
    "Hall of Fame": {
      price: "Premium",
      badge: "ULTIMATE VIP",
      includes: [
        "Ultimate luxury experience",
        "All premium amenities included",
        "Exclusive services"
      ]
    }
  },

  // Food Menu
  foodMenu: {
    starters: {
      category: "Starters (₹249-318)",
      items: [
        { name: "Peanut Masala/Boiled", price: "₹249", description: "Spicy masala peanuts or boiled peanuts" },
        { name: "French Fries", price: "₹249", description: "Crispy golden french fries with seasoning" },
        { name: "Potato Wedges", price: "₹249", description: "Seasoned potato wedges with herbs and spices" },
        { name: "Veg Manchuria", price: "₹249", description: "Crispy vegetable manchuria in spicy sauce" },
        { name: "Garlic Bread", price: "₹249", description: "Toasted bread with garlic butter and herbs" },
        { name: "Garlic Bread Cheese", price: "₹249", description: "Garlic bread topped with melted cheese" },
        { name: "Crispy Corn", price: "₹289", description: "Crispy fried corn with spices and seasoning" },
        { name: "Chilly Paneer", price: "₹289", description: "Spicy paneer cubes in chili sauce" },
        { name: "Paneer Tikka", price: "₹318", description: "Grilled paneer tikka with tandoori spices" },
        { name: "Mexican Veg Nachos", price: "₹318", description: "Crispy nachos with vegetables and cheese" },
        { name: "Malai Broccoli", price: "₹318", description: "Creamy broccoli preparation" }
      ]
    },
    mainCourse: {
      category: "Main Course",
      description: "Includes various Indian, Chinese, and Continental dishes with rice, roti, and accompaniments"
    },
    desserts: {
      category: "Desserts",
      items: [
        "Ice Cream varieties",
        "Gulab Jamun",
        "Other sweet treats"
      ]
    }
  },

  // Drinks & Liquor
  drinks: {
    beers: ["KF Craft Beer", "Budweiser Craft Beer", "Other premium beers"],
    liquor: {
      "Indian Made": "Available in party packages",
      "Indian Made Foreign": "Premium options in higher packages",
      "Imported": "Ballantine's and equivalents in VIP packages"
    },
    cocktails: "Signature cocktails available",
    softDrinks: "Wide variety of soft drinks and mocktails"
  },

  // Games & Entertainment
  games: {
    indoor: ["Carroms", "Pool", "Foosball"],
    bowling: "Bowling available (Extra charge)",
    sports: "Large screens for sports viewing",
    music: "Live music and entertainment",
    danceFloor: "Available in select party packages"
  },

  // Dress Code & Policies
  policies: {
    dressCode: "Casual/Smart Casual",
    ageRestriction: "Alcohol only for 21+",
    booking: {
      minimumPax: "25 people minimum",
      advancePayment: "50% advance payment required",
      cancellation: "Standard cancellation policies apply"
    }
  },

  // Contact Information
  contact: {
    instagram: "Follow us on Instagram for updates and offers",
    whatsapp: "WhatsApp for quick queries and bookings",
    phone: "Call for reservations and inquiries",
    booking: "Advance booking recommended, especially for weekends"
  },

  // Atmosphere & Vibe
  atmosphere: {
    design: "Modern, industrial-chic design with sports bar energy",
    vibe: "High-energy sports bar atmosphere with premium feel",
    perfectFor: ["Birthday celebrations", "Corporate events", "Sports viewing parties", "Group celebrations", "Casual dining and drinks"],
    features: ["Premium sports viewing", "Gaming entertainment", "Live music", "Party atmosphere", "Professional service"]
  }
};

// Helper function to search knowledge base
export const searchKnowledge = (query) => {
  const searchTerm = query.toLowerCase();
  const results = [];

  // Search through all sections
  Object.entries(KIIK69_KNOWLEDGE).forEach(([section, content]) => {
    if (typeof content === 'string' && content.toLowerCase().includes(searchTerm)) {
      results.push({ section, content, type: 'text' });
    } else if (typeof content === 'object') {
      Object.entries(content).forEach(([key, value]) => {
        if (typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
          results.push({ section, subsection: key, content: value, type: 'text' });
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'string' && item.toLowerCase().includes(searchTerm)) {
              results.push({ section, subsection: key, content: item, type: 'array-item' });
            }
          });
        }
      });
    }
  });

  return results;
};

// Get specific information by category
export const getInfoByCategory = (category) => {
  return KIIK69_KNOWLEDGE[category] || null;
};

// Get all party packages
export const getAllPartyPackages = () => {
  return KIIK69_KNOWLEDGE.partyPackages;
};

// Get menu items by category
export const getMenuByCategory = (category) => {
  return KIIK69_KNOWLEDGE.foodMenu[category] || null;
};
