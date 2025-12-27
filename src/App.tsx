import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Classroom from './pages/Classroom';
import Create from './pages/Create';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import RecipeDetail from './pages/RecipeDetail';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="max-w-lg mx-auto bg-white min-h-screen relative shadow-xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/create" element={<Create />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
