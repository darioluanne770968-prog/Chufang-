import { Home, PlaySquare, Star, User, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { id: 'home', icon: Home, label: '首页', path: '/' },
  { id: 'classroom', icon: PlaySquare, label: '课堂', path: '/classroom' },
  { id: 'create', icon: Plus, label: '', path: '/create', isCenter: true },
  { id: 'favorites', icon: Star, label: '收藏', path: '/favorites' },
  { id: 'profile', icon: User, label: '我', path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pb-safe z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="relative -top-4"
              >
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors">
                  <Plus className="w-8 h-8 text-white" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center py-1 px-3 min-w-[60px]"
            >
              <Icon
                className={`w-6 h-6 mb-1 ${
                  isActive ? 'text-gray-900' : 'text-gray-400'
                }`}
                fill={isActive && item.id === 'home' ? 'currentColor' : 'none'}
              />
              <span className={`text-xs ${
                isActive ? 'text-gray-900 font-medium' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
