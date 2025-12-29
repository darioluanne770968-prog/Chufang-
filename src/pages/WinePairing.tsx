import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Wine,
  Beer,
  Coffee,
  Leaf,
  Droplets,
  ThumbsUp,
  Info,
  Sparkles,
  Star
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { recipes } from '../data/recipes';

interface Pairing {
  id: string;
  type: 'wine' | 'beer' | 'tea' | 'juice' | 'other';
  name: string;
  nameEn: string;
  description: string;
  matchScore: number;
  flavor: string[];
  temperature: string;
  image: string;
  tips: string;
}

const pairingData: Record<string, Pairing[]> = {
  meat: [
    {
      id: 'w1',
      type: 'wine',
      name: '赤霞珠红葡萄酒',
      nameEn: 'Cabernet Sauvignon',
      description: '浓郁的单宁与红肉完美搭配，能够解腻并提升肉香',
      matchScore: 95,
      flavor: ['黑醋栗', '雪松', '烟熏'],
      temperature: '16-18°C',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300',
      tips: '建议提前30分钟醒酒'
    },
    {
      id: 'b1',
      type: 'beer',
      name: '黑啤酒',
      nameEn: 'Stout',
      description: '焦香麦芽味与烤肉的焦香相得益彰',
      matchScore: 85,
      flavor: ['咖啡', '巧克力', '焦糖'],
      temperature: '8-12°C',
      image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300',
      tips: '适合搭配炖肉或烤肉'
    },
    {
      id: 't1',
      type: 'tea',
      name: '普洱熟茶',
      nameEn: 'Ripe Pu-erh',
      description: '温润醇厚，能够解油腻助消化',
      matchScore: 80,
      flavor: ['陈香', '枣香', '木质'],
      temperature: '95-100°C',
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=300',
      tips: '饭后饮用更佳'
    },
  ],
  seafood: [
    {
      id: 'w2',
      type: 'wine',
      name: '霞多丽白葡萄酒',
      nameEn: 'Chardonnay',
      description: '清爽的酸度能够衬托海鲜的鲜甜',
      matchScore: 92,
      flavor: ['柠檬', '青苹果', '奶油'],
      temperature: '10-12°C',
      image: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=300',
      tips: '搭配清蒸海鲜最佳'
    },
    {
      id: 'b2',
      type: 'beer',
      name: '小麦啤酒',
      nameEn: 'Wheat Beer',
      description: '果香与海鲜的鲜味形成有趣对比',
      matchScore: 78,
      flavor: ['香蕉', '丁香', '柑橘'],
      temperature: '4-6°C',
      image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300',
      tips: '适合搭配炸鱼薯条'
    },
    {
      id: 'j1',
      type: 'juice',
      name: '鲜榨柠檬汁',
      nameEn: 'Fresh Lemon Juice',
      description: '酸爽解腻，提升海鲜鲜味',
      matchScore: 88,
      flavor: ['柠檬', '清爽', '微酸'],
      temperature: '0-4°C',
      image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=300',
      tips: '可加入少许蜂蜜调味'
    },
  ],
  vegetable: [
    {
      id: 'w3',
      type: 'wine',
      name: '长相思白葡萄酒',
      nameEn: 'Sauvignon Blanc',
      description: '草本香气与蔬菜的清新完美融合',
      matchScore: 90,
      flavor: ['青草', '柚子', '矿物'],
      temperature: '8-10°C',
      image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=300',
      tips: '搭配沙拉或清炒蔬菜'
    },
    {
      id: 't2',
      type: 'tea',
      name: '龙井绿茶',
      nameEn: 'Longjing Green Tea',
      description: '清香淡雅，与素菜相得益彰',
      matchScore: 95,
      flavor: ['豆香', '栗香', '清新'],
      temperature: '80-85°C',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300',
      tips: '水温不宜过高'
    },
  ],
  spicy: [
    {
      id: 'b3',
      type: 'beer',
      name: '冰镇拉格啤酒',
      nameEn: 'Lager',
      description: '冰爽解辣，清新爽口',
      matchScore: 93,
      flavor: ['麦芽', '啤酒花', '清爽'],
      temperature: '2-4°C',
      image: 'https://images.unsplash.com/photo-1618183479302-1e0aa382c36b?w=300',
      tips: '越冰越好！'
    },
    {
      id: 'j2',
      type: 'juice',
      name: '酸梅汤',
      nameEn: 'Sour Plum Drink',
      description: '酸甜解辣，传统搭配',
      matchScore: 90,
      flavor: ['乌梅', '山楂', '甘草'],
      temperature: '0-4°C',
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
      tips: '可加桂花增香'
    },
    {
      id: 'w4',
      type: 'wine',
      name: '雷司令甜白',
      nameEn: 'Riesling',
      description: '甜度可以中和辣味',
      matchScore: 82,
      flavor: ['蜂蜜', '桃子', '杏仁'],
      temperature: '8-10°C',
      image: 'https://images.unsplash.com/photo-1566995541428-f2246c17cda1?w=300',
      tips: '选择半甜或甜型'
    },
  ],
};

const typeIcons: Record<string, React.ReactNode> = {
  wine: <Wine className="w-5 h-5" />,
  beer: <Beer className="w-5 h-5" />,
  tea: <Leaf className="w-5 h-5" />,
  juice: <Droplets className="w-5 h-5" />,
  other: <Coffee className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  wine: 'from-red-500 to-purple-600',
  beer: 'from-amber-400 to-orange-500',
  tea: 'from-green-500 to-teal-600',
  juice: 'from-yellow-400 to-orange-400',
  other: 'from-gray-500 to-gray-600',
};

export default function WinePairing() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const recipe = recipeId ? recipes.find(r => r.id === Number(recipeId)) : null;

  const [selectedCategory, setSelectedCategory] = useState<'meat' | 'seafood' | 'vegetable' | 'spicy'>('meat');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Determine category based on recipe if available
  const pairings = pairingData[selectedCategory] || [];
  const filteredPairings = selectedType
    ? pairings.filter(p => p.type === selectedType)
    : pairings;

  const categories = [
    { id: 'meat', label: '肉类菜品', emoji: '🥩' },
    { id: 'seafood', label: '海鲜菜品', emoji: '🦐' },
    { id: 'vegetable', label: '蔬菜素食', emoji: '🥬' },
    { id: 'spicy', label: '麻辣菜品', emoji: '🌶️' },
  ];

  const types = [
    { id: 'wine', label: '葡萄酒' },
    { id: 'beer', label: '啤酒' },
    { id: 'tea', label: '茶' },
    { id: 'juice', label: '饮料' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-rose-500 to-orange-400 px-4 pt-4 pb-8">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">餐酒搭配</h1>
        </div>

        {recipe ? (
          <GlassCard intensity="light" className="p-4">
            <div className="flex items-center gap-3">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm text-gray-500">为这道菜推荐搭配</p>
                <h3 className="font-medium text-gray-900">{recipe.title}</h3>
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="text-white/80 text-center">
            <Wine className="w-12 h-12 mx-auto mb-2 opacity-80" />
            <p className="text-sm">选择菜品类型，获取最佳搭配建议</p>
          </div>
        )}
      </div>

      {/* Category Selection */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-4 gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as typeof selectedCategory)}
              className={`py-3 px-2 rounded-xl text-center transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white dark:bg-gray-800 shadow-lg scale-105'
                  : 'bg-white/60 dark:bg-gray-800/60'
              }`}
            >
              <span className="text-2xl block mb-1">{cat.emoji}</span>
              <span className={`text-xs ${
                selectedCategory === cat.id
                  ? 'text-purple-600 dark:text-purple-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedType(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
              selectedType === null
                ? 'bg-purple-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            全部
          </button>
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm flex items-center gap-1.5 transition-all ${
                selectedType === type.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {typeIcons[type.id]}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pairings List */}
      <div className="px-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">推荐搭配</h3>
        </div>

        {filteredPairings.map((pairing, idx) => (
          <AnimatedCard key={pairing.id} delay={idx * 100}>
            <GlassCard className="overflow-hidden" hover>
              <div className="flex gap-4 p-4">
                <div className="relative">
                  <img
                    src={pairing.image}
                    alt={pairing.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r ${typeColors[pairing.type]} flex items-center justify-center text-white`}>
                    {typeIcons[pairing.type]}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{pairing.name}</h4>
                      <p className="text-xs text-gray-500">{pairing.nameEn}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-white fill-white" />
                      <span className="text-xs font-bold text-white">{pairing.matchScore}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {pairing.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {pairing.flavor.map(f => (
                      <span
                        key={f}
                        className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      推荐温度: <span className="text-purple-600 dark:text-purple-400">{pairing.temperature}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-r from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20 rounded-lg p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">{pairing.tips}</p>
                </div>
              </div>
            </GlassCard>
          </AnimatedCard>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="px-4 mt-6">
        <GlassCard className="p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5 text-purple-500" />
            搭配小贴士
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              红肉配红酒，白肉配白酒是经典法则
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              辣菜可以选择有甜度的饮品来平衡
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              油腻菜品适合搭配酸度高的饮品解腻
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-500">•</span>
              中餐搭配中国茶，往往是最和谐的选择
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
