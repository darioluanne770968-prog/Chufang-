import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  UserCheck,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  TrendingUp,
  Users,
  Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedCard, StaggerContainer } from '../components/ui/AnimatedCard';
import { recipes } from '../data/recipes';

interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  content: string;
  images: string[];
  recipeId?: number;
  recipeName?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  tags: string[];
}

interface ChefUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  followers: number;
  recipes: number;
  isFollowing: boolean;
  speciality: string;
}

const mockPosts: FeedPost[] = [
  {
    id: '1',
    userId: 'chef1',
    userName: '厨艺大师小明',
    userAvatar: 'https://i.pravatar.cc/100?img=11',
    userLevel: 28,
    content: '今天尝试了一道创新川菜，麻辣鲜香，家人都说好吃！分享一下我的心得：辣椒一定要先过油才能香~',
    images: [recipes[0].image],
    recipeId: recipes[0].id,
    recipeName: recipes[0].title,
    likes: 328,
    comments: 45,
    shares: 12,
    isLiked: false,
    isSaved: false,
    createdAt: '2小时前',
    tags: ['川菜', '家常菜', '创新']
  },
  {
    id: '2',
    userId: 'chef2',
    userName: '健康食光',
    userAvatar: 'https://i.pravatar.cc/100?img=23',
    userLevel: 15,
    content: '减脂期也要好好吃饭！这道低卡轻食沙拉，热量只有200大卡，但是超满足~ 🥗',
    images: [recipes[1].image, recipes[2].image],
    likes: 156,
    comments: 23,
    shares: 8,
    isLiked: true,
    isSaved: true,
    createdAt: '5小时前',
    tags: ['减脂餐', '健康饮食', '轻食']
  },
  {
    id: '3',
    userId: 'chef3',
    userName: '烘焙小公主',
    userAvatar: 'https://i.pravatar.cc/100?img=32',
    userLevel: 22,
    content: '周末烘焙日常 🍰 做了一个抹茶芝士蛋糕，朋友们都抢着要配方！',
    images: [recipes[3].image],
    likes: 512,
    comments: 89,
    shares: 34,
    isLiked: false,
    isSaved: false,
    createdAt: '昨天',
    tags: ['烘焙', '蛋糕', '抹茶']
  },
];

const recommendedChefs: ChefUser[] = [
  {
    id: 'c1',
    name: '川菜王子',
    avatar: 'https://i.pravatar.cc/100?img=15',
    level: 35,
    followers: 12500,
    recipes: 86,
    isFollowing: false,
    speciality: '川菜'
  },
  {
    id: 'c2',
    name: '日料达人',
    avatar: 'https://i.pravatar.cc/100?img=22',
    level: 42,
    followers: 28000,
    recipes: 124,
    isFollowing: true,
    speciality: '日本料理'
  },
  {
    id: 'c3',
    name: '甜品女王',
    avatar: 'https://i.pravatar.cc/100?img=44',
    level: 38,
    followers: 45000,
    recipes: 156,
    isFollowing: false,
    speciality: '烘焙甜点'
  },
];

export default function Social() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'feed' | 'trending' | 'following'>('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [chefs, setChefs] = useState(recommendedChefs);

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handleFollow = (chefId: string) => {
    setChefs(prev =>
      prev.map(chef =>
        chef.id === chefId
          ? { ...chef, isFollowing: !chef.isFollowing, followers: chef.isFollowing ? chef.followers - 1 : chef.followers + 1 }
          : chef
      )
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + '万';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 dark:text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">美食圈</h1>
          <button className="p-2 -mr-2 text-gray-600 dark:text-gray-400">
            <Users className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-1">
          {[
            { id: 'feed', label: '推荐', icon: Sparkles },
            { id: 'trending', label: '热门', icon: TrendingUp },
            { id: 'following', label: '关注', icon: UserCheck },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-orange-500'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Chefs */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">推荐厨师</h3>
          <button className="text-sm text-orange-500">查看更多</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {chefs.map((chef, index) => (
            <AnimatedCard key={chef.id} delay={index * 50}>
              <GlassCard className="flex-shrink-0 w-32 p-3 text-center" hover>
                <div className="relative inline-block">
                  <img
                    src={chef.avatar}
                    alt={chef.name}
                    className="w-14 h-14 rounded-full mx-auto border-2 border-orange-200"
                  />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-1.5 rounded-full">
                    Lv.{chef.level}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white truncate">{chef.name}</p>
                <p className="text-xs text-gray-500 truncate">{chef.speciality}</p>
                <p className="text-xs text-gray-400 mt-1">{formatNumber(chef.followers)} 粉丝</p>
                <button
                  onClick={() => handleFollow(chef.id)}
                  className={`mt-2 w-full py-1.5 rounded-full text-xs font-medium transition-all ${
                    chef.isFollowing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {chef.isFollowing ? '已关注' : '+ 关注'}
                </button>
              </GlassCard>
            </AnimatedCard>
          ))}
        </div>
      </div>

      {/* Feed Posts */}
      <StaggerContainer className="px-4 space-y-4" staggerDelay={100}>
        {posts.map(post => (
          <GlassCard key={post.id} className="overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={post.userAvatar}
                  alt={post.userName}
                  className="w-10 h-10 rounded-full border-2 border-orange-100"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{post.userName}</span>
                    <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-xs px-1.5 py-0.5 rounded">
                      Lv.{post.userLevel}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{post.createdAt}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{post.content}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-xs text-orange-500 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            {post.images.length > 0 && (
              <div className={`grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {post.images.map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Recipe Link */}
            {post.recipeName && (
              <div
                onClick={() => post.recipeId && navigate(`/recipe/${post.recipeId}`)}
                className="mx-4 my-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{post.recipeName}</p>
                  <p className="text-xs text-gray-500">查看完整菜谱 →</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-around px-4 py-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{formatNumber(post.likes)}</span>
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button
                onClick={() => handleSave(post.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.isSaved ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
              </button>
              <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm">{post.shares}</span>
              </button>
            </div>
          </GlassCard>
        ))}
      </StaggerContainer>

      {/* Floating Create Post Button */}
      <button
        className="fixed right-4 bottom-24 w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center text-white z-30 hover:scale-110 active:scale-95 transition-transform"
        onClick={() => {}}
      >
        <span className="text-2xl font-light">+</span>
      </button>
    </div>
  );
}
