import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Banner from '../components/Banner';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../data/recipes';

export default function Home() {
  const [activeTab, setActiveTab] = useState(2); // 推荐 tab active by default
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <Banner />

      {/* Recipe Grid - Masonry Layout */}
      <div className="px-4 masonry">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
