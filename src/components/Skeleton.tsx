// Skeleton loading components

export function RecipeCardSkeleton() {
  return (
    <div className="masonry-item bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700" />
      <div className="p-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="masonry">
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 animate-pulse">
      {/* Hero Image */}
      <div className="w-full h-72 bg-gray-200 dark:bg-gray-700" />

      {/* Author info */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-1" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
        <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>

      {/* Stats */}
      <div className="p-4 flex items-center gap-6 border-b border-gray-100 dark:border-gray-800">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        ))}
      </div>

      {/* Ingredients */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="flex-1 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse">
      {/* Header */}
      <div className="bg-gray-300 dark:bg-gray-700 pt-8 pb-16 px-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-400 dark:bg-gray-600 rounded-full" />
          <div>
            <div className="h-6 bg-gray-400 dark:bg-gray-600 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-24" />
          </div>
        </div>
        <div className="flex items-center justify-around mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-400 dark:bg-gray-600 rounded w-12 mx-auto mb-1" />
              <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats card */}
      <div className="mx-4 -mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center justify-around">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-8 mx-auto mb-1" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-6 mx-auto" />
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    </div>
  );
}
