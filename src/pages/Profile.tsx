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
  BarChart2,
  Trophy,
  Target,
  Calendar,
  Package,
  Sparkles,
} from 'lucide-react';
import { useFavorites, useTheme, useBrowsingHistory, useShoppingList, useUser, useAchievements } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { history } = useBrowsingHistory();
  const { items: shoppingItems } = useShoppingList();
  const { user } = useUser();
  const { achievements } = useAchievements();

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt).length;

  const menuItems = [
    { icon: BookOpen, label: '我的菜谱', badge: 12, path: '/my-recipes' },
    { icon: Heart, label: '我的收藏', badge: favorites.length, path: '/favorites' },
    { icon: Clock, label: '浏览历史', badge: history.length, path: '/history' },
    { icon: ShoppingCart, label: '购物清单', badge: shoppingItems.length, path: '/shopping-list' },
    { icon: MessageCircle, label: '我的评论', badge: 156, path: '/my-comments' },
    { icon: ShoppingBag, label: '我的订单', path: '/orders' },
  ];

  const featureItems = [
    { icon: Sparkles, label: '智能推荐', desc: '根据食材推荐菜谱', path: '/ingredient-search', color: 'bg-purple-500' },
    { icon: BarChart2, label: '烹饪统计', desc: '查看你的烹饪数据', path: '/statistics', color: 'bg-blue-500' },
    { icon: Trophy, label: '成就系统', desc: `已解锁 ${unlockedAchievements}/${achievements.length}`, path: '/achievements', color: 'bg-yellow-500' },
    { icon: Target, label: '烹饪挑战', desc: '完成挑战获得奖励', path: '/challenges', color: 'bg-indigo-500' },
    { icon: Calendar, label: '周计划', desc: '规划每周餐食', path: '/meal-planner', color: 'bg-green-500' },
    { icon: Package, label: '食材库', desc: '管理你的食材', path: '/pantry', color: 'bg-orange-500' },
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">厨房小达人</h1>
              {user && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white">
                  Lv.{user.level}
                </span>
              )}
            </div>
            <p className="text-white/80 text-sm mt-1">ID: 88888888</p>
            {user && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${(user.xp % 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/80">{user.xp} XP</span>
                </div>
              </div>
            )}
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

      {/* Feature Cards */}
      <div className="mx-4 mt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">高级功能</h3>
        <div className="grid grid-cols-3 gap-3">
          {featureItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{item.desc}</p>
              </button>
            );
          })}
        </div>
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
