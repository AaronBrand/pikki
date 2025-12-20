'use client';

import { useState, useEffect } from 'react';
import FoodGenerator from '@/components/FoodGenerator';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [childName, setChildName] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchChildName = async () => {
      const childId = localStorage.getItem('selectedChildId');
      if (childId) {
        const docRef = doc(db, 'children', childId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChildName(docSnap.data().name);
        }
      }
    };
    
    if (user) {
      fetchChildName();
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <main className="min-h-screen bg-yellow-100 p-8">
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-white text-orange-500 px-4 py-2 rounded-full shadow hover:bg-orange-50 font-bold"
        >
          Parent Dashboard
        </button>
      </div>
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-orange-500" style={{ fontFamily: '\'Comic Sans MS\', cursive, sans-serif' }}>Pikki Food</h1>
        <p className="text-xl text-gray-600 mt-2">
          {childName ? `Welcome back, ${childName}!` : 'Your fun food adventure starts here!'}
        </p>
      </header>
      <FoodGenerator />
    </main>
  );
}
