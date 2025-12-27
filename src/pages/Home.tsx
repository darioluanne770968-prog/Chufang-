import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import RecipeCard from '../components/RecipeCard';
import { RecipeGridSkeleton } from '../components/Skeleton';
import { FloatingTimer } from '../components/Timer';
import { recipes as allRecipes } from '../data/recipes';

export default function Home() {
  const [activeTab, setActiveTab] = useState(2); // 推荐 tab active by default
  const [recipes, setRecipes] = useState(allRecipes.slice(0, 6));
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const navigate = useNavigate();

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Pull to refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && !refreshing) {
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;
      if (distance > 0 && distance < 150) {
        setPullDistance(distance);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !refreshing) {
      setRefreshing(true);
      // Simulate refresh
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Shuffle recipes to simulate new content
      setRecipes([...allRecipes].sort(() => Math.random() - 0.5).slice(0, 6));
      setHasMore(true);
      setRefreshing(false);
    }
    setPullDistance(0);
  };

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentLength = recipes.length;
    const newRecipes = allRecipes.slice(0, Math.min(currentLength + 4, allRecipes.length));

    if (newRecipes.length >= allRecipes.length) {
      setHasMore(false);
    }

    setRecipes(newRecipes);
    setLoading(false);
  }, [hasMore, loading, recipes.length]);

  // Scroll listener for infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Filter recipes based on active tab
  const filteredRecipes = recipes.filter((recipe) => {
    if (activeTab === 1) return false; // 关注 - would show followed users' recipes
    if (activeTab === 2) return true; // 推荐 - show all
    if (activeTab === 3) return recipe.difficulty === '简单'; // 减脂 - simple recipes
    if (activeTab === 4) return false; // 商店
    if (activeTab === 5) return true; // 分类
    return true;
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 overflow-y-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all"
        style={{ height: refreshing ? 50 : pullDistance * 0.5 }}
      >
        <RefreshCw
          className={`w-6 h-6 text-orange-500 ${refreshing ? 'animate-spin' : ''}`}
          style={{ transform: `rotate(${pullDistance * 2}deg)` }}
        />
      </div>

      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <Banner />

      {/* Recipe Grid */}
      <div className="px-4">
        {loading && recipes.length === 0 ? (
          <RecipeGridSkeleton count={6} />
        ) : (
          <>
            <div className="masonry">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                />
              ))}
            </div>

            {/* Loading indicator for infinite scroll */}
            {loading && recipes.length > 0 && (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
                <span className="ml-2 text-sm text-gray-500">加载更多...</span>
              </div>
            )}

            {/* End of list */}
            {!hasMore && (
              <div className="text-center py-4 text-sm text-gray-400">
                已经到底啦 ~
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Timer */}
      <FloatingTimer />
    </div>
  );
}
