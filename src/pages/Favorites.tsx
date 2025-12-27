import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Folder, Plus } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../data/recipes';

const collections = [
  { id: 1, name: '家常菜', count: 15, cover: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200' },
  { id: 2, name: '周末特餐', count: 8, cover: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' },
  { id: 3, name: '健康减脂', count: 12, cover: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200' },
];

export default function Favorites() {
  const [activeTab, setActiveTab] = useState<'recipes' | 'collections'>('recipes');
  const navigate = useNavigate();

  // Simulated favorite recipes (first 6 for demo)
  const favoriteRecipes = recipes.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-900">我的收藏</h1>

        {/* Tabs */}
        <div className="flex gap-6 mt-4">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`pb-2 text-sm font-medium relative ${
              activeTab === 'recipes' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              菜谱
            </span>
            {activeTab === 'recipes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`pb-2 text-sm font-medium relative ${
              activeTab === 'collections' ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <span className="flex items-center gap-1">
              <Folder className="w-4 h-4" />
              收藏夹
            </span>
            {activeTab === 'collections' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {activeTab === 'recipes' ? (
          <div className="masonry">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Create new collection */}
            <button className="bg-white rounded-xl p-4 flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">新建收藏夹</span>
            </button>

            {/* Collections */}
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <img
                  src={collection.cover}
                  alt={collection.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm">{collection.name}</h3>
                  <p className="text-xs text-gray-400">{collection.count} 个菜谱</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
