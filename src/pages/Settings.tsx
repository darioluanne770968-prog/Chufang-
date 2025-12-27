import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTheme, useUser } from '../context/AppContext';

interface SettingsItem {
  icon: LucideIcon;
  label: string;
  action: 'toggle' | 'link';
  value?: boolean;
  onToggle?: () => void;
  extra?: string;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useUser();

  const settingsSections: SettingsSection[] = [
    {
      title: '显示',
      items: [
        {
          icon: theme === 'dark' ? Moon : Sun,
          label: '深色模式',
          action: 'toggle',
          value: theme === 'dark',
          onToggle: toggleTheme,
        },
      ],
    },
    {
      title: '通知',
      items: [
        {
          icon: Bell,
          label: '推送通知',
          action: 'toggle',
          value: true,
          onToggle: () => {},
        },
      ],
    },
    {
      title: '关于',
      items: [
        {
          icon: Shield,
          label: '隐私政策',
          action: 'link',
        },
        {
          icon: HelpCircle,
          label: '帮助与反馈',
          action: 'link',
        },
        {
          icon: Info,
          label: '关于我们',
          action: 'link',
          extra: 'v1.0.0',
        },
      ],
    },
  ];

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 sticky top-0 z-50 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">设置</h1>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="p-4 space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">{section.title}</h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-4 ${
                      index !== section.items.length - 1
                        ? 'border-b border-gray-100 dark:border-gray-700'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-900 dark:text-white">{item.label}</span>
                    </div>
                    {item.action === 'toggle' ? (
                      <button
                        onClick={item.onToggle}
                        className={`w-12 h-7 rounded-full transition-colors ${
                          item.value ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        {item.extra && (
                          <span className="text-sm text-gray-400">{item.extra}</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>

        {/* App Info */}
        <div className="text-center text-xs text-gray-400 pt-4">
          <p>下厨房 v1.0.0</p>
          <p className="mt-1">Made with love</p>
        </div>
      </div>
    </div>
  );
}
