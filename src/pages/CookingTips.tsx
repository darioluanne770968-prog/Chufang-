import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Search,
  Flame,
  Timer,
  Thermometer,
  Droplets,
  Wind,
  Sparkles,
  Check,
  Star
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { AnimatedCard } from '../components/ui/AnimatedCard';

interface CookingTip {
  id: string;
  title: string;
  content: string;
  category: string;
  icon: string;
  difficulty: '入门' | '进阶' | '专业';
  isSaved: boolean;
  likes: number;
  tags: string[];
}

const categories = [
  { id: 'all', label: '全部', icon: Sparkles },
  { id: 'fire', label: '火候', icon: Flame },
  { id: 'time', label: '时间', icon: Timer },
  { id: 'temp', label: '温度', icon: Thermometer },
  { id: 'water', label: '水分', icon: Droplets },
  { id: 'air', label: '通风', icon: Wind },
];

const mockTips: CookingTip[] = [
  {
    id: '1',
    title: '炒菜时什么时候放盐最好？',
    content: `放盐的时机非常讲究：

**叶菜类**：出锅前放盐
- 盐会让蔬菜快速出水变软
- 早放盐会让菜变得塌软无形
- 出锅前30秒放入最佳

**肉类**：腌制时和出锅前各放一半
- 腌制时放盐可以入味
- 出锅前再调整咸淡

**汤类**：快出锅时放盐
- 早放盐会影响肉质变硬
- 煲汤时蛋白质需要在低盐环境下析出`,
    category: 'fire',
    icon: '🧂',
    difficulty: '入门',
    isSaved: false,
    likes: 2341,
    tags: ['调味', '炒菜', '基础']
  },
  {
    id: '2',
    title: '如何判断油温是否到位？',
    content: `**三四成热 (100-120°C)**：
- 油面平静，无烟
- 手置油上方有温热感
- 适合：滑油、炸花生

**五六成热 (150-180°C)**：
- 油面开始波动
- 放入葱姜会有小泡
- 适合：炒菜、煎蛋

**七八成热 (200-230°C)**：
- 油面大幅波动
- 放入食材有大量气泡
- 适合：爆炒、炸物

**小技巧**：用竹筷子测温
- 筷子插入油中，周围冒密集小泡 = 六成热
- 冒大泡 = 七八成热`,
    category: 'temp',
    icon: '🌡️',
    difficulty: '入门',
    isSaved: true,
    likes: 3567,
    tags: ['油温', '炸物', '安全']
  },
  {
    id: '3',
    title: '焯水的正确方法',
    content: `**冷水下锅**：
- 适合：根茎类蔬菜（土豆、胡萝卜）
- 原因：让食材均匀受热

**热水下锅**：
- 适合：叶菜、肉类
- 叶菜：开水+少许油和盐，保持翠绿
- 肉类：开水可以快速收缩表面，锁住肉汁

**焯水时间**：
- 叶菜：10-30秒
- 肉类：1-2分钟
- 根茎类：3-5分钟

**焯完立即过凉水**：
- 停止加热，保持脆嫩口感
- 保持蔬菜翠绿色泽`,
    category: 'water',
    icon: '💧',
    difficulty: '入门',
    isSaved: false,
    likes: 1892,
    tags: ['焯水', '蔬菜', '预处理']
  },
  {
    id: '4',
    title: '如何让牛排达到完美熟度？',
    content: `**内部温度对照**：
- 一分熟 (Rare)：48-52°C - 中心红色冷凉
- 三分熟 (Medium Rare)：52-55°C - 中心红色温热
- 五分熟 (Medium)：55-60°C - 中心粉红
- 七分熟 (Medium Well)：60-65°C - 微粉
- 全熟 (Well Done)：65°C+ - 无粉色

**手指测试法**：
- 拇指碰食指：一分熟
- 拇指碰中指：三分熟
- 拇指碰无名指：五分熟
- 拇指碰小指：七分熟

**关键点**：
- 牛排室温静置30分钟再煎
- 煎完静置3-5分钟再切
- 静置让肉汁重新分布`,
    category: 'temp',
    icon: '🥩',
    difficulty: '进阶',
    isSaved: false,
    likes: 4521,
    tags: ['牛排', '西餐', '温度']
  },
  {
    id: '5',
    title: '炒青菜保持翠绿的秘诀',
    content: `**六大秘诀**：

1. **大火快炒**
   - 高温短时间，减少叶绿素分解

2. **油要够多**
   - 油能隔绝空气，防止氧化变黄

3. **焯水加油盐**
   - 焯水时加少许油和盐，形成保护膜

4. **不要加盖**
   - 加盖会产生酸性水汽，破坏叶绿素

5. **出锅前放盐**
   - 盐会让蔬菜快速脱水变软

6. **立即装盘**
   - 余温会继续让菜变黄`,
    category: 'fire',
    icon: '🥬',
    difficulty: '入门',
    isSaved: true,
    likes: 5678,
    tags: ['青菜', '颜色', '炒菜']
  },
  {
    id: '6',
    title: '如何做出丝滑的蛋羹？',
    content: `**完美蛋羹配方**：
- 鸡蛋 : 温水 = 1 : 1.5
- 必须用温水（35-40°C）

**关键步骤**：
1. 蛋液搅拌后过筛
   - 去除蛋筋和气泡

2. 盖保鲜膜
   - 防止水蒸气滴落形成蜂窝

3. 温度控制
   - 水开后转小火
   - 大火会产生气泡

4. 时间把控
   - 小火蒸8-10分钟
   - 用筷子戳一下，不粘即熟

**进阶技巧**：
- 加入少许料酒去腥
- 蒸好后淋生抽和香油`,
    category: 'time',
    icon: '🥚',
    difficulty: '入门',
    isSaved: false,
    likes: 3245,
    tags: ['蒸蛋', '鸡蛋', '嫩滑']
  },
];

export default function CookingTips() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [tips, setTips] = useState(mockTips);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTips = tips.filter(tip => {
    if (selectedCategory !== 'all' && tip.category !== selectedCategory) return false;
    if (searchQuery && !tip.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSave = (tipId: string) => {
    setTips(prev =>
      prev.map(tip =>
        tip.id === tipId ? { ...tip, isSaved: !tip.isSaved } : tip
      )
    );
  };

  const difficultyColor = {
    '入门': 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
    '进阶': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
    '专业': 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">烹饪小贴士</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索技巧..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm text-white placeholder-white/60 rounded-xl border border-white/20 focus:outline-none focus:bg-white/30"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{tips.length}</div>
            <div className="text-xs text-white/70">技巧总数</div>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{tips.filter(t => t.isSaved).length}</div>
            <div className="text-xs text-white/70">已收藏</div>
          </div>
          <div className="w-px h-8 bg-white/30" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">6</div>
            <div className="text-xs text-white/70">分类</div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3 -mt-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tips List */}
      <div className="px-4 space-y-4">
        {filteredTips.map((tip, idx) => (
          <AnimatedCard key={tip.id} delay={idx * 50}>
            <GlassCard className="overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                className="w-full p-4 flex items-start gap-3 text-left"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {tip.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor[tip.difficulty]}`}>
                      {tip.difficulty}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {tip.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {tip.likes}
                    </span>
                    <div className="flex gap-1">
                      {tip.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-amber-600 dark:text-amber-400">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {expandedTip === tip.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {/* Content */}
              {expandedTip === tip.id && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {tip.content.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h5 key={i} className="font-bold text-amber-700 dark:text-amber-400 mt-3 mb-1">
                              {line.replace(/\*\*/g, '')}
                            </h5>
                          );
                        }
                        if (line.startsWith('- ')) {
                          return (
                            <div key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400 ml-2">
                              <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                              <span>{line.substring(2)}</span>
                            </div>
                          );
                        }
                        if (line.trim()) {
                          return (
                            <p key={i} className="text-gray-700 dark:text-gray-300 mb-1">
                              {line}
                            </p>
                          );
                        }
                        return <br key={i} />;
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleSave(tip.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                        tip.isSaved
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${tip.isSaved ? 'fill-current' : ''}`} />
                      {tip.isSaved ? '已收藏' : '收藏'}
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <Share2 className="w-4 h-4" />
                      分享
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>
          </AnimatedCard>
        ))}
      </div>

      {/* Today's Tip */}
      <div className="px-4 mt-6">
        <GlassCard className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 border-none">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-white" />
            <h4 className="font-medium text-white">今日小技巧</h4>
          </div>
          <p className="text-white/90 text-sm">
            切洋葱时把洋葱放入冰箱冷藏15分钟，可以减少刺激性气体的释放，让你不再泪流满面！
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
