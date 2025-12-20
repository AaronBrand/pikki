'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

interface ChildProfile {
  id: string;
  name: string;
  age: number;
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'children'), where('parentId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const childData: ChildProfile[] = [];
      snapshot.forEach((doc) => {
        childData.push({ id: doc.id, ...doc.data() } as ChildProfile);
      });
      setChildren(childData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newChildName) return;

    try {
      await addDoc(collection(db, 'children'), {
        name: newChildName,
        age: parseInt(newChildAge) || 0,
        parentId: user.uid,
        createdAt: new Date()
      });
      setNewChildName('');
      setNewChildAge('');
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding child: ", error);
    }
  };

  const handleDeleteChild = async (id: string) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      await deleteDoc(doc(db, 'children', id));
    }
  };

  const handleSelectChild = (childId: string) => {
    // Save selected child to local storage or context if needed for the session
    localStorage.setItem('selectedChildId', childId);
    router.push('/');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-yellow-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500" style={{ fontFamily: '\'Comic Sans MS\', cursive, sans-serif' }}>
            Parent Dashboard
          </h1>
          <button 
            onClick={() => signOut()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Children</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {children.map((child) => (
              <div key={child.id} className="border-2 border-orange-200 rounded-lg p-4 hover:border-orange-400 transition-colors relative group">
                <div onClick={() => handleSelectChild(child.id)} className="cursor-pointer">
                  <h3 className="text-xl font-bold text-gray-800">{child.name}</h3>
                  <p className="text-gray-600">Age: {child.age}</p>
                </div>
                <button 
                  onClick={() => handleDeleteChild(child.id)}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
            
            <button 
              onClick={() => setIsAdding(true)}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors h-32"
            >
              + Add Child
            </button>
          </div>

          {isAdding && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Add New Child Profile</h3>
                <form onSubmit={handleAddChild}>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={newChildAge}
                      onChange={(e) => setNewChildAge(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAdding(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Add Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
