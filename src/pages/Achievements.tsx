import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Lock, CheckCircle, Star, ChefHat, Flame, Clock, Heart, Utensils } from 'lucide-react';
import { useAchievements, useUser } from '../context/AppContext';

const achievementIcons: Record<string, React.ReactNode> = {
  first_dish: <ChefHat className="w-6 h-6" />,
  ten_dishes: <Utensils className="w-6 h-6" />,
  fifty_dishes: <Trophy className="w-6 h-6" />,
  week_streak: <Flame className="w-6 h-6" />,
  month_streak: <Flame className="w-6 h-6" />,
  first_favorite: <Heart className="w-6 h-6" />,
  collector: <Star className="w-6 h-6" />,
  speed_cook: <Clock className="w-6 h-6" />,
};

const XP_PER_ACHIEVEMENT = 100;

export default function Achievements() {
  const navigate = useNavigate();
  const { achievements, unlockedAchievements } = useAchievements();
  const { user } = useUser();

  const unlockedCount = unlockedAchievements.length;
  const totalXp = unlockedCount * XP_PER_ACHIEVEMENT;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">成就系统</h1>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{unlockedCount}</p>
            <p className="text-xs text-white/80">已解锁</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{achievements.length}</p>
            <p className="text-xs text-white/80">总成就</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-white">{totalXp}</p>
            <p className="text-xs text-white/80">获得XP</p>
          </div>
        </div>
      </div>

      {/* Level Display */}
      {user && (
        <div className="mx-4 -mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{user.level}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Lv.{user.level}</p>
                <p className="text-sm text-gray-500">{user.xp} / {user.level * 100} XP</p>
              </div>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      )}

      {/* Achievements List */}
      <div className="px-4 space-y-3">
        {achievements.map((achievement) => {
          const isUnlocked = !!achievement.unlockedAt;
          const progress = achievement.progress || 0;
          const target = achievement.target || 1;
          return (
            <div
              key={achievement.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 ${
                isUnlocked ? '' : 'opacity-60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {isUnlocked ? (
                    achievementIcons[achievement.id] || <Trophy className="w-6 h-6" />
                  ) : (
                    <Lock className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {achievement.name}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">
                        +{XP_PER_ACHIEVEMENT} XP
                      </span>
                    </div>
                    {!isUnlocked && (
                      <span className="text-xs text-gray-400">
                        {progress}/{target}
                      </span>
                    )}
                  </div>
                  {!isUnlocked && (
                    <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${(progress / target) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
