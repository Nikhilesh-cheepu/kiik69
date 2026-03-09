import base from "./KIIK69_MENU_DATA.json";

type Eat128Category =
  | "Drinks"
  | "Cocktails"
  | "Mocktails"
  | "Food Non-Veg"
  | "Food Veg & Egg";

type Eat128Item = {
  slug: string;
  name: string;
  category: Eat128Category;
  menuType: "food" | "liquor";
};

const eatAndDrink128Items: Eat128Item[] = [
  // Drinks
  {
    slug: "dewars-white-label",
    name: "Dewars White Label",
    category: "Drinks",
    menuType: "liquor",
  },
  {
    slug: "smirnoff-vodka",
    name: "Smirnoff Vodka",
    category: "Drinks",
    menuType: "liquor",
  },
  {
    slug: "bacardi-rum-flavours",
    name: "Bacardi Rum (White, Black, Mango Chilli, Ginger, Orange, Lemon)",
    category: "Drinks",
    menuType: "liquor",
  },
  {
    slug: "old-monk-legend-rum",
    name: "Old Monk Legend Rum",
    category: "Drinks",
    menuType: "liquor",
  },
  {
    slug: "kyron-brandy",
    name: "Kyron Brandy",
    category: "Drinks",
    menuType: "liquor",
  },
  {
    slug: "great-indian-gin",
    name: "Great Indian Gin",
    category: "Drinks",
    menuType: "liquor",
  },
  {
    slug: "kf-premium-draught-330",
    name: "KF Premium Draught Beer (330ml)",
    category: "Drinks",
    menuType: "liquor",
  },
  {
    slug: "desmondji-tequila-51-agave",
    name: "Desmondji Tequila 51% Agave",
    category: "Drinks",
    menuType: "liquor",
  },

  // Cocktails
  {
    slug: "whiskey-sour-128",
    name: "Whiskey Sour",
    category: "Cocktails",
    menuType: "liquor",
  },
  {
    slug: "caipiroska-128",
    name: "Caipiroska",
    category: "Cocktails",
    menuType: "liquor",
  },
  {
    slug: "cosmopolitan-128",
    name: "Cosmopolitan",
    category: "Cocktails",
    menuType: "liquor",
  },
  {
    slug: "mojito-128",
    name: "Mojito",
    category: "Cocktails",
    menuType: "liquor",
  },
  {
    slug: "daiquiri-128",
    name: "Daiquiri",
    category: "Cocktails",
    menuType: "liquor",
  },
  {
    slug: "gimlet-128",
    name: "Gimlet",
    category: "Cocktails",
    menuType: "liquor",
  },

  // Mocktails
  {
    slug: "virgin-mojito-128",
    name: "Mojito (Virgin)",
    category: "Mocktails",
    menuType: "liquor",
  },
  {
    slug: "blue-angel-128",
    name: "Blue Angel",
    category: "Mocktails",
    menuType: "liquor",
  },
  {
    slug: "strawberry-colada-128",
    name: "Strawberry Colada",
    category: "Mocktails",
    menuType: "liquor",
  },
  {
    slug: "virgin-guava-marry-128",
    name: "Virgin Guava Marry",
    category: "Mocktails",
    menuType: "liquor",
  },
  {
    slug: "mango-bloom-128",
    name: "Mango Bloom",
    category: "Mocktails",
    menuType: "liquor",
  },
  {
    slug: "cold-pressed-juices-128",
    name: "Cold Pressed Juices",
    category: "Mocktails",
    menuType: "liquor",
  },

  // Food Non-Veg
  {
    slug: "murgh-tikka-3pc-128",
    name: "Murgh Tikka (3 pcs)",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "murgh-seekh-kebab-1pc-128",
    name: "Murgh Seekh Kebab (1 pc)",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "kodi-vepudu-128",
    name: "Kodi Vepudu",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "chicken-ghee-roast-128",
    name: "Chicken Ghee Roast",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "chicken-pakoda-128",
    name: "Chicken Pakoda",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "dhaba-fried-chicken-128",
    name: "Dhaba Fried Chicken",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "pepper-chicken-128",
    name: "Pepper Chicken",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "chicken-65-128",
    name: "Chicken 65",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "chicken-shanghai-rolls-128",
    name: "Chicken Shanghai Rolls",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "chicken-popcorn-128",
    name: "Chicken Popcorn",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "crispy-fried-wings-4pc-128",
    name: "Crispy Fried Wings (4 pcs)",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "thai-chilli-fish-128",
    name: "Thai Chilli Fish",
    category: "Food Non-Veg",
    menuType: "food",
  },
  {
    slug: "apollo-fish-128",
    name: "Apollo Fish",
    category: "Food Non-Veg",
    menuType: "food",
  },

  // Food Veg & Egg
  {
    slug: "peanut-masala-128",
    name: "Peanut Masala (Boiled / Fry)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "onion-rings-5pc-128",
    name: "Onion Rings (5 pcs)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "veg-nuggets-128",
    name: "Veg Nuggets",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "green-salad-128",
    name: "Green Salad",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "cheese-garlic-bread-3pc-128",
    name: "Cheese Garlic Bread (3 pcs)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "crispy-corn-128",
    name: "Crispy Corn",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "corn-tiki-4pc-128",
    name: "Corn Tiki (4 pcs)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "corn-cheese-bites-4pc-128",
    name: "Corn Cheese Bites (4 pcs)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "french-fries-128",
    name: "French Fries (Salted / Peri Peri)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "potato-wedges-128",
    name: "Potato Wedges",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "hara-bhara-kebab-4pc-128",
    name: "Hara Bhara Kebab (4 pcs)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "tandoori-gobi-4pc-128",
    name: "Tandoori Gobi (4 pcs)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "paneer-tikka-3pc-128",
    name: "Paneer Tikka (3 pcs)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "manchurian-veg-gobi-128",
    name: "Manchurian (Veg / Gobi)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "65-gobi-paneer-aloo-egg-128",
    name: "65 (Gobi / Paneer / Aloo / Egg)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
  {
    slug: "chilli-paneer-egg-128",
    name: "Chilli (Paneer / Egg)",
    category: "Food Veg & Egg",
    menuType: "food",
  },
];

export const skyhyMenuData = {
  ...base,
  eatAndDrink128: {
    availability: {
      from: "12:00",
      to: "20:00",
    },
    categories: [
      "Drinks",
      "Cocktails",
      "Mocktails",
      "Food Non-Veg",
      "Food Veg & Egg",
    ] as Eat128Category[],
    items: eatAndDrink128Items,
  },
} as const;

/**
 * Build a flat list of menu items for the UI (home teaser, full menu, cart).
 * - Includes regular food & liquor items from the original data
 * - Adds dedicated Eat & Drink @128 items, all priced at ₹128, tagged with "128"
 */
export function buildMenuItemsForUI() {
  const baseFood = skyhyMenuData.food.items.map((i, idx) => ({
    id: i.id ?? idx + 1,
    name: i.name,
    price: i.price,
    category: i.category,
    description: i.description ?? "",
    image: i.image ?? undefined,
    menuType: "food" as const,
    tags: [] as string[],
  }));

  const baseLiquor = skyhyMenuData.liquor.items.map((i, idx) => ({
    id: i.id ?? 1000 + idx + 1,
    name: i.name,
    price: i.price,
    category: i.category,
    description: i.description ?? "",
    image: i.image ?? undefined,
    menuType: "liquor" as const,
    tags: [] as string[],
  }));

  const specials128 = skyhyMenuData.eatAndDrink128.items.map((item, idx) => ({
    id: 10000 + idx,
    name: item.name,
    price: 128,
    category: `128 · ${item.category}`,
    description: undefined as string | undefined,
    image: undefined as string | undefined,
    menuType: item.menuType,
    tags: ["128", item.category],
  }));

  return [...baseFood, ...baseLiquor, ...specials128];
}

export default skyhyMenuData;

