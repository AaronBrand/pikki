"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Food } from './FoodGenerator';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface FoodCardProps {
  food: Food;
}

const categoryStyles = {
  'Never Tried': {
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200',
    pattern: 'pattern-dots',
    textColor: 'text-gray-800',
    icon: '🤔'
  },
  'Don\'t Like': {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    pattern: 'pattern-cross',
    textColor: 'text-red-900',
    icon: '😝'
  },
  'Always Like': {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    pattern: 'pattern-checkers',
    textColor: 'text-green-900',
    icon: '😋'
  },
  'Depends': {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    pattern: 'pattern-zigzag',
    textColor: 'text-yellow-900',
    icon: '🤷'
  },
};

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const [category, setCategory] = useState(food.category);
  const [isPromised, setIsPromised] = useState(food.promise || '');
  const [showPromiseInput, setShowPromiseInput] = useState(false);

  const handleCategoryChange = async (newCategory: string) => {
    setCategory(newCategory);
    
    // Confetti effect for positive progress
    if (newCategory === 'Always Like' || (category === 'Don\'t Like' && newCategory !== 'Don\'t Like')) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Update category in Firestore
    try {
      const foodRef = doc(db, "foods", food.id);
      await updateDoc(foodRef, {
        category: newCategory
      });
    } catch (error) {
      console.error("Error updating category: ", error);
    }
  };

  const handlePromiseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const foodRef = doc(db, "foods", food.id);
      await updateDoc(foodRef, {
        promise: isPromised
      });
      setShowPromiseInput(false);
    } catch (error) {
      console.error("Error updating promise: ", error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this food item?')) {
      try {
        await deleteDoc(doc(db, "foods", food.id));
      } catch (error) {
        console.error("Error deleting food: ", error);
      }
    }
  };

  const styles = categoryStyles[category as keyof typeof categoryStyles] || categoryStyles['Never Tried'];

  return (
    <div className={`relative rounded-3xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-in-out ${styles.bgColor} border-4 ${styles.borderColor} group`}>
      <button 
        onClick={handleDelete}
        className="absolute top-2 left-2 bg-white text-red-500 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md font-bold hover:bg-red-50"
        title="Delete food"
      >
        ✕
      </button>

      <div className="relative h-48 w-full group-hover:h-52 transition-all duration-300">
        {food.image ? (
            <Image src={food.image} alt={food.name} fill style={{ objectFit: 'cover' }} className="rounded-t-2xl" />
        ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm p-2 rounded-bl-2xl shadow-sm border-b border-l border-gray-100">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-sm">
                {i < food.healthRating ? '⭐' : '⚪'}
              </span>
            ))}
          </div>
        </div>
        
        <div className="absolute -bottom-6 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-orange-100 z-10">
          {styles.icon}
        </div>
      </div>

      <div className="p-5 pt-8">
        <h3 className={`text-2xl font-black mb-2 ${styles.textColor} font-comic`}>{food.name}</h3>
        
        <div className="bg-white/60 p-3 rounded-xl mb-4 text-sm leading-relaxed text-gray-700">
          <p className="italic">&quot;{food.nutritionNote}&quot;</p>
        </div>

        {/* Gamification: Promise/Reward Section */}
        <div className="mb-4">
          {isPromised ? (
            <div className="bg-yellow-100 border-2 border-yellow-300 p-2 rounded-lg relative">
              <span className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Reward Promise:</span>
              <p className="text-sm text-yellow-900 font-medium">{isPromised}</p>
              <button 
                onClick={() => setShowPromiseInput(true)} 
                className="absolute top-1 right-1 text-yellow-600 hover:text-yellow-800 text-xs bg-yellow-200 px-2 py-0.5 rounded-full"
              >
                Edit
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowPromiseInput(true)}
              className="text-xs text-orange-500 hover:text-orange-700 font-bold flex items-center gap-1"
            >
              <span>🎁</span> Add a Reward Promise
            </button>
          )}

          {showPromiseInput && (
            <form onSubmit={handlePromiseSubmit} className="mt-2 bg-white p-2 rounded-lg border border-orange-200 shadow-sm">
              <input
                type="text"
                value={isPromised}
                onChange={(e) => setIsPromised(e.target.value)}
                placeholder="e.g. A trip to the park!"
                className="w-full text-sm p-2 border rounded mb-2"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowPromiseInput(false)} className="text-xs text-gray-500">Cancel</button>
                <button type="submit" className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold">Save</button>
              </div>
            </form>
          )}
        </div>

        {/* Progress Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => handleCategoryChange('Don\'t Like')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${category === 'Don\'t Like' ? 'bg-red-500 text-white shadow-inner' : 'bg-white text-red-500 border border-red-200 hover:bg-red-50'}`}
          >
            Don't Like 😝
          </button>
          <button
            onClick={() => handleCategoryChange('Never Tried')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${category === 'Never Tried' ? 'bg-gray-500 text-white shadow-inner' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}
          >
            Not Tried 🤔
          </button>
          <button
            onClick={() => handleCategoryChange('Depends')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${category === 'Depends' ? 'bg-yellow-500 text-white shadow-inner' : 'bg-white text-yellow-600 border border-yellow-200 hover:bg-yellow-50'}`}
          >
            Depends 🤷
          </button>
          <button
            onClick={() => handleCategoryChange('Always Like')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${category === 'Always Like' ? 'bg-green-500 text-white shadow-inner' : 'bg-white text-green-600 border border-green-200 hover:bg-green-50'}`}
          >
            Love It! 😋
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
