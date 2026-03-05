export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  customizations?: CustomizationGroup[];
}

export interface CustomizationGroup {
  name: string;
  type: "single" | "multiple";
  required?: boolean;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export const BAGEL_TYPES: CustomizationOption[] = [
  { id: "plain", name: "Plain", price: 0 },
  { id: "everything", name: "Everything", price: 0 },
  { id: "sesame", name: "Sesame", price: 0 },
  { id: "poppy", name: "Poppy Seed", price: 0 },
  { id: "cinnamon-currant", name: "Cinnamon & Currant", price: 0 },
  { id: "maldon-salt", name: "Maldon Salt", price: 0 },
  { id: "pumpernickel", name: "Pumpernickel", price: 0 },
  { id: "onion", name: "Onion", price: 0 },
  { id: "jalapeno-cheddar", name: "Jalape\u00f1o Cheddar", price: 0 },
];

const BAGEL_CHOICE: CustomizationGroup = {
  name: "Bagel Choice",
  type: "single",
  required: true,
  options: BAGEL_TYPES,
};

const TOAST_OPTION: CustomizationGroup = {
  name: "Toasted?",
  type: "single",
  options: [
    { id: "not-toasted", name: "Not Toasted", price: 0 },
    { id: "toasted", name: "Toasted", price: 0 },
  ],
};

const SCHMEAR_OPTIONS: CustomizationGroup = {
  name: "Schmear",
  type: "single",
  required: true,
  options: [
    { id: "plain-cc", name: "Plain Cream Cheese", price: 0 },
    { id: "scallion-cc", name: "Scallion Cream Cheese", price: 0 },
    { id: "veggie-cc", name: "Veggie Cream Cheese", price: 0 },
    { id: "black-pepper-cc", name: "Black Pepper Cream Cheese", price: 0 },
    { id: "dill-cc", name: "Dill Cream Cheese", price: 0 },
    { id: "honey-thyme-cc", name: "Honey & Thyme Cream Cheese", price: 0 },
    { id: "jalapeno-cc", name: "Jalape\u00f1o Cream Cheese", price: 0 },
    { id: "lox-spread", name: "Lox Spread", price: 0 },
    { id: "vegan-plain", name: "Vegan Plain", price: 0 },
    { id: "no-schmear", name: "No Schmear", price: 0 },
  ],
};

const SCHMEAR_OPTIONS_OPTIONAL: CustomizationGroup = {
  name: "Schmear",
  type: "single",
  required: false,
  options: [
    { id: "plain-cc", name: "Plain Cream Cheese", price: 0 },
    { id: "scallion-cc", name: "Scallion Cream Cheese", price: 0 },
    { id: "veggie-cc", name: "Veggie Cream Cheese", price: 0 },
    { id: "black-pepper-cc", name: "Black Pepper Cream Cheese", price: 0 },
    { id: "dill-cc", name: "Dill Cream Cheese", price: 0 },
    { id: "honey-thyme-cc", name: "Honey & Thyme Cream Cheese", price: 0 },
    { id: "jalapeno-cc", name: "Jalape\u00f1o Cream Cheese", price: 0 },
    { id: "lox-spread", name: "Lox Spread", price: 0 },
    { id: "vegan-plain", name: "Vegan Plain", price: 0 },
  ],
};

const SANDWICH_ADDONS: CustomizationGroup = {
  name: "Add-ons",
  type: "multiple",
  options: [
    { id: "add-bacon", name: "Add Bacon", price: 3.0 },
    { id: "add-avocado", name: "Add Avocado", price: 3.0 },
    { id: "add-egg", name: "Add Egg", price: 2.0 },
    { id: "add-tomato", name: "Add Tomato", price: 1.0 },
    { id: "add-onion", name: "Add Onion", price: 1.0 },
    { id: "add-capers", name: "Add Capers", price: 1.0 },
    { id: "extra-schmear", name: "Extra Schmear", price: 1.5 },
  ],
};

const SUB_BAGEL: CustomizationGroup = {
  name: "Bread",
  type: "single",
  options: [
    { id: "housemade-roll", name: "Housemade Soft Roll", price: 0 },
    { id: "sub-bagel", name: "Sub Bagel (+$1.50)", price: 1.5 },
  ],
};

const EGG_PREP: CustomizationGroup = {
  name: "Egg Prep",
  type: "single",
  options: [
    { id: "scrambled", name: "Scrambled", price: 0 },
    { id: "fried", name: "Fried", price: 0 },
  ],
};

const MILK_OPTIONS: CustomizationGroup = {
  name: "Milk",
  type: "single",
  options: [
    { id: "whole-milk", name: "Whole Milk", price: 0 },
    { id: "oat-milk", name: "Oat Milk", price: 0.75 },
    { id: "almond-milk", name: "Almond Milk", price: 0.75 },
    { id: "soy-milk", name: "Soy Milk", price: 0.75 },
  ],
};

const DRINK_SIZE: CustomizationGroup = {
  name: "Size",
  type: "single",
  options: [
    { id: "regular", name: "Regular", price: 0 },
    { id: "large", name: "Large (+$1.00)", price: 1.0 },
  ],
};

const SHOT_OPTIONS: CustomizationGroup = {
  name: "Extras",
  type: "multiple",
  options: [
    { id: "extra-shot", name: "Extra Shot", price: 1.0 },
    { id: "decaf", name: "Make it Decaf", price: 0 },
    { id: "add-vanilla", name: "Vanilla Syrup", price: 0.75 },
    { id: "iced", name: "Make it Iced", price: 0 },
  ],
};

export const MENU: MenuItem[] = [
  // Bagels
  { id: "bagel", name: "Bagel", price: 2.5, description: "NY-style, cold fermented, rolled, boiled & baked fresh daily", category: "Bagels", customizations: [BAGEL_CHOICE, TOAST_OPTION] },
  { id: "bagel-schmear", name: "Bagel with Schmear", price: 4.5, description: "Bagel with your choice of house-made Willapa Hills schmear", category: "Bagels", customizations: [BAGEL_CHOICE, SCHMEAR_OPTIONS, TOAST_OPTION] },
  { id: "bialy", name: "Bialy", price: 2.5, description: "Traditional bialy with onion filling", category: "Bagels", customizations: [TOAST_OPTION] },

  // Sandwiches
  { id: "bec", name: "B.E.C. Classic", price: 14.95, description: "Bacon, egg & cheese on housemade soft roll", category: "Sandwiches", customizations: [SUB_BAGEL, EGG_PREP, SCHMEAR_OPTIONS_OPTIONAL, SANDWICH_ADDONS] },
  { id: "egg-cheese", name: "Egg & Cheese", price: 13.8, description: "Egg & cheese on housemade soft roll", category: "Sandwiches", customizations: [SUB_BAGEL, EGG_PREP, SCHMEAR_OPTIONS_OPTIONAL, SANDWICH_ADDONS] },
  { id: "nova-lox", name: "Nova Lox", price: 20.7, description: "Plain schmear, nova lox, tomato, capers, onion on a bagel", category: "Sandwiches", customizations: [BAGEL_CHOICE, SCHMEAR_OPTIONS_OPTIONAL, SANDWICH_ADDONS] },
  { id: "basic-lox", name: "Le Everyday Basic Lox", price: 15.0, description: "Plain schmear, nova lox, tomato", category: "Sandwiches", customizations: [BAGEL_CHOICE, SCHMEAR_OPTIONS_OPTIONAL, SANDWICH_ADDONS] },
  { id: "avocado-toast", name: "Avocado Toast Bagel", price: 13.0, description: "Avocado spread, tomato, pickled onion, everything spice", category: "Sandwiches", customizations: [BAGEL_CHOICE, SANDWICH_ADDONS] },
  { id: "carrot-lox", name: 'Carrot "Lox" (Vegan)', price: 11.0, description: "Salt roasted & smoked carrots, vegan schmear, caper & herb dressing", category: "Sandwiches", customizations: [BAGEL_CHOICE, SANDWICH_ADDONS] },
  { id: "whitefish", name: "Smoked Whitefish Salad", price: 7.0, description: "House-smoked whitefish salad on a bagel", category: "Sandwiches", customizations: [BAGEL_CHOICE, SCHMEAR_OPTIONS_OPTIONAL, SANDWICH_ADDONS] },

  // Pastries
  { id: "bw-cookie", name: "Black & White Cookie", price: 4.5, category: "Pastries" },
  { id: "rugelach", name: "Chocolate Rugelach", price: 3.5, category: "Pastries" },
  { id: "babka", name: "Babka (Nutella)", price: 6.0, description: "Housemade babka with Nutella swirl", category: "Pastries" },
  { id: "brownie", name: "Brownie", price: 4.0, category: "Pastries" },
  { id: "cc-cookie", name: "Chocolate Chip Cookie w/ Tahini", price: 4.0, category: "Pastries" },

  // Drinks
  { id: "drip-coffee", name: "Drip Coffee", price: 3.0, description: "Caff\u00e9 Vita roast", category: "Drinks", customizations: [DRINK_SIZE] },
  { id: "latte", name: "Latte", price: 5.0, description: "Caff\u00e9 Vita espresso", category: "Drinks", customizations: [DRINK_SIZE, MILK_OPTIONS, SHOT_OPTIONS] },
  { id: "cappuccino", name: "Cappuccino", price: 5.0, category: "Drinks", customizations: [DRINK_SIZE, MILK_OPTIONS, SHOT_OPTIONS] },
  { id: "americano", name: "Americano", price: 4.0, category: "Drinks", customizations: [DRINK_SIZE, SHOT_OPTIONS] },
  { id: "tea", name: "Tea", price: 3.0, category: "Drinks", customizations: [DRINK_SIZE] },
  { id: "oj", name: "Orange Juice", price: 4.0, category: "Drinks" },
];

export const CATEGORIES = ["Bagels", "Sandwiches", "Pastries", "Drinks"];
