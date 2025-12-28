import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Plus, X, Search, ChefHat, Clock, Flame, Lightbulb } from 'lucide-react';
import { recipes } from '../data/recipes';
import { usePantry } from '../context/AppContext';

const commonIngredients = [
  { name: '鸡蛋', icon: '🥚' },
  { name: '西红柿', icon: '🍅' },
  { name: '土豆', icon: '🥔' },
  { name: '猪肉', icon: '🥩' },
  { name: '鸡肉', icon: '🍗' },
  { name: '豆腐', icon: '🧈' },
  { name: '青椒', icon: '🫑' },
  { name: '胡萝卜', icon: '🥕' },
  { name: '大蒜', icon: '🧄' },
  { name: '生姜', icon: '🫚' },
  { name: '葱', icon: '🥬' },
  { name: '米饭', icon: '🍚' },
];

export default function IngredientSearch() {
  const navigate = useNavigate();
  const { items: pantryItems } = usePantry();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // AI-like recommendation based on selected ingredients
  const recommendedRecipes = useMemo(() => {
    if (selectedIngredients.length === 0) return [];

    return recipes
      .map((recipe) => {
        // Use title and description for matching since ingredients might be an array of strings
        const recipeText = `${recipe.title} ${recipe.description || ''}`.toLowerCase();
        const matchCount = selectedIngredients.filter((selected) =>
          recipeText.includes(selected.toLowerCase())
        ).length;
        const matchPercentage = (matchCount / selectedIngredients.length) * 100;

        return {
          ...recipe,
          matchCount,
          matchPercentage,
          missingCount: selectedIngredients.length - matchCount,
        };
      })
      .filter((r) => r.matchCount > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [selectedIngredients]);

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addCustomIngredient = () => {
    if (searchQuery && !selectedIngredients.includes(searchQuery)) {
      setSelectedIngredients([...selectedIngredients, searchQuery]);
      setSearchQuery('');
    }
  };

  const usePantryIngredients = () => {
    const pantryNames = pantryItems.map((item) => item.name);
    setSelectedIngredients(pantryNames);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-500 px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              智能推荐
            </h1>
            <p className="text-white/80 text-sm">告诉我你有什么食材</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
            placeholder="输入食材名称..."
            className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={addCustomIngredient}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-purple-500 rounded-lg"
            >
              <Plus className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Selected Ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="mx-4 -mt-3 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">已选食材 ({selectedIngredients.length})</span>
            <button
              onClick={() => setSelectedIngredients([])}
              className="text-sm text-red-500"
            >
              清空
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient) => (
              <span
                key={ingredient}
                className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {ingredient}
                <button onClick={() => toggleIngredient(ingredient)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Use Pantry Button */}
      {pantryItems.length > 0 && (
        <div className="px-4 mb-4">
          <button
            onClick={usePantryIngredients}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Lightbulb className="w-5 h-5" />
            使用我的食材库 ({pantryItems.length}种)
          </button>
        </div>
      )}

      {/* Common Ingredients */}
      <div className="px-4 mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">常用食材</h3>
        <div className="flex flex-wrap gap-2">
          {commonIngredients.map((item) => (
            <button
              key={item.name}
              onClick={() => toggleIngredient(item.name)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                selectedIngredients.includes(item.name)
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Recipes */}
      {selectedIngredients.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-purple-500" />
              为你推荐 ({recommendedRecipes.length})
            </h3>
          </div>

          {recommendedRecipes.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">没有找到匹配的菜谱</p>
              <p className="text-sm text-gray-400 mt-1">尝试添加更多食材</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedRecipes.slice(0, 10).map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-28 h-28 object-cover"
                  />
                  <div className="flex-1 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        匹配 {Math.round(recipe.matchPercentage)}%
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.cookTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {selectedIngredients.length === 0 && (
        <div className="px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <Sparkles className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              智能食材推荐
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              选择你冰箱里有的食材，我来帮你推荐能做的菜
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
