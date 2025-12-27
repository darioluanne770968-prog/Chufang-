import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  recipes: number;
  likes: number;
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
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
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
  | { type: 'START_COOKING_MODE'; payload: { recipeId: number } }
  | { type: 'EXIT_COOKING_MODE' }
  | { type: 'SET_COOKING_STEP'; payload: number }
  | { type: 'NEXT_COOKING_STEP' }
  | { type: 'PREV_COOKING_STEP' }
  | { type: 'START_TIMER'; payload: { seconds: number; recipeId?: number } }
  | { type: 'STOP_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> };

const initialState: AppState = {
  user: null,
  isLoggedIn: false,
  favorites: [],
  following: [],
  searchHistory: [],
  browsingHistory: [],
  comments: [],
  ratings: {},
  shoppingList: [],
  theme: 'light',
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
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    case 'UPDATE_USER':
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state;
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      };
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
      return {
        ...state,
        shoppingList: [...state.shoppingList, action.payload],
      };
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
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const STORAGE_KEY = 'chufang_app_state';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
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

  // Save state to localStorage on change
  useEffect(() => {
    try {
      const toSave = {
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        favorites: state.favorites,
        following: state.following,
        searchHistory: state.searchHistory,
        browsingHistory: state.browsingHistory,
        comments: state.comments,
        ratings: state.ratings,
        shoppingList: state.shoppingList,
        theme: state.theme,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state.user, state.isLoggedIn, state.favorites, state.following, state.searchHistory, state.browsingHistory, state.comments, state.ratings, state.shoppingList, state.theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

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
