import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, AlertTriangle, Clock, Trash2, Package, X } from 'lucide-react';
import { usePantry } from '../context/AppContext';

const categories = [
  { id: 'all', label: '全部', icon: '📦' },
  { id: 'vegetable', label: '蔬菜', icon: '🥬' },
  { id: 'meat', label: '肉类', icon: '🥩' },
  { id: 'seafood', label: '海鲜', icon: '🦐' },
  { id: 'dairy', label: '乳制品', icon: '🥛' },
  { id: 'grain', label: '谷物', icon: '🌾' },
  { id: 'condiment', label: '调料', icon: '🧂' },
  { id: 'other', label: '其他', icon: '🍱' },
];

export default function Pantry() {
  const navigate = useNavigate();
  const { items: pantryItems, addItem, removeItem, getExpiringItems } = usePantry();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: 'vegetable',
    expiryDate: '',
  });

  const expiringItems = getExpiringItems(3);

  const filteredItems = pantryItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryColor = (days: number | null) => {
    if (days === null) return 'text-gray-400';
    if (days < 0) return 'text-red-500';
    if (days <= 3) return 'text-orange-500';
    if (days <= 7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.quantity) {
      addItem({
        id: Date.now().toString(),
        name: newItem.name,
        quantity: newItem.quantity + (newItem.unit ? ` ${newItem.unit}` : ''),
        category: newItem.category,
        expiryDate: newItem.expiryDate || undefined,
        addedAt: new Date().toISOString(),
      });
      setNewItem({ name: '', quantity: '', unit: '', category: 'vegetable', expiryDate: '' });
      setShowAddModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 px-4 pt-4 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-1 text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">我的食材库</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索食材..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Expiring Warning */}
      {expiringItems.length > 0 && (
        <div className="mx-4 -mt-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-orange-700 dark:text-orange-400">
              {expiringItems.length} 个食材即将过期
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {expiringItems.slice(0, 3).map((item) => (
              <span
                key={item.id}
                className="bg-orange-100 dark:bg-orange-800/30 text-orange-700 dark:text-orange-300 text-sm px-2 py-1 rounded-full"
              >
                {item.name}
              </span>
            ))}
            {expiringItems.length > 3 && (
              <span className="text-orange-500 text-sm">+{expiringItems.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="px-4 space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">食材库是空的</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-medium"
            >
              添加食材
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {categories.find((c) => c.id === item.category)?.icon || '📦'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.expiryDate && (
                    <div className={`flex items-center gap-1 ${getExpiryColor(daysUntilExpiry)}`}>
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {daysUntilExpiry !== null
                          ? daysUntilExpiry < 0
                            ? '已过期'
                            : daysUntilExpiry === 0
                            ? '今天'
                            : `${daysUntilExpiry}天`
                          : ''}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">添加食材</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1 block">食材名称</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="例如：西红柿"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">数量</label>
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="数量"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">单位</label>
                  <input
                    type="text"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="个/斤/克"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">分类</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.slice(1).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setNewItem({ ...newItem, category: cat.id })}
                      className={`py-2 rounded-lg text-sm transition-colors ${
                        newItem.category === cat.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {cat.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1 block">保质期（可选）</label>
                <input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              <button
                onClick={handleAddItem}
                disabled={!newItem.name || !newItem.quantity}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium disabled:opacity-50"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
