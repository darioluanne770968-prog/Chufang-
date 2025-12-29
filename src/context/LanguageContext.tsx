import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

type Language = 'zh' | 'en' | 'ja' | 'ko';

interface Translations {
  [key: string]: {
    zh: string;
    en: string;
    ja: string;
    ko: string;
  };
}

// Translation dictionary
const translations: Translations = {
  // Navigation
  'nav.home': { zh: '首页', en: 'Home', ja: 'ホーム', ko: '홈' },
  'nav.discover': { zh: '发现', en: 'Discover', ja: '発見', ko: '발견' },
  'nav.create': { zh: '创建', en: 'Create', ja: '作成', ko: '만들기' },
  'nav.cart': { zh: '购物车', en: 'Cart', ja: 'カート', ko: '장바구니' },
  'nav.profile': { zh: '我的', en: 'Profile', ja: 'マイページ', ko: '프로필' },

  // Home page
  'home.search': { zh: '搜索菜谱、食材', en: 'Search recipes, ingredients', ja: 'レシピ、食材を検索', ko: '레시피, 재료 검색' },
  'home.popular': { zh: '热门菜谱', en: 'Popular Recipes', ja: '人気レシピ', ko: '인기 레시피' },
  'home.seasonal': { zh: '时令推荐', en: 'Seasonal', ja: '旬のおすすめ', ko: '계절 추천' },
  'home.quick': { zh: '快手菜', en: 'Quick Dishes', ja: '簡単料理', ko: '간편 요리' },
  'home.healthy': { zh: '健康轻食', en: 'Healthy', ja: 'ヘルシー', ko: '건강식' },

  // Recipe details
  'recipe.ingredients': { zh: '食材', en: 'Ingredients', ja: '材料', ko: '재료' },
  'recipe.steps': { zh: '步骤', en: 'Steps', ja: '手順', ko: '조리법' },
  'recipe.tips': { zh: '小贴士', en: 'Tips', ja: 'コツ', ko: '팁' },
  'recipe.comments': { zh: '评论', en: 'Comments', ja: 'コメント', ko: '댓글' },
  'recipe.servings': { zh: '份量', en: 'Servings', ja: '人前', ko: '인분' },
  'recipe.time': { zh: '时间', en: 'Time', ja: '時間', ko: '시간' },
  'recipe.difficulty': { zh: '难度', en: 'Difficulty', ja: '難易度', ko: '난이도' },
  'recipe.calories': { zh: '热量', en: 'Calories', ja: 'カロリー', ko: '칼로리' },
  'recipe.startCooking': { zh: '开始做菜', en: 'Start Cooking', ja: '調理開始', ko: '요리 시작' },
  'recipe.addToCart': { zh: '加入购物车', en: 'Add to Cart', ja: 'カートに追加', ko: '장바구니에 추가' },

  // Profile
  'profile.favorites': { zh: '我的收藏', en: 'Favorites', ja: 'お気に入り', ko: '즐겨찾기' },
  'profile.recipes': { zh: '我的菜谱', en: 'My Recipes', ja: 'マイレシピ', ko: '내 레시피' },
  'profile.history': { zh: '浏览历史', en: 'History', ja: '履歴', ko: '기록' },
  'profile.settings': { zh: '设置', en: 'Settings', ja: '設定', ko: '설정' },
  'profile.following': { zh: '关注', en: 'Following', ja: 'フォロー中', ko: '팔로잉' },
  'profile.followers': { zh: '粉丝', en: 'Followers', ja: 'フォロワー', ko: '팔로워' },
  'profile.likes': { zh: '获赞', en: 'Likes', ja: 'いいね', ko: '좋아요' },

  // Features
  'feature.statistics': { zh: '烹饪统计', en: 'Statistics', ja: '統計', ko: '통계' },
  'feature.achievements': { zh: '成就系统', en: 'Achievements', ja: '実績', ko: '업적' },
  'feature.challenges': { zh: '烹饪挑战', en: 'Challenges', ja: 'チャレンジ', ko: '챌린지' },
  'feature.mealPlanner': { zh: '周计划', en: 'Meal Planner', ja: '献立', ko: '식단' },
  'feature.pantry': { zh: '食材库', en: 'Pantry', ja: '食材庫', ko: '식재료' },
  'feature.aiRecommend': { zh: '智能推荐', en: 'AI Recommend', ja: 'AI推奨', ko: 'AI 추천' },

  // Cooking mode
  'cooking.step': { zh: '第 {n} 步', en: 'Step {n}', ja: 'ステップ {n}', ko: '{n}단계' },
  'cooking.prev': { zh: '上一步', en: 'Previous', ja: '前へ', ko: '이전' },
  'cooking.next': { zh: '下一步', en: 'Next', ja: '次へ', ko: '다음' },
  'cooking.done': { zh: '完成', en: 'Done', ja: '完了', ko: '완료' },
  'cooking.timer': { zh: '计时器', en: 'Timer', ja: 'タイマー', ko: '타이머' },
  'cooking.voice': { zh: '语音控制', en: 'Voice Control', ja: '音声操作', ko: '음성 제어' },

  // Common
  'common.save': { zh: '保存', en: 'Save', ja: '保存', ko: '저장' },
  'common.cancel': { zh: '取消', en: 'Cancel', ja: 'キャンセル', ko: '취소' },
  'common.confirm': { zh: '确认', en: 'Confirm', ja: '確認', ko: '확인' },
  'common.delete': { zh: '删除', en: 'Delete', ja: '削除', ko: '삭제' },
  'common.edit': { zh: '编辑', en: 'Edit', ja: '編集', ko: '수정' },
  'common.share': { zh: '分享', en: 'Share', ja: '共有', ko: '공유' },
  'common.loading': { zh: '加载中...', en: 'Loading...', ja: '読み込み中...', ko: '로딩 중...' },
  'common.noData': { zh: '暂无数据', en: 'No data', ja: 'データなし', ko: '데이터 없음' },
  'common.retry': { zh: '重试', en: 'Retry', ja: '再試行', ko: '재시도' },
  'common.min': { zh: '分钟', en: 'min', ja: '分', ko: '분' },

  // Allergens
  'allergen.peanut': { zh: '花生', en: 'Peanut', ja: 'ピーナッツ', ko: '땅콩' },
  'allergen.gluten': { zh: '麸质', en: 'Gluten', ja: 'グルテン', ko: '글루텐' },
  'allergen.dairy': { zh: '乳制品', en: 'Dairy', ja: '乳製品', ko: '유제품' },
  'allergen.shellfish': { zh: '贝类', en: 'Shellfish', ja: '貝類', ko: '조개류' },
  'allergen.soy': { zh: '大豆', en: 'Soy', ja: '大豆', ko: '대두' },
  'allergen.egg': { zh: '鸡蛋', en: 'Egg', ja: '卵', ko: '계란' },

  // Seasons
  'season.spring': { zh: '春季', en: 'Spring', ja: '春', ko: '봄' },
  'season.summer': { zh: '夏季', en: 'Summer', ja: '夏', ko: '여름' },
  'season.autumn': { zh: '秋季', en: 'Autumn', ja: '秋', ko: '가을' },
  'season.winter': { zh: '冬季', en: 'Winter', ja: '冬', ko: '겨울' },

  // Wine pairing
  'pairing.redWine': { zh: '红葡萄酒', en: 'Red Wine', ja: '赤ワイン', ko: '레드 와인' },
  'pairing.whiteWine': { zh: '白葡萄酒', en: 'White Wine', ja: '白ワイン', ko: '화이트 와인' },
  'pairing.beer': { zh: '啤酒', en: 'Beer', ja: 'ビール', ko: '맥주' },
  'pairing.tea': { zh: '茶', en: 'Tea', ja: 'お茶', ko: '차' },
  'pairing.juice': { zh: '果汁', en: 'Juice', ja: 'ジュース', ko: '주스' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: { code: Language; name: string; nativeName: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const availableLanguages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved && ['zh', 'en', 'ja', 'ko'].includes(saved)) {
      return saved as Language;
    }
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (['zh', 'en', 'ja', 'ko'].includes(browserLang)) {
      return browserLang as Language;
    }
    return 'zh';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const translation = translations[key];
      if (!translation) {
        console.warn(`Missing translation for key: ${key}`);
        return key;
      }
      let text = translation[language] || translation.zh || key;

      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(`{${paramKey}}`, String(value));
        });
      }

      return text;
    },
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
