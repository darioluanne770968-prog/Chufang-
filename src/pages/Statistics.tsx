import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Heart, Flame, Star, TrendingUp } from 'lucide-react';
import { useStats, useCookingRecords, useNutrition, useUser } from '../context/AppContext';

export default function Statistics() {
  const navigate = useNavigate();
  const stats = useStats();
  const { getRecentRecords } = useCookingRecords();
  const { getWeekNutrition } = useNutrition();
  const { user, getXpProgress } = useUser();

  const weekNutrition = getWeekNutrition();
  const recentRecords = getRecentRecords(7);
  const maxCalories = Math.max(...weekNutrition.map((n) => n.calories), 1);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  const getDayName = (dateStr: string) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[new Date(dateStr).getDay()];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">烹饪统计</h1>
        </div>

        {/* Level Progress */}
        {user && (
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Lv.{user.level} {getLevelTitle(user.level)}</span>
              <span className="text-white/80 text-sm">{user.xp} XP</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${getXpProgress()}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<ChefHat className="w-5 h-5" />}
            label="完成菜品"
            value={stats.totalDishes}
            unit="道"
            color="orange"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="烹饪时长"
            value={formatTime(stats.totalCookingTime)}
            color="blue"
          />
          <StatCard
            icon={<Flame className="w-5 h-5" />}
            label="连续天数"
            value={stats.streakDays}
            unit="天"
            color="red"
          />
          <StatCard
            icon={<Heart className="w-5 h-5" />}
            label="收藏数量"
            value={stats.favoriteCount}
            unit="个"
            color="pink"
          />
        </div>
      </div>

      {/* Weekly Calories Chart */}
      <div className="mx-4 mt-6 bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          本周热量摄入
        </h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {weekNutrition.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-orange-500 rounded-t-sm transition-all"
                style={{
                  height: `${(day.calories / maxCalories) * 100}%`,
                  minHeight: day.calories > 0 ? '4px' : '0',
                }}
              />
              <span className="text-xs text-gray-500 mt-2">周{getDayName(day.date)}</span>
              <span className="text-xs text-gray-400">{day.calories}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cooking */}
      <div className="mx-4 mt-6 bg-white dark:bg-gray-800 rounded-xl p-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          最近做过
        </h3>
        {recentRecords.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">暂无记录，快去做道菜吧！</p>
        ) : (
          <div className="space-y-3">
            {recentRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900 dark:text-white">{record.recipeName}</p>
                  <p className="text-xs text-gray-400">{record.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-500">{record.duration}分钟</p>
                  {record.rating && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: record.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-500',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-500',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
        {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
      </p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function getLevelTitle(level: number): string {
  if (level < 5) return '厨房新手';
  if (level < 10) return '初级厨师';
  if (level < 20) return '中级厨师';
  if (level < 30) return '高级厨师';
  if (level < 50) return '厨艺大师';
  return '厨神';
}
