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
  Play,
  Wine,
  Lightbulb,
  Users,
  Globe,
  Bell,
  Zap,
} from 'lucide-react';
import { useFavorites, useTheme, useBrowsingHistory, useShoppingList, useUser, useAchievements } from '../context/AppContext';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedCard } from '../components/ui/AnimatedCard';

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

  const primaryFeatures = [
    { icon: Sparkles, label: '智能推荐', desc: '根据食材推荐', path: '/ingredient-search', gradient: 'from-purple-500 to-pink-500' },
    { icon: BarChart2, label: '烹饪统计', desc: '查看数据', path: '/statistics', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Trophy, label: '成就系统', desc: `${unlockedAchievements}/${achievements.length}`, path: '/achievements', gradient: 'from-yellow-500 to-orange-500' },
    { icon: Target, label: '烹饪挑战', desc: '获得奖励', path: '/challenges', gradient: 'from-indigo-500 to-purple-500' },
    { icon: Calendar, label: '周计划', desc: '规划餐食', path: '/meal-planner', gradient: 'from-green-500 to-teal-500' },
    { icon: Package, label: '食材库', desc: '管理食材', path: '/pantry', gradient: 'from-orange-500 to-red-500' },
  ];

  const secondaryFeatures = [
    { icon: Users, label: '美食圈', desc: '发现美食达人', path: '/social', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { icon: Play, label: '视频教程', desc: '学习烹饪技巧', path: '/video-tutorials', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: Wine, label: '餐酒搭配', desc: '完美搭配推荐', path: '/wine-pairing', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { icon: Lightbulb, label: '烹饪技巧', desc: '实用小贴士', path: '/cooking-tips', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const getLevelTitle = (level: number) => {
    if (level < 5) return '厨房新手';
    if (level < 10) return '初级厨师';
    if (level < 20) return '中级厨师';
    if (level < 30) return '高级厨师';
    if (level < 50) return '厨艺大师';
    return '厨神';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header with user info */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-pink-400 pt-8 pb-20 px-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-32 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 hover:text-white hover:bg-white/30 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white/90 hover:text-white hover:bg-white/30 transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <img
              src="https://i.pravatar.cc/100?img=33"
              alt="User avatar"
              className="w-20 h-20 rounded-2xl border-4 border-white/30 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">厨房小达人</h1>
              {user && (
                <span className="bg-white/25 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs text-white font-medium">
                  Lv.{user.level} {getLevelTitle(user.level)}
                </span>
              )}
            </div>
            <p className="text-white/70 text-sm mt-1">ID: 88888888</p>
            {user && (
              <div className="mt-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full bg-gradient-to-r from-white to-yellow-200 rounded-full transition-all duration-500"
                      style={{ width: `${(user.xp % 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-white font-medium">{user.xp} XP</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-6 text-white relative z-10">
          <button onClick={() => navigate('/social')} className="text-center transition-transform hover:scale-105">
            <div className="text-xl font-bold">128</div>
            <div className="text-xs text-white/70">关注</div>
          </button>
          <div className="w-px h-10 bg-white/20" />
          <button onClick={() => navigate('/social')} className="text-center transition-transform hover:scale-105">
            <div className="text-xl font-bold">1.2k</div>
            <div className="text-xs text-white/70">粉丝</div>
          </button>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <div className="text-xl font-bold">3.4k</div>
            <div className="text-xs text-white/70">获赞</div>
          </div>
        </div>
      </div>

      {/* Quick stats card */}
      <div className="mx-4 -mt-12 relative z-20">
        <GlassCard className="p-4" intensity="heavy">
          <div className="flex items-center justify-around">
            <button onClick={() => navigate('/my-recipes')} className="text-center group">
              <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">12</div>
              <div className="text-xs text-gray-500">菜谱</div>
            </button>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <button onClick={() => navigate('/favorites')} className="text-center group">
              <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{favorites.length}</div>
              <div className="text-xs text-gray-500">收藏</div>
            </button>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <button onClick={() => navigate('/shopping-list')} className="text-center group">
              <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{shoppingItems.length}</div>
              <div className="text-xs text-gray-500">购物清单</div>
            </button>
            <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
            <button onClick={() => navigate('/history')} className="text-center group">
              <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">{history.length}</div>
              <div className="text-xs text-gray-500">历史</div>
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Primary Feature Cards */}
      <div className="mx-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          核心功能
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {primaryFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedCard key={index} delay={index * 50}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full bg-white dark:bg-gray-800 rounded-2xl p-3.5 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <div className={`w-11 h-11 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{item.desc}</p>
                </button>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* Secondary Features */}
      <div className="mx-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          探索更多
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {secondaryFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <AnimatedCard key={index} delay={index * 50 + 300}>
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </button>
              </AnimatedCard>
            );
          })}
        </div>
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-6">
        <GlassCard intensity="heavy" className="overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => item.path && navigate(item.path)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="text-gray-900 dark:text-white">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                </div>
              </button>
            );
          })}
        </GlassCard>
      </div>

      {/* Settings Section */}
      <div className="mx-4 mt-6">
        <GlassCard intensity="heavy" className="overflow-hidden">
          {/* Theme toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <span className="text-gray-900 dark:text-white">深色模式</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full transition-all duration-300 ${
                theme === 'dark' ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-gray-900 dark:text-white">语言设置</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">中文</span>
              <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            </div>
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-gray-900 dark:text-white">通知设置</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          </button>
        </GlassCard>
      </div>

      {/* App version */}
      <div className="text-center text-xs text-gray-400 mt-6 pb-4">
        下厨房 v2.0.0 · 用心做好每一道菜
      </div>
    </div>
  );
}
