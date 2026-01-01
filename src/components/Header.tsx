import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import { categories } from '../data/recipes';

interface HeaderProps {
  activeTab: number;
  onTabChange: (id: number) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-800 sticky top-0 z-50 pt-safe">
      {/* Top bar with menu, search, and notifications */}
      <div className="flex items-center px-4 py-3 gap-3">
        <button className="p-1">
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <button
          onClick={() => navigate('/search')}
          className="flex-1 relative"
        >
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-400">搜索菜谱</span>
          </div>
        </button>

        <button className="p-1 relative">
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex items-center justify-around px-2 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onTabChange(category.id)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors relative ${
              activeTab === category.id
                ? 'text-orange-500'
                : 'text-gray-400'
            }`}
          >
            {category.name}
            {activeTab === category.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </header>
  );
}
