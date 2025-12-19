"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Food } from '../data/foods';

interface FoodCardProps {
  food: Food;
}

const categoryStyles = {
  'Never Tried': {
    bgColor: 'bg-gray-200',
    pattern: 'pattern-dots',
    textColor: 'text-gray-800',
  },
  'Don\'t Like': {
    bgColor: 'bg-red-300',
    pattern: 'pattern-cross',
    textColor: 'text-red-900',
  },
  'Always Like': {
    bgColor: 'bg-green-300',
    pattern: 'pattern-checkers',
    textColor: 'text-green-900',
  },
  'Depends': {
    bgColor: 'bg-yellow-300',
    pattern: 'pattern-zigzag',
    textColor: 'text-yellow-900',
  },
};

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const [category, setCategory] = useState(food.category);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as Food['category']);
  };

  const styles = categoryStyles[category];

  return (
    <div className={`rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out ${styles.bgColor} ${styles.pattern}`}>
      <div className="relative h-40 w-full">
        <Image src={food.image} alt={food.name} fill style={{ objectFit: 'cover' }} className="rounded-t-2xl" />
        <div className="absolute top-0 right-0 bg-white bg-opacity-75 p-2 rounded-bl-2xl">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-6 h-6 ${i < food.healthRating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className={`text-3xl font-bold mb-2 ${styles.textColor}`}>{food.name}</h3>
        <p className={`text-base italic mb-4 ${styles.textColor} opacity-80`}>&quot;{food.nutritionNote}&quot;</p>
        <div className="flex items-center">
          <label htmlFor={`category-${food.id}`} className={`text-lg font-semibold mr-3 ${styles.textColor}`}>I feel:</label>
          <select
            id={`category-${food.id}`}
            value={category}
            onChange={handleCategoryChange}
            className="p-3 rounded-xl border-2 border-white bg-white bg-opacity-50 text-lg font-semibold w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option>Never Tried</option>
            <option>Don&apos;t Like</option>
            <option>Always Like</option>
            <option>Depends</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
