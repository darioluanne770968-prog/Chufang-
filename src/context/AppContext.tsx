import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

// ==================== INTERFACES ====================

interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  recipes: number;
  likes: number;
  level: number;
  xp: number;
  joinDate: string;
}

interface Comment {
  id: number;
  recipeId: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  rating: number;
  createdAt: string;
  likes: number;
}

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  recipeId?: number;
  recipeName?: string;
}

interface CookingRecord {
  id: string;
  recipeId: number;
  recipeName: string;
  date: string;
  duration: number; // minutes
  rating?: number;
  notes?: string;
  calories?: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: number;
    lunch?: number;
    dinner?: number;
    snack?: number;
  };
}

interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate?: string;
  category: string;
  addedAt: string;
}

interface DailyNutrition {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: { recipeId: number; mealType: string }[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  target: number;
  progress: number;
  reward: number; // XP
  startDate: string;
  endDate: string;
  completed: boolean;
}

interface Reminder {
  id: string;
  type: 'meal' | 'expiry' | 'challenge';
  title: string;
  time: string;
  enabled: boolean;
  recipeId?: number;
}

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  favorites: number[];
  following: number[];
  searchHistory: string[];
  browsingHistory: number[];
  comments: Comment[];
  ratings: Record<number, number>;
  shoppingList: ShoppingItem[];
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  cookingMode: {
    active: boolean;
    recipeId: number | null;
    currentStep: number;
  };
  timer: {
    active: boolean;
    seconds: number;
    recipeId: number | null;
  };
  // New features
  cookingRecords: CookingRecord[];
  achievements: Achievement[];
  mealPlans: MealPlan[];
  pantry: PantryItem[];
  dailyNutrition: DailyNutrition[];
  challenges: Challenge[];
  reminders: Reminder[];
  completedRecipes: number[];
  streakDays: number;
  lastCookingDate: string | null;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'TOGGLE_FOLLOW'; payload: number }
  | { type: 'ADD_SEARCH_HISTORY'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'ADD_BROWSING_HISTORY'; payload: number }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'LIKE_COMMENT'; payload: number }
  | { type: 'RATE_RECIPE'; payload: { recipeId: number; rating: number } }
  | { type: 'ADD_TO_SHOPPING_LIST'; payload: ShoppingItem }
  | { type: 'REMOVE_FROM_SHOPPING_LIST'; payload: string }
  | { type: 'TOGGLE_SHOPPING_ITEM'; payload: string }
  | { type: 'CLEAR_SHOPPING_LIST' }
  | { type: 'ADD_RECIPE_INGREDIENTS'; payload: { recipeId: number; recipeName: string; ingredients: string[] } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'zh' | 'en' }
  | { type: 'START_COOKING_MODE'; payload: { recipeId: number } }
  | { type: 'EXIT_COOKING_MODE' }
  | { type: 'SET_COOKING_STEP'; payload: number }
  | { type: 'NEXT_COOKING_STEP' }
  | { type: 'PREV_COOKING_STEP' }
  | { type: 'START_TIMER'; payload: { seconds: number; recipeId?: number } }
  | { type: 'STOP_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'ADD_COOKING_RECORD'; payload: CookingRecord }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'SET_MEAL_PLAN'; payload: MealPlan }
  | { type: 'REMOVE_MEAL_PLAN'; payload: string }
  | { type: 'ADD_PANTRY_ITEM'; payload: PantryItem }
  | { type: 'UPDATE_PANTRY_ITEM'; payload: PantryItem }
  | { type: 'REMOVE_PANTRY_ITEM'; payload: string }
  | { type: 'ADD_DAILY_NUTRITION'; payload: DailyNutrition }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'UPDATE_CHALLENGE_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'COMPLETE_CHALLENGE'; payload: string }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'REMOVE_REMINDER'; payload: string }
  | { type: 'MARK_RECIPE_COMPLETED'; payload: number }
  | { type: 'UPDATE_STREAK' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

// ==================== INITIAL STATE ====================

const defaultAchievements: Achievement[] = [
  { id: 'first_dish', name: '初出茅庐', description: '完成第一道菜', icon: '🍳', target: 1, progress: 0 },
  { id: 'ten_dishes', name: '小有名气', description: '完成10道菜', icon: '👨‍🍳', target: 10, progress: 0 },
  { id: 'fifty_dishes', name: '厨艺精湛', description: '完成50道菜', icon: '🏆', target: 50, progress: 0 },
  { id: 'hundred_dishes', name: '大师级厨神', description: '完成100道菜', icon: '👑', target: 100, progress: 0 },
  { id: 'streak_7', name: '坚持不懈', description: '连续7天做饭', icon: '🔥', target: 7, progress: 0 },
  { id: 'streak_30', name: '习惯养成', description: '连续30天做饭', icon: '💪', target: 30, progress: 0 },
  { id: 'early_bird', name: '早起的鸟儿', description: '早上7点前开始做早餐', icon: '🌅', target: 1, progress: 0 },
  { id: 'night_owl', name: '深夜食堂', description: '晚上10点后做宵夜', icon: '🌙', target: 1, progress: 0 },
  { id: 'five_star', name: '完美主义', description: '获得5星评价10次', icon: '⭐', target: 10, progress: 0 },
  { id: 'collector', name: '收藏家', description: '收藏50道菜谱', icon: '📚', target: 50, progress: 0 },
  { id: 'social', name: '社交达人', description: '发表50条评论', icon: '💬', target: 50, progress: 0 },
  { id: 'planner', name: '计划通', description: '制定一周菜单', icon: '📅', target: 7, progress: 0 },
];

const defaultChallenges: Challenge[] = [
  {
    id: 'daily_cook',
    title: '今日主厨',
    description: '今天完成一道菜',
    type: 'daily',
    target: 1,
    progress: 0,
    reward: 50,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 'weekly_variety',
    title: '多样化饮食',
    description: '本周尝试5种不同的菜',
    type: 'weekly',
    target: 5,
    progress: 0,
    reward: 200,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
  },
];

const initialState: AppState = {
  user: {
    id: 1,
    name: '厨房小达人',
    avatar: 'https://i.pravatar.cc/100?img=33',
    bio: '热爱美食的生活家',
    followers: 1200,
    following: 128,
    recipes: 12,
    likes: 3400,
    level: 1,
    xp: 0,
    joinDate: new Date().toISOString(),
  },
  isLoggedIn: true,
  favorites: [],
  following: [],
  searchHistory: [],
  browsingHistory: [],
  comments: [],
  ratings: {},
  shoppingList: [],
  theme: 'light',
  language: 'zh',
  cookingMode: {
    active: false,
    recipeId: null,
    currentStep: 0,
  },
  timer: {
    active: false,
    seconds: 0,
    recipeId: null,
  },
  cookingRecords: [],
  achievements: defaultAchievements,
  mealPlans: [],
  pantry: [],
  dailyNutrition: [],
  challenges: defaultChallenges,
  reminders: [],
  completedRecipes: [],
  streakDays: 0,
  lastCookingDate: null,
};

// ==================== HELPER FUNCTIONS ====================

function calculateLevel(xp: number): number {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function getXpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

// ==================== REDUCER ====================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    case 'UPDATE_USER':
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state;
    case 'ADD_XP':
      if (!state.user) return state;
      const newXp = state.user.xp + action.payload;
      const newLevel = calculateLevel(newXp);
      return {
        ...state,
        user: { ...state.user, xp: newXp, level: newLevel },
      };
    case 'TOGGLE_FAVORITE':
      const newFavorites = state.favorites.includes(action.payload)
        ? state.favorites.filter((id) => id !== action.payload)
        : [...state.favorites, action.payload];
      return { ...state, favorites: newFavorites };
    case 'TOGGLE_FOLLOW':
      return {
        ...state,
        following: state.following.includes(action.payload)
          ? state.following.filter((id) => id !== action.payload)
          : [...state.following, action.payload],
      };
    case 'ADD_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [
          action.payload,
          ...state.searchHistory.filter((s) => s !== action.payload),
        ].slice(0, 20),
      };
    case 'CLEAR_SEARCH_HISTORY':
      return { ...state, searchHistory: [] };
    case 'ADD_BROWSING_HISTORY':
      return {
        ...state,
        browsingHistory: [
          action.payload,
          ...state.browsingHistory.filter((id) => id !== action.payload),
        ].slice(0, 50),
      };
    case 'ADD_COMMENT':
      return { ...state, comments: [...state.comments, action.payload] };
    case 'LIKE_COMMENT':
      return {
        ...state,
        comments: state.comments.map((c) =>
          c.id === action.payload ? { ...c, likes: c.likes + 1 } : c
        ),
      };
    case 'RATE_RECIPE':
      return {
        ...state,
        ratings: { ...state.ratings, [action.payload.recipeId]: action.payload.rating },
      };
    case 'ADD_TO_SHOPPING_LIST':
      return { ...state, shoppingList: [...state.shoppingList, action.payload] };
    case 'REMOVE_FROM_SHOPPING_LIST':
      return {
        ...state,
        shoppingList: state.shoppingList.filter((item) => item.id !== action.payload),
      };
    case 'TOGGLE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingList: state.shoppingList.map((item) =>
          item.id === action.payload ? { ...item, checked: !item.checked } : item
        ),
      };
    case 'CLEAR_SHOPPING_LIST':
      return { ...state, shoppingList: [] };
    case 'ADD_RECIPE_INGREDIENTS':
      const newItems: ShoppingItem[] = action.payload.ingredients.map((ing, idx) => ({
        id: `${action.payload.recipeId}-${idx}-${Date.now()}`,
        name: ing,
        checked: false,
        recipeId: action.payload.recipeId,
        recipeName: action.payload.recipeName,
      }));
      return { ...state, shoppingList: [...state.shoppingList, ...newItems] };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'START_COOKING_MODE':
      return {
        ...state,
        cookingMode: { active: true, recipeId: action.payload.recipeId, currentStep: 0 },
      };
    case 'EXIT_COOKING_MODE':
      return { ...state, cookingMode: { active: false, recipeId: null, currentStep: 0 } };
    case 'SET_COOKING_STEP':
      return { ...state, cookingMode: { ...state.cookingMode, currentStep: action.payload } };
    case 'NEXT_COOKING_STEP':
      return {
        ...state,
        cookingMode: { ...state.cookingMode, currentStep: state.cookingMode.currentStep + 1 },
      };
    case 'PREV_COOKING_STEP':
      return {
        ...state,
        cookingMode: {
          ...state.cookingMode,
          currentStep: Math.max(0, state.cookingMode.currentStep - 1),
        },
      };
    case 'START_TIMER':
      return {
        ...state,
        timer: { active: true, seconds: action.payload.seconds, recipeId: action.payload.recipeId || null },
      };
    case 'STOP_TIMER':
      return { ...state, timer: { active: false, seconds: 0, recipeId: null } };
    case 'TICK_TIMER':
      if (state.timer.seconds <= 1) {
        return { ...state, timer: { active: false, seconds: 0, recipeId: null } };
      }
      return { ...state, timer: { ...state.timer, seconds: state.timer.seconds - 1 } };
    case 'ADD_COOKING_RECORD':
      return { ...state, cookingRecords: [action.payload, ...state.cookingRecords] };
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map((a) =>
          a.id === action.payload && !a.unlockedAt
            ? { ...a, unlockedAt: new Date().toISOString() }
            : a
        ),
      };
    case 'UPDATE_ACHIEVEMENT_PROGRESS':
      return {
        ...state,
        achievements: state.achievements.map((a) =>
          a.id === action.payload.id ? { ...a, progress: action.payload.progress } : a
        ),
      };
    case 'SET_MEAL_PLAN':
      const existingPlanIndex = state.mealPlans.findIndex((p) => p.date === action.payload.date);
      if (existingPlanIndex >= 0) {
        const newPlans = [...state.mealPlans];
        newPlans[existingPlanIndex] = action.payload;
        return { ...state, mealPlans: newPlans };
      }
      return { ...state, mealPlans: [...state.mealPlans, action.payload] };
    case 'REMOVE_MEAL_PLAN':
      return { ...state, mealPlans: state.mealPlans.filter((p) => p.id !== action.payload) };
    case 'ADD_PANTRY_ITEM':
      return { ...state, pantry: [...state.pantry, action.payload] };
    case 'UPDATE_PANTRY_ITEM':
      return {
        ...state,
        pantry: state.pantry.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_PANTRY_ITEM':
      return { ...state, pantry: state.pantry.filter((item) => item.id !== action.payload) };
    case 'ADD_DAILY_NUTRITION':
      const existingNutritionIndex = state.dailyNutrition.findIndex(
        (n) => n.date === action.payload.date
      );
      if (existingNutritionIndex >= 0) {
        const newNutrition = [...state.dailyNutrition];
        const existing = newNutrition[existingNutritionIndex];
        newNutrition[existingNutritionIndex] = {
          ...existing,
          calories: existing.calories + action.payload.calories,
          protein: existing.protein + action.payload.protein,
          carbs: existing.carbs + action.payload.carbs,
          fat: existing.fat + action.payload.fat,
          meals: [...existing.meals, ...action.payload.meals],
        };
        return { ...state, dailyNutrition: newNutrition };
      }
      return { ...state, dailyNutrition: [...state.dailyNutrition, action.payload] };
    case 'ADD_CHALLENGE':
      return { ...state, challenges: [...state.challenges, action.payload] };
    case 'UPDATE_CHALLENGE_PROGRESS':
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.payload.id ? { ...c, progress: action.payload.progress } : c
        ),
      };
    case 'COMPLETE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.payload ? { ...c, completed: true } : c
        ),
      };
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'REMOVE_REMINDER':
      return { ...state, reminders: state.reminders.filter((r) => r.id !== action.payload) };
    case 'MARK_RECIPE_COMPLETED':
      if (state.completedRecipes.includes(action.payload)) {
        return state;
      }
      return { ...state, completedRecipes: [...state.completedRecipes, action.payload] };
    case 'UPDATE_STREAK':
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      if (state.lastCookingDate === today) {
        return state;
      }
      if (state.lastCookingDate === yesterday) {
        return { ...state, streakDays: state.streakDays + 1, lastCookingDate: today };
      }
      return { ...state, streakDays: 1, lastCookingDate: today };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// ==================== CONTEXT ====================

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const STORAGE_KEY = 'chufang_app_state_v2';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
  }, []);

  useEffect(() => {
    try {
      const toSave = { ...state };
      delete (toSave as Partial<AppState>).cookingMode;
      delete (toSave as Partial<AppState>).timer;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// ==================== HOOKS ====================

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export function useUser() {
  const { state, dispatch } = useApp();
  return {
    user: state.user,
    isLoggedIn: state.isLoggedIn,
    login: (user: User) => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    updateUser: (data: Partial<User>) => dispatch({ type: 'UPDATE_USER', payload: data }),
    addXp: (amount: number) => dispatch({ type: 'ADD_XP', payload: amount }),
    getXpForNextLevel: () => state.user ? getXpForLevel(state.user.level + 1) : 100,
    getXpProgress: () => {
      if (!state.user) return 0;
      const currentLevelXp = getXpForLevel(state.user.level);
      const nextLevelXp = getXpForLevel(state.user.level + 1);
      return ((state.user.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    },
  };
}

export function useFavorites() {
  const { state, dispatch } = useApp();
  return {
    favorites: state.favorites,
    isFavorite: (id: number) => state.favorites.includes(id),
    toggleFavorite: (id: number) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id }),
  };
}

export function useFollowing() {
  const { state, dispatch } = useApp();
  return {
    following: state.following,
    isFollowing: (id: number) => state.following.includes(id),
    toggleFollow: (id: number) => dispatch({ type: 'TOGGLE_FOLLOW', payload: id }),
  };
}

export function useSearchHistory() {
  const { state, dispatch } = useApp();
  return {
    history: state.searchHistory,
    addSearch: (query: string) => dispatch({ type: 'ADD_SEARCH_HISTORY', payload: query }),
    clearHistory: () => dispatch({ type: 'CLEAR_SEARCH_HISTORY' }),
  };
}

export function useBrowsingHistory() {
  const { state, dispatch } = useApp();
  return {
    history: state.browsingHistory,
    addToHistory: (id: number) => dispatch({ type: 'ADD_BROWSING_HISTORY', payload: id }),
  };
}

export function useComments() {
  const { state, dispatch } = useApp();
  return {
    comments: state.comments,
    getRecipeComments: (recipeId: number) => state.comments.filter((c) => c.recipeId === recipeId),
    addComment: (comment: Comment) => dispatch({ type: 'ADD_COMMENT', payload: comment }),
    likeComment: (id: number) => dispatch({ type: 'LIKE_COMMENT', payload: id }),
  };
}

export function useRatings() {
  const { state, dispatch } = useApp();
  return {
    ratings: state.ratings,
    getRating: (recipeId: number) => state.ratings[recipeId] || 0,
    rateRecipe: (recipeId: number, rating: number) =>
      dispatch({ type: 'RATE_RECIPE', payload: { recipeId, rating } }),
  };
}

export function useShoppingList() {
  const { state, dispatch } = useApp();
  return {
    items: state.shoppingList,
    addItem: (item: ShoppingItem) => dispatch({ type: 'ADD_TO_SHOPPING_LIST', payload: item }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_FROM_SHOPPING_LIST', payload: id }),
    toggleItem: (id: string) => dispatch({ type: 'TOGGLE_SHOPPING_ITEM', payload: id }),
    clearList: () => dispatch({ type: 'CLEAR_SHOPPING_LIST' }),
    addRecipeIngredients: (recipeId: number, recipeName: string, ingredients: string[]) =>
      dispatch({ type: 'ADD_RECIPE_INGREDIENTS', payload: { recipeId, recipeName, ingredients } }),
  };
}

export function useTheme() {
  const { state, dispatch } = useApp();
  return {
    theme: state.theme,
    isDark: state.theme === 'dark',
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setTheme: (theme: 'light' | 'dark') => dispatch({ type: 'SET_THEME', payload: theme }),
  };
}

export function useLanguage() {
  const { state, dispatch } = useApp();
  return {
    language: state.language,
    setLanguage: (lang: 'zh' | 'en') => dispatch({ type: 'SET_LANGUAGE', payload: lang }),
  };
}

export function useCookingMode() {
  const { state, dispatch } = useApp();
  return {
    ...state.cookingMode,
    startCooking: (recipeId: number) => dispatch({ type: 'START_COOKING_MODE', payload: { recipeId } }),
    exitCooking: () => dispatch({ type: 'EXIT_COOKING_MODE' }),
    setStep: (step: number) => dispatch({ type: 'SET_COOKING_STEP', payload: step }),
    nextStep: () => dispatch({ type: 'NEXT_COOKING_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_COOKING_STEP' }),
  };
}

export function useTimer() {
  const { state, dispatch } = useApp();
  return {
    ...state.timer,
    startTimer: (seconds: number, recipeId?: number) =>
      dispatch({ type: 'START_TIMER', payload: { seconds, recipeId } }),
    stopTimer: () => dispatch({ type: 'STOP_TIMER' }),
    tick: () => dispatch({ type: 'TICK_TIMER' }),
  };
}

export function useCookingRecords() {
  const { state, dispatch } = useApp();
  return {
    records: state.cookingRecords,
    addRecord: (record: CookingRecord) => {
      dispatch({ type: 'ADD_COOKING_RECORD', payload: record });
      dispatch({ type: 'MARK_RECIPE_COMPLETED', payload: record.recipeId });
      dispatch({ type: 'UPDATE_STREAK' });
      dispatch({ type: 'ADD_XP', payload: 25 });
    },
    getTotalCookingTime: () => state.cookingRecords.reduce((acc, r) => acc + r.duration, 0),
    getTotalDishes: () => state.cookingRecords.length,
    getRecentRecords: (days: number) => {
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      return state.cookingRecords.filter((r) => r.date >= cutoff);
    },
  };
}

export function useAchievements() {
  const { state, dispatch } = useApp();
  return {
    achievements: state.achievements,
    unlockedAchievements: state.achievements.filter((a) => a.unlockedAt),
    lockedAchievements: state.achievements.filter((a) => !a.unlockedAt),
    unlockAchievement: (id: string) => {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id });
      dispatch({ type: 'ADD_XP', payload: 100 });
    },
    updateProgress: (id: string, progress: number) =>
      dispatch({ type: 'UPDATE_ACHIEVEMENT_PROGRESS', payload: { id, progress } }),
    checkAndUnlock: (id: string) => {
      const achievement = state.achievements.find((a) => a.id === id);
      if (achievement && !achievement.unlockedAt && achievement.progress && achievement.target) {
        if (achievement.progress >= achievement.target) {
          dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: id });
          dispatch({ type: 'ADD_XP', payload: 100 });
        }
      }
    },
  };
}

export function useMealPlans() {
  const { state, dispatch } = useApp();
  return {
    plans: state.mealPlans,
    getPlanForDate: (date: string) => state.mealPlans.find((p) => p.date === date),
    setPlan: (plan: MealPlan) => dispatch({ type: 'SET_MEAL_PLAN', payload: plan }),
    removePlan: (id: string) => dispatch({ type: 'REMOVE_MEAL_PLAN', payload: id }),
    getWeekPlans: (startDate: Date) => {
      const plans: MealPlan[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const existing = state.mealPlans.find((p) => p.date === dateStr);
        plans.push(existing || { id: dateStr, date: dateStr, meals: {} });
      }
      return plans;
    },
  };
}

export function usePantry() {
  const { state, dispatch } = useApp();
  return {
    items: state.pantry,
    addItem: (item: PantryItem) => dispatch({ type: 'ADD_PANTRY_ITEM', payload: item }),
    updateItem: (item: PantryItem) => dispatch({ type: 'UPDATE_PANTRY_ITEM', payload: item }),
    removeItem: (id: string) => dispatch({ type: 'REMOVE_PANTRY_ITEM', payload: id }),
    getExpiringItems: (days: number) => {
      const cutoff = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return state.pantry.filter((item) => item.expiryDate && item.expiryDate <= cutoff);
    },
    getByCategory: (category: string) => state.pantry.filter((item) => item.category === category),
  };
}

export function useNutrition() {
  const { state, dispatch } = useApp();
  return {
    records: state.dailyNutrition,
    addNutrition: (data: DailyNutrition) => dispatch({ type: 'ADD_DAILY_NUTRITION', payload: data }),
    getTodayNutrition: () => {
      const today = new Date().toISOString().split('T')[0];
      return state.dailyNutrition.find((n) => n.date === today) || {
        date: today,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        meals: [],
      };
    },
    getWeekNutrition: () => {
      const result: DailyNutrition[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const existing = state.dailyNutrition.find((n) => n.date === date);
        result.push(existing || { date, calories: 0, protein: 0, carbs: 0, fat: 0, meals: [] });
      }
      return result;
    },
  };
}

export function useChallenges() {
  const { state, dispatch } = useApp();
  return {
    challenges: state.challenges,
    activeChallenges: state.challenges.filter((c) => !c.completed),
    completedChallenges: state.challenges.filter((c) => c.completed),
    updateProgress: (id: string, progress: number) => {
      dispatch({ type: 'UPDATE_CHALLENGE_PROGRESS', payload: { id, progress } });
      const challenge = state.challenges.find((c) => c.id === id);
      if (challenge && progress >= challenge.target && !challenge.completed) {
        dispatch({ type: 'COMPLETE_CHALLENGE', payload: id });
        dispatch({ type: 'ADD_XP', payload: challenge.reward });
      }
    },
    addChallenge: (challenge: Challenge) => dispatch({ type: 'ADD_CHALLENGE', payload: challenge }),
  };
}

export function useReminders() {
  const { state, dispatch } = useApp();
  return {
    reminders: state.reminders,
    addReminder: (reminder: Reminder) => dispatch({ type: 'ADD_REMINDER', payload: reminder }),
    updateReminder: (reminder: Reminder) => dispatch({ type: 'UPDATE_REMINDER', payload: reminder }),
    removeReminder: (id: string) => dispatch({ type: 'REMOVE_REMINDER', payload: id }),
    getMealReminders: () => state.reminders.filter((r) => r.type === 'meal'),
    getExpiryReminders: () => state.reminders.filter((r) => r.type === 'expiry'),
  };
}

export function useStats() {
  const { state } = useApp();
  return {
    totalDishes: state.cookingRecords.length,
    totalCookingTime: state.cookingRecords.reduce((acc, r) => acc + r.duration, 0),
    favoriteCount: state.favorites.length,
    streakDays: state.streakDays,
    completedRecipes: state.completedRecipes.length,
    averageRating: Object.values(state.ratings).length > 0
      ? Object.values(state.ratings).reduce((a, b) => a + b, 0) / Object.values(state.ratings).length
      : 0,
  };
}
