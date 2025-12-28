import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  ChefHat,
  Users,
  Star,
  MessageCircle,
  ShoppingCart,
  Play,
  Timer,
  Send,
  ThumbsUp,
  Flame,
  Minus,
  Plus,
  Printer,
  Download,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { recipes } from '../data/recipes';
import {
  useFavorites,
  useComments,
  useRatings,
  useShoppingList,
  useCookingMode,
  useBrowsingHistory,
  useFollowing,
} from '../context/AppContext';
import { formatRelativeTime, shareRecipe, calculateNutrition } from '../utils/helpers';
import TimerComponent from '../components/Timer';
import { RecipeDetailSkeleton } from '../components/Skeleton';

// Sample ingredients (in real app, would be part of recipe data)
const getIngredients = () => [
  '主料：杏鲍菇 300g',
  '生抽 2勺',
  '老抽 1勺',
  '蚝油 1勺',
  '白糖 1勺',
  '蒜末 适量',
  '干辣椒 适量',
  '花椒 适量',
  '葱花 适量',
];

// Sample steps
const getSteps = () => [
  {
    step: 1,
    content: '杏鲍菇洗净，切成细丝，尽量切得细一些，这样更容易入味。',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    step: 2,
    content: '锅中放油，油热后放入杏鲍菇丝，中小火慢慢煸炒，直到杏鲍菇变软出水。',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
  },
  {
    step: 3,
    content: '继续翻炒直到水分收干，杏鲍菇开始变得金黄。',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400',
  },
  {
    step: 4,
    content: '加入蒜末、干辣椒和花椒，翻炒出香味。',
    image: null,
  },
  {
    step: 5,
    content: '加入生抽、老抽、蚝油和白糖，翻炒均匀让杏鲍菇上色。',
    image: null,
  },
  {
    step: 6,
    content: '最后撒上葱花，翻炒几下即可出锅。',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
  },
];

// Allergen detection
const allergenKeywords: Record<string, string[]> = {
  '花生': ['花生', '花生酱', '花生油'],
  '坚果': ['核桃', '杏仁', '腰果', '开心果', '榛子'],
  '乳制品': ['牛奶', '奶油', '芝士', '奶酪', '黄油', '乳酪'],
  '麸质': ['面粉', '面条', '面包', '馒头', '小麦'],
  '海鲜': ['虾', '蟹', '鱼', '贝', '蛤', '蚝', '龙虾'],
  '鸡蛋': ['鸡蛋', '蛋黄', '蛋白', '蛋清'],
  '大豆': ['豆腐', '酱油', '豆浆', '豆瓣酱', '黄豆'],
};

// Ingredient substitutions
const substitutionMap: Record<string, { sub: string; note: string }[]> = {
  '生抽': [{ sub: '酱油', note: '味道相近' }, { sub: '味极鲜', note: '更鲜美' }],
  '老抽': [{ sub: '生抽+少许糖', note: '上色效果类似' }],
  '蚝油': [{ sub: '鲍鱼汁', note: '更高档' }, { sub: '生抽+糖', note: '简单替代' }],
  '白糖': [{ sub: '蜂蜜', note: '更健康' }, { sub: '冰糖', note: '甜味更纯' }],
  '猪肉': [{ sub: '鸡肉', note: '更低脂' }, { sub: '牛肉', note: '更有嚼劲' }],
  '牛奶': [{ sub: '豆浆', note: '乳糖不耐受适用' }, { sub: '椰奶', note: '素食替代' }],
  '鸡蛋': [{ sub: '嫩豆腐', note: '素食替代' }],
  '面粉': [{ sub: '糯米粉', note: '无麸质' }, { sub: '玉米淀粉', note: '无麸质' }],
};

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'comments'>('ingredients');
  const [servings, setServings] = useState(2);
  const [showSubstitutions, setShowSubstitutions] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { getRecipeComments, addComment, likeComment } = useComments();
  const { getRating, rateRecipe } = useRatings();
  const { addRecipeIngredients } = useShoppingList();
  const { startCooking } = useCookingMode();
  const { addToHistory } = useBrowsingHistory();
  const { isFollowing, toggleFollow } = useFollowing();

  const recipe = recipes.find((r) => r.id === Number(id));
  const baseIngredients = getIngredients();
  const steps = getSteps();
  const comments = getRecipeComments(Number(id));
  const savedRating = getRating(Number(id));
  const nutrition = calculateNutrition(baseIngredients);

  // Portion calculator: adjust ingredient quantities
  const baseServings = 2;
  const ingredients = baseIngredients.map((item) => {
    const match = item.match(/(\d+(?:\.\d+)?)\s*(g|克|ml|毫升|勺|个|只|片|根)?/);
    if (match) {
      const originalQty = parseFloat(match[1]);
      const unit = match[2] || '';
      const adjustedQty = Math.round((originalQty * servings / baseServings) * 10) / 10;
      return item.replace(match[0], `${adjustedQty}${unit}`);
    }
    return item;
  });

  // Detect allergens in ingredients
  const detectedAllergens = Object.entries(allergenKeywords)
    .filter(([_, keywords]) =>
      keywords.some((keyword) =>
        baseIngredients.some((ing) => ing.includes(keyword))
      )
    )
    .map(([allergen]) => allergen);

  // Find available substitutions
  const availableSubstitutions = baseIngredients
    .map((ing) => {
      const key = Object.keys(substitutionMap).find((k) => ing.includes(k));
      if (key) {
        return { original: key, subs: substitutionMap[key] };
      }
      return null;
    })
    .filter(Boolean) as { original: string; subs: { sub: string; note: string }[] }[];

  // Print recipe
  const handlePrint = () => {
    window.print();
  };

  // Export recipe as image (simplified version)
  const handleExport = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !recipe) return;

      canvas.width = 800;
      canvas.height = 1200;

      // Background
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, 0, canvas.width, 200);
      ctx.font = 'bold 48px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(recipe.title, 40, 120);

      // Ingredients
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#333';
      ctx.fillText('食材用料', 40, 260);
      ctx.font = '18px sans-serif';
      ingredients.forEach((ing, i) => {
        ctx.fillText(`• ${ing}`, 40, 300 + i * 30);
      });

      // Steps
      const stepsY = 320 + ingredients.length * 30;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('烹饪步骤', 40, stepsY);
      ctx.font = '18px sans-serif';
      steps.forEach((step, i) => {
        const lines = step.content.match(/.{1,40}/g) || [];
        lines.forEach((line, j) => {
          ctx.fillText(j === 0 ? `${step.step}. ${line}` : `   ${line}`, 40, stepsY + 40 + i * 80 + j * 24);
        });
      });

      // Download
      const link = document.createElement('a');
      link.download = `${recipe.title}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      alert('菜谱图片已保存！');
    } catch (error) {
      alert('导出失败，请稍后重试');
    }
  };

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [id]);

  // Add to browsing history
  useEffect(() => {
    if (id) {
      addToHistory(Number(id));
    }
  }, [id, addToHistory]);

  // Set initial rating from saved
  useEffect(() => {
    if (savedRating) {
      setUserRating(savedRating);
    }
  }, [savedRating]);

  if (loading) {
    return <RecipeDetailSkeleton />;
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">菜谱不存在</p>
      </div>
    );
  }

  const handleShare = async () => {
    const shared = await shareRecipe(
      recipe.title,
      recipe.description || '来自下厨房的美味菜谱',
      window.location.href
    );
    if (shared) {
      alert('分享成功！');
    }
  };

  const handleAddToShoppingList = () => {
    addRecipeIngredients(recipe.id, recipe.title, ingredients);
    alert('已添加到购物清单！');
  };

  const handleStartCooking = () => {
    startCooking(recipe.id);
    navigate(`/cooking/${recipe.id}`);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    addComment({
      id: Date.now(),
      recipeId: recipe.id,
      userId: 1,
      userName: '我',
      userAvatar: 'https://i.pravatar.cc/40?img=33',
      content: commentText,
      rating: userRating,
      createdAt: new Date().toISOString(),
      likes: 0,
    });

    if (userRating > 0) {
      rateRecipe(recipe.id, userRating);
    }

    setCommentText('');
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    rateRecipe(recipe.id, rating);
  };

  const isFav = isFavorite(recipe.id);
  const isFollowingAuthor = isFollowing(1); // Mock author ID

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pb-24">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-72 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/800/600?random=${recipe.id}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-black/20 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 bg-black/20 rounded-full backdrop-blur-sm"
            >
              <Printer className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 bg-black/20 rounded-full backdrop-blur-sm"
            >
              <Download className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className="p-2 bg-black/20 rounded-full backdrop-blur-sm"
            >
              <Heart
                className={`w-6 h-6 ${isFav ? 'text-red-500 fill-red-500' : 'text-white'}`}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-black/20 rounded-full backdrop-blur-sm"
            >
              <Share2 className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Title on image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white">{recipe.title}</h1>
          <p className="text-white/80 text-sm mt-1">{recipe.description}</p>
        </div>
      </div>

      {/* Author info */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={recipe.authorAvatar}
            alt={recipe.author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{recipe.author}</p>
            <p className="text-xs text-gray-400">发布于 3 天前</p>
          </div>
        </div>
        <button
          onClick={() => toggleFollow(1)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            isFollowingAuthor
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              : 'bg-orange-500 text-white'
          }`}
        >
          {isFollowingAuthor ? '已关注' : '关注'}
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 flex items-center gap-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <Clock className="w-4 h-4" />
          <span>{recipe.cookTime || '30分钟'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <ChefHat className="w-4 h-4" />
          <span>{recipe.difficulty || '简单'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
          <Users className="w-4 h-4" />
          <span>{recipe.likes?.toLocaleString() || '1234'} 人做过</span>
        </div>
      </div>

      {/* Rating */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">我的评分</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => handleRating(star)}>
                <Star
                  className={`w-6 h-6 ${
                    star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Portion Calculator */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            份量调节
          </h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setServings(Math.max(1, servings - 1))}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-lg font-bold text-orange-500 w-8 text-center">{servings}</span>
            <button
              onClick={() => setServings(servings + 1)}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-sm text-gray-500">人份</span>
          </div>
        </div>
      </div>

      {/* Allergen Warning */}
      {detectedAllergens.length > 0 && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-red-50 dark:bg-red-900/20">
          <h3 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            过敏原提醒
          </h3>
          <div className="flex flex-wrap gap-2">
            {detectedAllergens.map((allergen) => (
              <span
                key={allergen}
                className="px-2 py-1 bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400 text-xs rounded-full"
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Info */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500" />
          营养信息 (每份)
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-orange-600">{Math.round(nutrition.calories * servings / baseServings)}</p>
            <p className="text-xs text-gray-500">卡路里</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-blue-600">{Math.round(nutrition.protein * servings / baseServings)}g</p>
            <p className="text-xs text-gray-500">蛋白质</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-600">{Math.round(nutrition.carbs * servings / baseServings)}g</p>
            <p className="text-xs text-gray-500">碳水</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-yellow-600">{Math.round(nutrition.fat * servings / baseServings)}g</p>
            <p className="text-xs text-gray-500">脂肪</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        {[
          { id: 'ingredients', label: '食材', icon: ShoppingCart },
          { id: 'steps', label: '步骤', icon: ChefHat },
          { id: 'comments', label: `评论(${comments.length})`, icon: MessageCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'ingredients' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                食材用料
                <span className="text-sm font-normal text-gray-400 ml-2">({servings}人份)</span>
              </h2>
              <div className="flex items-center gap-2">
                {availableSubstitutions.length > 0 && (
                  <button
                    onClick={() => setShowSubstitutions(!showSubstitutions)}
                    className={`flex items-center gap-1 text-sm ${
                      showSubstitutions ? 'text-purple-500' : 'text-gray-400'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    替代
                  </button>
                )}
                <button
                  onClick={handleAddToShoppingList}
                  className="flex items-center gap-1 text-orange-500 text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  购物清单
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {ingredients.map((item, index) => {
                const subInfo = availableSubstitutions.find((s) => item.includes(s.original));
                return (
                  <div key={index}>
                    <div className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{item}</span>
                      {subInfo && (
                        <span className="text-xs text-purple-500">可替代</span>
                      )}
                    </div>
                    {showSubstitutions && subInfo && (
                      <div className="ml-5 py-2 pl-3 border-l-2 border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-gray-500 mb-1">可替代为：</p>
                        {subInfo.subs.map((sub, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                            <span>→ {sub.sub}</span>
                            <span className="text-xs text-gray-400">({sub.note})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">烹饪步骤</h2>
              <button
                onClick={() => setShowTimer(true)}
                className="flex items-center gap-1 text-orange-500 text-sm"
              >
                <Timer className="w-4 h-4" />
                计时器
              </button>
            </div>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.step}>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{step.step}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm flex-1 leading-relaxed">
                      {step.content}
                    </p>
                  </div>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={`Step ${step.step}`}
                      className="w-full h-48 object-cover rounded-xl mt-3 ml-9"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              评论 ({comments.length})
            </h2>

            {/* Comment Input */}
            <div className="flex gap-3 mb-6">
              <img
                src="https://i.pravatar.cc/40?img=33"
                alt="Me"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="分享你的烹饪心得..."
                  rows={2}
                  className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setUserRating(star)}>
                        <Star
                          className={`w-4 h-4 ${
                            star <= userRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400">还没有评论，快来抢沙发吧！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <img
                      src={comment.userAvatar}
                      alt={comment.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {comment.userName}
                        </span>
                        {comment.rating > 0 && (
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= comment.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                        <button
                          onClick={() => likeComment(comment.id)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          {comment.likes > 0 && comment.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3 z-40">
        <button
          onClick={handleStartCooking}
          className="flex-1 bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          开始做菜
        </button>
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className={`p-3 border rounded-full ${
            isFav
              ? 'border-red-500 text-red-500'
              : 'border-gray-200 dark:border-gray-600 text-gray-400'
          }`}
        >
          <Heart className={`w-6 h-6 ${isFav ? 'fill-red-500' : ''}`} />
        </button>
        <button
          onClick={() => setShowTimer(true)}
          className="p-3 border border-gray-200 dark:border-gray-600 rounded-full text-gray-400"
        >
          <Timer className="w-6 h-6" />
        </button>
      </div>

      {/* Timer Modal */}
      {showTimer && <TimerComponent onClose={() => setShowTimer(false)} />}
    </div>
  );
}
