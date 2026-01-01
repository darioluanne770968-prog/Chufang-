import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Classroom from './pages/Classroom';
import Create from './pages/Create';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import RecipeDetail from './pages/RecipeDetail';
import Search from './pages/Search';
import ShoppingList from './pages/ShoppingList';
import History from './pages/History';
import Settings from './pages/Settings';
import CookingMode from './pages/CookingMode';
import Statistics from './pages/Statistics';
import Achievements from './pages/Achievements';
import Challenges from './pages/Challenges';
import MealPlanner from './pages/MealPlanner';
import Pantry from './pages/Pantry';
import IngredientSearch from './pages/IngredientSearch';
import Social from './pages/Social';
import VideoTutorials from './pages/VideoTutorials';
import WinePairing from './pages/WinePairing';
import CookingTips from './pages/CookingTips';
import BottomNav from './components/BottomNav';

// Routes where bottom nav should be hidden
const hideBottomNavRoutes = ['/cooking', '/search'];

function AppContent() {
  const location = useLocation();
  const shouldHideBottomNav = hideBottomNavRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white dark:bg-gray-900 min-h-screen relative shadow-2xl">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/create" element={<Create />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cooking/:id" element={<CookingMode />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/pantry" element={<Pantry />} />
        <Route path="/ingredient-search" element={<IngredientSearch />} />
        <Route path="/social" element={<Social />} />
        <Route path="/video-tutorials" element={<VideoTutorials />} />
        <Route path="/wine-pairing" element={<WinePairing />} />
        <Route path="/wine-pairing/:recipeId" element={<WinePairing />} />
        <Route path="/cooking-tips" element={<CookingTips />} />
      </Routes>
      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
