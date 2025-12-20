'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function generateFoodData(foodName: string) {
  if (!process.env.GOOGLE_API_KEY) {
    // Fallback if API key is not present
    return {
      nutritionNote: `A yummy treat called ${foodName}`,
      healthRating: 3,
    };
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
    For the food item "${foodName}", provide:
    1. A health rating from 1 to 5 (integer).
    
    Return the result as a JSON object with key "healthRating".
    Do not include markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanText);
    
    return {
      nutritionNote: `A yummy treat called ${foodName}`,
      healthRating: data.healthRating
    };
  } catch (error) {
    console.error('Error generating food data:', error);
    return {
      nutritionNote: `A yummy treat called ${foodName}`,
      healthRating: 3,
    };
  }
}
