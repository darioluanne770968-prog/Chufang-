import { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { categories } from '../data/recipes';

interface HeaderProps {
  activeTab: number;
  onTabChange: (id: number) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white sticky top-0 z-50">
      {/* Top bar with menu, search, and notifications */}
      <div className="flex items-center px-4 py-3 gap-3">
        <button className="p-1">
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex-1 relative">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="搜索菜谱"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-gray-600 placeholder-gray-400"
            />
          </div>
        </div>

        <button className="p-1 relative">
          <Bell className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex items-center px-4 pb-2 overflow-x-auto hide-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onTabChange(category.id)}
            className={`px-4 py-2 whitespace-nowrap text-sm font-medium transition-colors relative ${
              activeTab === category.id
                ? 'text-gray-900'
                : 'text-gray-500'
            }`}
          >
            {category.name}
            {activeTab === category.id && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </header>
  );
}
