import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Eye,
  Heart,
  Bookmark,
  Filter,
  Search,
  ChevronRight,
  Star,
  Award
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedCard } from '../components/ui/AnimatedCard';

interface VideoTutorial {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  chef: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  category: string;
  difficulty: '初级' | '中级' | '高级';
  isNew: boolean;
  isFeatured: boolean;
}

const categories = [
  { id: 'all', label: '全部', emoji: '🍳' },
  { id: 'basic', label: '基础刀工', emoji: '🔪' },
  { id: 'sauce', label: '酱料制作', emoji: '🫙' },
  { id: 'technique', label: '烹饪技巧', emoji: '👨‍🍳' },
  { id: 'baking', label: '烘焙技术', emoji: '🧁' },
  { id: 'plating', label: '摆盘艺术', emoji: '🍽️' },
];

const mockVideos: VideoTutorial[] = [
  {
    id: '1',
    title: '10分钟学会切菜基本功：切丝、切片、切丁',
    thumbnail: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400',
    duration: '10:32',
    views: 125000,
    likes: 8900,
    chef: { name: '刀工大师老陈', avatar: 'https://i.pravatar.cc/100?img=12', verified: true },
    category: 'basic',
    difficulty: '初级',
    isNew: false,
    isFeatured: true
  },
  {
    id: '2',
    title: '秘制红烧酱汁配方：一酱多用',
    thumbnail: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400',
    duration: '8:45',
    views: 89000,
    likes: 6200,
    chef: { name: '酱料达人小王', avatar: 'https://i.pravatar.cc/100?img=33', verified: true },
    category: 'sauce',
    difficulty: '初级',
    isNew: true,
    isFeatured: false
  },
  {
    id: '3',
    title: '炒菜火候掌握：从小火到爆炒',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    duration: '15:20',
    views: 156000,
    likes: 12300,
    chef: { name: '中华厨神', avatar: 'https://i.pravatar.cc/100?img=45', verified: true },
    category: 'technique',
    difficulty: '中级',
    isNew: false,
    isFeatured: true
  },
  {
    id: '4',
    title: '法式马卡龙制作全攻略',
    thumbnail: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400',
    duration: '22:10',
    views: 78000,
    likes: 5600,
    chef: { name: '甜品女王', avatar: 'https://i.pravatar.cc/100?img=44', verified: true },
    category: 'baking',
    difficulty: '高级',
    isNew: true,
    isFeatured: false
  },
  {
    id: '5',
    title: '米其林级摆盘技巧：让家常菜变高级',
    thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
    duration: '12:55',
    views: 234000,
    likes: 18900,
    chef: { name: '米其林主厨Jack', avatar: 'https://i.pravatar.cc/100?img=56', verified: true },
    category: 'plating',
    difficulty: '高级',
    isNew: false,
    isFeatured: true
  },
  {
    id: '6',
    title: '蛋糕裱花基础：玫瑰花造型教程',
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    duration: '18:30',
    views: 92000,
    likes: 7800,
    chef: { name: '烘焙小公主', avatar: 'https://i.pravatar.cc/100?img=32', verified: false },
    category: 'baking',
    difficulty: '中级',
    isNew: true,
    isFeatured: false
  },
];

export default function VideoTutorials() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = mockVideos.filter(video => {
    if (selectedCategory !== 'all' && video.category !== selectedCategory) return false;
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const featuredVideos = mockVideos.filter(v => v.isFeatured);

  const formatViews = (views: number) => {
    if (views >= 10000) return (views / 10000).toFixed(1) + '万';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'k';
    return views.toString();
  };

  const difficultyColor = {
    '初级': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    '中级': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
    '高级': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-600 px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">视频教程</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索教程..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-xl border border-white/20 focus:outline-none focus:bg-white/30"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 -mt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow'
              }`}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      {selectedCategory === 'all' && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              精选教程
            </h3>
            <button className="text-sm text-purple-500 flex items-center">
              更多 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {featuredVideos.map((video, idx) => (
              <AnimatedCard key={video.id} delay={idx * 100}>
                <div className="flex-shrink-0 w-72 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-medium line-clamp-2">{video.title}</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-xs text-white">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-purple-600 ml-0.5" />
                      </div>
                    </div>
                    {video.isFeatured && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-0.5 rounded text-xs text-white flex items-center gap-1">
                        <Award className="w-3 h-3" /> 精选
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <img src={video.chef.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">{video.chef.name}</span>
                      {video.chef.verified && (
                        <span className="text-xs text-purple-500">✓</span>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      )}

      {/* Video List */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {selectedCategory === 'all' ? '全部教程' : categories.find(c => c.id === selectedCategory)?.label}
          </h3>
          <button className="text-gray-500 dark:text-gray-400">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {filteredVideos.map((video, idx) => (
          <AnimatedCard key={video.id} delay={idx * 50}>
            <GlassCard className="overflow-hidden" hover>
              <div className="flex gap-3 p-3">
                <div className="relative w-36 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-xs text-white">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  {video.isNew && (
                    <div className="absolute top-1 left-1 bg-red-500 px-1.5 py-0.5 rounded text-xs text-white">
                      NEW
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyColor[video.difficulty]}`}>
                      {video.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <img src={video.chef.avatar} alt="" className="w-4 h-4 rounded-full" />
                    <span>{video.chef.name}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatViews(video.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5" />
                      {formatViews(video.likes)}
                    </span>
                  </div>
                </div>

                <button className="self-start p-1.5 text-gray-400 hover:text-yellow-500">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
