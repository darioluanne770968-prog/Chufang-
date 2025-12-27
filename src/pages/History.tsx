import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { useBrowsingHistory } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../data/recipes';

export default function History() {
  const navigate = useNavigate();
  const { history } = useBrowsingHistory();

  const historyRecipes = history
    .map((id) => recipes.find((r) => r.id === id))
    .filter(Boolean) as typeof recipes;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 sticky top-0 z-50 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">浏览历史</h1>
            <p className="text-xs text-gray-500">{historyRecipes.length} 个菜谱</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {historyRecipes.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">还没有浏览记录</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-medium"
            >
              去发现美食
            </button>
          </div>
        ) : (
          <div className="masonry">
            {historyRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
