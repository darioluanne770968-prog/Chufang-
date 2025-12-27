import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Clock, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { useCookingMode, useTimer } from '../context/AppContext';
import { recipes } from '../data/recipes';
import Timer from '../components/Timer';

// Sample steps data (in real app, this would be part of recipe data)
const getRecipeSteps = (_recipeId: number) => [
  {
    step: 1,
    content: '准备所有食材，将主料洗净切好备用。',
    image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600',
    duration: 5,
  },
  {
    step: 2,
    content: '锅中放入适量油，油热后放入食材翻炒。',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
    duration: 3,
  },
  {
    step: 3,
    content: '加入调味料，继续翻炒均匀，让食材充分入味。',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600',
    duration: 5,
  },
  {
    step: 4,
    content: '转中小火，盖上锅盖焖煮几分钟。',
    image: null,
    duration: 8,
  },
  {
    step: 5,
    content: '打开锅盖，大火收汁，出锅装盘。',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    duration: 2,
  },
  {
    step: 6,
    content: '撒上葱花点缀，美味佳肴完成！',
    image: null,
    duration: 1,
  },
];

export default function CookingMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStep, setStep, exitCooking } = useCookingMode();
  const { startTimer } = useTimer();
  const [showTimer, setShowTimer] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const recipe = recipes.find((r) => r.id === Number(id));
  const steps = getRecipeSteps(Number(id));
  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];

  useEffect(() => {
    // Keep screen awake during cooking mode (if supported)
    let wakeLock: WakeLockSentinel | null = null;

    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.log('Wake Lock not supported or failed:', err);
        }
      }
    };

    requestWakeLock();

    return () => {
      wakeLock?.release();
    };
  }, []);

  // Text-to-speech for current step
  useEffect(() => {
    if (voiceEnabled && currentStepData) {
      const utterance = new SpeechSynthesisUtterance(
        `第${currentStepData.step}步：${currentStepData.content}`
      );
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }

    return () => {
      speechSynthesis.cancel();
    };
  }, [currentStep, voiceEnabled, currentStepData]);

  const handleExit = () => {
    exitCooking();
    navigate(`/recipe/${id}`);
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleStartStepTimer = () => {
    if (currentStepData?.duration) {
      startTimer(currentStepData.duration * 60, Number(id));
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">菜谱不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button onClick={handleExit} className="p-2 hover:bg-white/10 rounded-full">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="font-medium">{recipe.title}</h1>
          <p className="text-sm text-gray-400">
            步骤 {currentStep + 1} / {totalSteps}
          </p>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`p-2 rounded-full ${voiceEnabled ? 'bg-orange-500' : 'hover:bg-white/10'}`}
        >
          {voiceEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 rounded-full transition-colors ${
                index < currentStep
                  ? 'bg-orange-500'
                  : index === currentStep
                  ? 'bg-orange-400'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col p-4 pt-8">
        {/* Step Image */}
        {currentStepData?.image && (
          <div className="mb-6">
            <img
              src={currentStepData.image}
              alt={`步骤 ${currentStepData.step}`}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Step Number */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold text-lg">
            {currentStepData?.step}
          </div>
          {completedSteps.includes(currentStep) && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
        </div>

        {/* Step Content */}
        <p className="text-xl leading-relaxed mb-6">{currentStepData?.content}</p>

        {/* Step Duration */}
        {currentStepData?.duration && (
          <button
            onClick={handleStartStepTimer}
            className="flex items-center gap-2 text-orange-400 mb-6"
          >
            <Clock className="w-5 h-5" />
            <span>预计时间: {currentStepData.duration} 分钟</span>
            <span className="text-sm bg-orange-500/20 px-2 py-1 rounded-full">
              点击计时
            </span>
          </button>
        )}

        {/* Step tips could go here */}
      </div>

      {/* Navigation */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
          上一步
        </button>

        <button
          onClick={() => setShowTimer(true)}
          className="p-3 bg-orange-500 rounded-full"
        >
          <Clock className="w-6 h-6" />
        </button>

        {currentStep === totalSteps - 1 ? (
          <button
            onClick={handleExit}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 rounded-full"
          >
            完成
            <CheckCircle className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 rounded-full"
          >
            下一步
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Timer Modal */}
      {showTimer && <Timer onClose={() => setShowTimer(false)} />}
    </div>
  );
}
