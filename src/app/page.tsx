import FoodGrid from '@/components/FoodGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-yellow-100 p-8">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-orange-500" style={{ fontFamily: '\'Comic Sans MS\', cursive, sans-serif' }}>Pikki Food</h1>
        <p className="text-xl text-gray-600 mt-2">Your fun food adventure starts here!</p>
      </header>
      <FoodGrid />
    </main>
  );
}
