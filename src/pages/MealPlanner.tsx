import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Plus, ChevronLeft, ChevronRight, X, Clock, Flame } from 'lucide-react';
import { useMealPlans } from '../context/AppContext';
import { recipes } from '../data/recipes';

const mealTypes = [
  { id: 'breakfast', label: '早餐', icon: '🌅', time: '07:00-09:00' },
  { id: 'lunch', label: '午餐', icon: '☀️', time: '11:30-13:00' },
  { id: 'dinner', label: '晚餐', icon: '🌙', time: '18:00-20:00' },
  { id: 'snack', label: '加餐', icon: '🍎', time: '随时' },
];

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

interface SimpleMealPlan {
  id: string;
  date: string;
  mealType: string;
  recipeId: number;
  recipeName: string;
}

export default function MealPlanner() {
  const navigate = useNavigate();
  const { getWeekPlans } = useMealPlans();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showRecipePicker, setShowRecipePicker] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [simplePlans, setSimplePlans] = useState<SimpleMealPlan[]>([]);

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  // Using local state for simplicity instead of context
  void getWeekPlans;

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const isToday = (date: Date) => formatDate(date) === formatDate(new Date());

  const getMealsForDate = (date: Date, mealType: string) => {
    const dateStr = formatDate(date);
    return simplePlans.filter(
      (plan) => plan.date === dateStr && plan.mealType === mealType
    );
  };

  const handleAddMeal = (date: string, mealType: string) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setShowRecipePicker(true);
  };

  const handleSelectRecipe = (recipeId: number) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (recipe) {
      const newPlan: SimpleMealPlan = {
        id: `${selectedDate}-${selectedMealType}-${recipeId}`,
        date: selectedDate,
        mealType: selectedMealType,
        recipeId: recipe.id,
        recipeName: recipe.title,
      };
      setSimplePlans((prev) => [...prev, newPlan]);
    }
    setShowRecipePicker(false);
  };

  const handleRemoveMeal = (planId: string) => {
    setSimplePlans((prev) => prev.filter((p) => p.id !== planId));
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const totalCalories = simplePlans.reduce((sum: number, _plan: SimpleMealPlan) => {
    // Estimate 300 calories per meal
    return sum + 300;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-500 to-teal-500 px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">周计划</h1>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 bg-white/20 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-center">
            <p className="text-white font-medium">
              {weekDates[0].toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} -
              {weekDates[6].toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
            </p>
            <p className="text-white/70 text-sm">{currentDate.getFullYear()}年</p>
          </div>
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 bg-white/20 rounded-full"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Week Summary */}
      <div className="mx-4 -mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">本周计划</p>
              <p className="text-sm text-gray-500">{simplePlans.length} 餐</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="w-4 h-4" />
            <span className="text-sm">{totalCalories} 千卡</span>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="px-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDates.map((date, index) => (
            <div
              key={index}
              className={`text-center py-2 rounded-lg ${
                isToday(date)
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <p className="text-xs">{weekDays[index]}</p>
              <p className="font-medium">{date.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Meal Type Rows */}
        {mealTypes.map((mealType) => (
          <div key={mealType.id} className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span>{mealType.icon}</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mealType.label}
              </span>
              <span className="text-xs text-gray-400">{mealType.time}</span>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekDates.map((date, index) => {
                const meals = getMealsForDate(date, mealType.id);
                return (
                  <div
                    key={index}
                    className="min-h-[60px] bg-white dark:bg-gray-800 rounded-lg p-1 relative"
                  >
                    {meals.map((meal) => (
                      <div
                        key={meal.id}
                        className="bg-green-100 dark:bg-green-900/30 rounded p-1 mb-1 relative group"
                      >
                        <p className="text-xs text-green-700 dark:text-green-300 truncate">
                          {meal.recipeName}
                        </p>
                        <button
                          onClick={() => handleRemoveMeal(meal.id)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddMeal(formatDate(date), mealType.id)}
                      className="w-full h-6 border border-dashed border-gray-200 dark:border-gray-700 rounded flex items-center justify-center hover:border-green-500 hover:text-green-500 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Picker Modal */}
      {showRecipePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-h-[70vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">选择菜谱</h3>
              <button onClick={() => setShowRecipePicker(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh] p-4">
              <div className="grid grid-cols-2 gap-3">
                {recipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handleSelectRecipe(recipe.id)}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {recipe.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.cookTime}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
