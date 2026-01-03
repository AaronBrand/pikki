"use client";

import React, { useState, useEffect } from 'react';
import FoodCard from './FoodCard';
import { generateFoodData } from '../app/actions';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, where, Timestamp } from 'firebase/firestore';

export interface Food {
  id: string;
  name: string;
  image: string;
  nutritionNote: string;
  healthRating: number;
  category: string;
  createdAt?: Timestamp;
  childId: string;
  promise?: string;
}

const FoodGenerator: React.FC = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [inputName, setInputName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [childId, setChildId] = useState<string | null>(null);

  useEffect(() => {
    const storedChildId = localStorage.getItem('selectedChildId');
    setChildId(storedChildId);

    if (storedChildId) {
      // Removed orderBy to avoid needing a composite index immediately
      const q = query(
        collection(db, "foods"), 
        where("childId", "==", storedChildId)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const foodsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Food[];
        
        // Sort client-side
        foodsData.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA;
        });

        setFoods(foodsData);
      });

      return () => unsubscribe();
    } else {
      setFoods([]);
    }
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !childId) return;

    setIsLoading(true);
    const name = inputName.trim();
    
    // Generate AI data and image prompt
    const data = await generateFoodData(name);
    
    // Generate AI Image URL (using Pollinations.ai)
    // Use the AI-generated image prompt if available, otherwise fall back to the default
    const promptToUse = data.imagePrompt || `${name} food delicious photo realistic 8k highly detailed cinematic lighting`;
    const encodedName = encodeURIComponent(promptToUse);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedName}`;

    try {
      await addDoc(collection(db, "foods"), {
        name: name,
        image: imageUrl,
        nutritionNote: data.nutritionNote,
        healthRating: data.healthRating,
        category: 'Never Tried',
        createdAt: Timestamp.now(),
        childId: childId
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setInputName('');
    setIsLoading(false);
  };

  if (!childId) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-gray-600">Please select a child profile from the dashboard.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-center text-orange-500 mb-6 font-comic">What food do you want to try?</h2>
        <form onSubmit={handleGenerate} className="flex gap-4 w-full max-w-lg relative">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="e.g. Broccoli, Sushi, Dragon Fruit..."
            className="flex-1 p-4 pr-12 rounded-full border-4 border-orange-300 focus:border-orange-500 focus:outline-none text-xl font-bold text-gray-700 shadow-inner placeholder-orange-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-xl hover:bg-orange-600 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:shadow-none active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">🍳</span> Cooking...
              </>
            ) : (
              <>
                <span>✨</span> Add Food
              </>
            )}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {foods.map(food => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
      
      {foods.length === 0 && (
        <div className="text-center p-12 opacity-50">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-2xl font-bold text-gray-400">Your plate is empty!</p>
          <p className="text-gray-400">Add some foods you want to try above.</p>
        </div>
      )}
    </div>
  );
};

export default FoodGenerator;
