'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function generateFoodData(foodName: string) {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey || apiKey === 'TODO' || apiKey.includes('YOUR_API_KEY')) {
    // Fallback if API key is not present or is a placeholder
    return {
      nutritionNote: `A yummy treat called ${foodName}. It's important to eat a balanced diet! (Please set a valid GOOGLE_API_KEY in .env.local)`,
      healthRating: 3,
    };
  }

  // Updated to use gemini-1.5-flash as gemini-pro might be deprecated or unavailable
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
    For the food item "${foodName}", provide:
    1. A health rating from 1 to 5 (integer), where 5 is very healthy and 1 is unhealthy.
    2. A nutrition note for kids (about 100 words). Explain clearly and simply what health benefits the food brings (like vitamins, energy, strong bones) or if it should be eaten in moderation (like too much sugar or salt) and why. Make it engaging and easy to understand.
    
    Return the result as a JSON object with keys "healthRating" (number) and "nutritionNote" (string).
    Do not include markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean up markdown code blocks if present
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Attempt to find JSON object if there's extra text
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleanText;

    const data = JSON.parse(jsonString);
    
    return {
      nutritionNote: data.nutritionNote,
      healthRating: data.healthRating
    };
  } catch (error) {
    console.error('Error generating food data:', error);
    // Return the actual error message to help debugging
    return {
      nutritionNote: `Error generating data: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key and quota.`,
      healthRating: 3,
    };
  }
}
