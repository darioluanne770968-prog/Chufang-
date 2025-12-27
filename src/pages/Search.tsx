import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search as SearchIcon, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { useSearchHistory } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import { recipes } from '../data/recipes';

const hotSearches = ['红烧肉', '番茄炒蛋', '糖醋排骨', '宫保鸡丁', '可乐鸡翅', '蛋炒饭'];

const categories = [
  { id: 'all', name: '全部' },
  { id: 'easy', name: '简单' },
  { id: 'medium', name: '中等' },
  { id: 'hard', name: '困难' },
];

const timeFilters = [
  { id: 'all', name: '全部时间' },
  { id: '15', name: '15分钟内' },
  { id: '30', name: '30分钟内' },
  { id: '60', name: '1小时内' },
];

export default function Search() {
  const navigate = useNavigate();
  const { history, addSearch, clearHistory } = useSearchHistory();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const filteredRecipes = useMemo(() => {
    let result = recipes;

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      );
    }

    // Filter by difficulty
    if (difficulty !== 'all') {
      const difficultyMap: Record<string, string> = {
        easy: '简单',
        medium: '中等',
        hard: '困难',
      };
      result = result.filter((r) => r.difficulty === difficultyMap[difficulty]);
    }

    // Filter by time
    if (timeFilter !== 'all') {
      const maxMinutes = parseInt(timeFilter);
      result = result.filter((r) => {
        const minutes = parseInt(r.cookTime || '0');
        return minutes <= maxMinutes;
      });
    }

    return result;
  }, [query, difficulty, timeFilter]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      addSearch(searchQuery.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 sticky top-0 z-50 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
              <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="搜索菜谱、食材"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="bg-transparent outline-none flex-1 text-sm text-gray-600 dark:text-gray-200 placeholder-gray-400"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="p-1">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-full ${showFilters ? 'bg-orange-100 text-orange-500' : 'text-gray-500'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">难度</p>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setDifficulty(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      difficulty === cat.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">烹饪时间</p>
              <div className="flex gap-2 flex-wrap">
                {timeFilters.map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeFilter(tf.id)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      timeFilter === tf.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {tf.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {query ? (
          /* Search Results */
          <>
            <p className="text-sm text-gray-500 mb-4">
              找到 {filteredRecipes.length} 个结果
            </p>
            {filteredRecipes.length > 0 ? (
              <div className="masonry">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">没有找到相关菜谱</p>
                <p className="text-sm text-gray-400 mt-2">换个关键词试试</p>
              </div>
            )}
          </>
        ) : (
          /* Search Suggestions */
          <>
            {/* Search History */}
            {history.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">搜索历史</span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-orange-500"
                  >
                    清除
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-600"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hot Searches */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-3">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">热门搜索</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {hotSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-full text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-100"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
