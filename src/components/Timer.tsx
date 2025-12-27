import { useState } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { useTimer } from '../context/AppContext';
import { useTimerEffect } from '../hooks/useTimer';

interface TimerProps {
  onClose?: () => void;
}

const presetTimes = [
  { label: '1分钟', seconds: 60 },
  { label: '3分钟', seconds: 180 },
  { label: '5分钟', seconds: 300 },
  { label: '10分钟', seconds: 600 },
  { label: '15分钟', seconds: 900 },
  { label: '30分钟', seconds: 1800 },
];

export default function Timer({ onClose }: TimerProps) {
  const { startTimer } = useTimer();
  const { active, formattedTime, stopTimer } = useTimerEffect();
  const [customMinutes, setCustomMinutes] = useState('');

  const handleStartCustom = () => {
    const minutes = parseInt(customMinutes);
    if (minutes > 0) {
      startTimer(minutes * 60);
      setCustomMinutes('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">烹饪计时器</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className={`text-6xl font-bold ${active ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'}`}>
            {formattedTime || '0:00'}
          </div>
          {active && (
            <p className="text-sm text-gray-500 mt-2">计时中...</p>
          )}
        </div>

        {/* Controls */}
        {active ? (
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={stopTimer}
              className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
            >
              <Pause className="w-6 h-6" />
            </button>
            <button
              onClick={stopTimer}
              className="w-14 h-14 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <>
            {/* Preset Times */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {presetTimes.map((preset) => (
                <button
                  key={preset.seconds}
                  onClick={() => startTimer(preset.seconds)}
                  className="py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Time */}
            <div className="flex gap-2">
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="自定义分钟数"
                className="flex-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
              <button
                onClick={handleStartCustom}
                disabled={!customMinutes}
                className="px-4 py-3 bg-orange-500 text-white rounded-lg flex items-center gap-2 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                开始
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Floating timer button that shows when timer is active
export function FloatingTimer() {
  const { active, formattedTime, stopTimer } = useTimerEffect();

  if (!active) return null;

  return (
    <div className="fixed bottom-24 right-4 z-40">
      <div className="bg-orange-500 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 animate-pulse">
        <span className="font-bold">{formattedTime}</span>
        <button
          onClick={stopTimer}
          className="p-1 hover:bg-orange-600 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
