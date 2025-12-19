import React from 'react';
import { foodItems } from '../data/foods';
import FoodCard from './FoodCard';

const FoodGrid: React.FC = () => {
  const sortedFoods = [...foodItems].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {sortedFoods.map(food => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
};

export default FoodGrid;
