import { Settings, ChevronRight, BookOpen, Heart, MessageCircle, ShoppingBag, HelpCircle, LogOut } from 'lucide-react';

const menuItems = [
  { icon: BookOpen, label: '我的菜谱', badge: 12 },
  { icon: Heart, label: '我的收藏', badge: 48 },
  { icon: MessageCircle, label: '我的评论', badge: 156 },
  { icon: ShoppingBag, label: '我的订单' },
  { icon: HelpCircle, label: '帮助与反馈' },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with user info */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-400 pt-8 pb-16 px-4 relative">
        <button className="absolute top-4 right-4 p-2 text-white/80 hover:text-white">
          <Settings className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/100?img=33"
            alt="User avatar"
            className="w-20 h-20 rounded-full border-4 border-white/20"
          />
          <div>
            <h1 className="text-xl font-bold text-white">厨房小达人</h1>
            <p className="text-white/80 text-sm mt-1">ID: 88888888</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-6 text-white">
          <div className="text-center">
            <div className="text-xl font-bold">128</div>
            <div className="text-xs text-white/80">关注</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-xl font-bold">1.2k</div>
            <div className="text-xs text-white/80">粉丝</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-xl font-bold">3.4k</div>
            <div className="text-xs text-white/80">获赞</div>
          </div>
        </div>
      </div>

      {/* Quick stats card */}
      <div className="mx-4 -mt-8 bg-white rounded-xl shadow-lg p-4 flex items-center justify-around relative z-10">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">12</div>
          <div className="text-xs text-gray-500">菜谱</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">48</div>
          <div className="text-xs text-gray-500">收藏</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">5</div>
          <div className="text-xs text-gray-500">收藏夹</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">23</div>
          <div className="text-xs text-gray-500">关注作者</div>
        </div>
      </div>

      {/* Menu items */}
      <div className="mx-4 mt-4 bg-white rounded-xl overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-sm text-gray-400">{item.badge}</span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Logout button */}
      <button className="mx-4 mt-4 bg-white rounded-xl p-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-colors w-[calc(100%-2rem)]">
        <LogOut className="w-5 h-5" />
        <span>退出登录</span>
      </button>
    </div>
  );
}
