import { MoreHorizontal, Heart } from 'lucide-react';
import type { Recipe } from '../types';
import { useFavorites } from '../context/AppContext';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(recipe.id);

  return (
    <div
      className="masonry-item bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 animate-fade-in"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/400/300?random=${recipe.id}`;
          }}
        />
        {/* Favorite button overlay */}
        <button
          className="absolute top-2 right-2 p-1.5 bg-black/20 rounded-full backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
        >
          <Heart
            className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : 'text-white'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
          {recipe.title}
        </h3>

        {/* Author info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {recipe.authorAvatar ? (
              <img
                src={recipe.authorAvatar}
                alt={recipe.author}
                className="w-5 h-5 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://i.pravatar.cc/40?u=${recipe.id}`;
                }}
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {recipe.author.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
              {recipe.author}
            </span>
          </div>

          <button
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
