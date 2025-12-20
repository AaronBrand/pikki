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
    
    // Generate AI data
    const data = await generateFoodData(name);
    
    // Generate AI Image URL (using Pollinations.ai)
    // Updated prompt for photo-realistic image
    const encodedName = encodeURIComponent(`${name} food delicious photo realistic 8k highly detailed cinematic lighting`);
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
      <div className="mb-12 flex justify-center">
        <form onSubmit={handleGenerate} className="flex gap-4 w-full max-w-lg">
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter a food name (e.g., Taco)"
            className="flex-1 p-4 rounded-xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-lg shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cooking...' : 'Add Food'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {foods.map(food => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
};

export default FoodGenerator;
