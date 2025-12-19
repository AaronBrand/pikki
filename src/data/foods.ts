export interface Food {
  id: number;
  name: string;
  image: string;
  nutritionNote: string;
  healthRating: number;
  category: 'Never Tried' | 'Don\'t Like' | 'Always Like' | 'Depends';
}

export const foodItems: Food[] = [
  {
    id: 1,
    name: 'Apple',
    image: '/apple.svg',
    nutritionNote: 'Keeps the doctor away!',
    healthRating: 5,
    category: 'Never Tried',
  },
  {
    id: 2,
    name: 'Broccoli',
    image: '/broccoli.svg',
    nutritionNote: 'Little trees of power!',
    healthRating: 5,
    category: 'Never Tried',
  },
  {
    id: 3,
    name: 'Pizza',
    image: '/pizza.svg',
    nutritionNote: 'A fun treat for your tummy.',
    healthRating: 2,
    category: 'Never Tried',
  },
  {
    id: 4,
    name: 'Carrot',
    image: '/carrot.svg',
    nutritionNote: 'Helps you see in the dark!',
    healthRating: 5,
    category: 'Never Tried',
  },
  {
    id: 5,
    name: 'Chicken Nuggets',
    image: '/chicken-nuggets.svg',
    nutritionNote: 'A yummy protein boost.',
    healthRating: 3,
    category: 'Never Tried',
  },
  {
    id: 6,
    name: 'Banana',
    image: '/banana.svg',
    nutritionNote: 'A super smiley snack!',
    healthRating: 4,
    category: 'Never Tried',
  },
  {
    id: 7,
    name: 'Spinach',
    image: '/spinach.svg',
    nutritionNote: 'Gives you super strength!',
    healthRating: 5,
    category: 'Never Tried',
  },
  {
    id: 8,
    name: 'French Fries',
    image: '/french-fries.svg',
    nutritionNote: 'A salty and crispy treat.',
    healthRating: 1,
    category: 'Never Tried',
  },
];
