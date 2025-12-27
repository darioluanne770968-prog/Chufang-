import { MoreHorizontal } from 'lucide-react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div
      className="masonry-item bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full object-cover"
          style={{ minHeight: '120px' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/400/${300 + Math.random() * 200}?random=${recipe.id}`;
          }}
        />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
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
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">
                  {recipe.author.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 truncate max-w-[120px]">
              {recipe.author}
            </span>
          </div>

          <button
            className="p-1 hover:bg-gray-100 rounded-full"
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
