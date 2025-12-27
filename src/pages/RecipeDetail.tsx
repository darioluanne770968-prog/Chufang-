import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Clock, ChefHat, Users } from 'lucide-react';
import { recipes } from '../data/recipes';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">菜谱不存在</p>
      </div>
    );
  }

  // Sample ingredients and steps for demo
  const ingredients = [
    '主料：杏鲍菇 300g',
    '调料：生抽 2勺',
    '老抽 1勺',
    '蚝油 1勺',
    '白糖 1勺',
    '蒜末 适量',
    '干辣椒 适量',
    '花椒 适量',
    '葱花 适量',
  ];

  const steps = [
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

  return (
    <div className="min-h-screen bg-white pb-24">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Top navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-black/20 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-black/20 rounded-full backdrop-blur-sm">
              <Heart className="w-6 h-6 text-white" />
            </button>
            <button className="p-2 bg-black/20 rounded-full backdrop-blur-sm">
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
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={recipe.authorAvatar}
            alt={recipe.author}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900">{recipe.author}</p>
            <p className="text-xs text-gray-400">发布于 3 天前</p>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm font-medium">
          关注
        </button>
      </div>

      {/* Stats */}
      <div className="p-4 flex items-center gap-6 border-b border-gray-100">
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

      {/* Ingredients */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">食材用料</h2>
        <div className="grid grid-cols-2 gap-2">
          {ingredients.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 py-2 border-b border-gray-50"
            >
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">烹饪步骤</h2>
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.step}>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{step.step}</span>
                </div>
                <p className="text-gray-700 text-sm flex-1 leading-relaxed">
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

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex items-center gap-4">
        <button className="flex-1 bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 transition-colors">
          我做了这道菜
        </button>
        <button className="p-3 border border-gray-200 rounded-full">
          <Heart className="w-6 h-6 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
