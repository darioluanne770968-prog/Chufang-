import { useNavigate } from 'react-router-dom';
import {
  Settings,
  ChevronRight,
  BookOpen,
  Heart,
  MessageCircle,
  ShoppingBag,
  Clock,
  ShoppingCart,
  Moon,
  Sun,
} from 'lucide-react';
import { useFavorites, useTheme, useBrowsingHistory, useShoppingList } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { history } = useBrowsingHistory();
  const { items: shoppingItems } = useShoppingList();

  const menuItems = [
    { icon: BookOpen, label: '我的菜谱', badge: 12, path: '/my-recipes' },
    { icon: Heart, label: '我的收藏', badge: favorites.length, path: '/favorites' },
    { icon: Clock, label: '浏览历史', badge: history.length, path: '/history' },
    { icon: ShoppingCart, label: '购物清单', badge: shoppingItems.length, path: '/shopping-list' },
    { icon: MessageCircle, label: '我的评论', badge: 156, path: '/my-comments' },
    { icon: ShoppingBag, label: '我的订单', path: '/orders' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header with user info */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 pt-8 pb-16 px-4 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-white/80 hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-white/80 hover:text-white"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100?img=33"
            alt="User avatar"
            className="w-20 h-20 rounded-full border-4 border-white/20"
          />
          <div>
            <h1 className="text-xl font-bold text-white">厨房小达人</h1>
            <p className="text-white/80 text-sm mt-1">ID: 88888888</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-6 text-white">
          <div className="text-center">
            <div className="text-xl font-bold">128</div>
            <div className="text-xs text-white/80">关注</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-xl font-bold">1.2k</div>
            <div className="text-xs text-white/80">粉丝</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-xl font-bold">3.4k</div>
            <div className="text-xs text-white/80">获赞</div>
          </div>
        </div>
      </div>

      {/* Quick stats card */}
      <div className="mx-4 -mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center justify-around relative z-10">
        <button onClick={() => navigate('/my-recipes')} className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">12</div>
          <div className="text-xs text-gray-500">菜谱</div>
        </button>
        <button onClick={() => navigate('/favorites')} className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{favorites.length}</div>
          <div className="text-xs text-gray-500">收藏</div>
        </button>
        <button onClick={() => navigate('/shopping-list')} className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{shoppingItems.length}</div>
          <div className="text-xs text-gray-500">购物清单</div>
        </button>
        <button onClick={() => navigate('/history')} className="text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{history.length}</div>
          <div className="text-xs text-gray-500">历史</div>
        </button>
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => item.path && navigate(item.path)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900 dark:text-white">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-sm text-gray-400">{item.badge}</span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Theme toggle card */}
      <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-gray-500" />
            ) : (
              <Sun className="w-5 h-5 text-gray-500" />
            )}
            <span className="text-gray-900 dark:text-white">深色模式</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-7 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
