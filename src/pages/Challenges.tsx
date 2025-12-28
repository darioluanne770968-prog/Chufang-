import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Clock, Gift, CheckCircle, Flame, Trophy, Zap } from 'lucide-react';
import { useChallenges, useStats } from '../context/AppContext';

export default function Challenges() {
  const navigate = useNavigate();
  const { challenges } = useChallenges();
  const stats = useStats();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const dailyChallenges = challenges.filter((c) => c.type === 'daily');
  const weeklyChallenges = challenges.filter((c) => c.type === 'weekly');
  const displayChallenges = activeTab === 'daily' ? dailyChallenges : weeklyChallenges;

  const completedDaily = dailyChallenges.filter((c) => c.completed).length;
  const completedWeekly = weeklyChallenges.filter((c) => c.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">烹饪挑战</h1>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">每日挑战</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {completedDaily}/{dailyChallenges.length || 1}
            </p>
            <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${dailyChallenges.length ? (completedDaily / dailyChallenges.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">每周挑战</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {completedWeekly}/{weeklyChallenges.length || 1}
            </p>
            <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full"
                style={{ width: `${weeklyChallenges.length ? (completedWeekly / weeklyChallenges.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 -mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-1 flex shadow-sm">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-purple-500 text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            每日挑战
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'bg-purple-500 text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            每周挑战
          </button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="px-4 mt-4 space-y-3">
        {displayChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`bg-white dark:bg-gray-800 rounded-xl p-4 ${
              challenge.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  challenge.completed
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-500'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-500'
                }`}
              >
                {challenge.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Target className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {challenge.title}
                  </h3>
                  {challenge.completed && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full">
                      已完成
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {challenge.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Gift className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600 dark:text-orange-400">
                        +{challenge.reward} XP
                      </span>
                    </div>
                    {challenge.endDate && (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">
                          {new Date(challenge.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {challenge.progress}/{challenge.target}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      challenge.completed ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {displayChallenges.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">暂无挑战</p>
          </div>
        )}
      </div>

      {/* Streak Bonus */}
      <div className="mx-4 mt-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">连续烹饪奖励</p>
              <p className="text-white/80 text-sm">每天做菜获得额外XP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{stats.streakDays}</p>
            <p className="text-white/80 text-xs">天</p>
          </div>
        </div>
      </div>
    </div>
  );
}
