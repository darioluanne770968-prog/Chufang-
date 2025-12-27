import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check, ShoppingCart, X } from 'lucide-react';
import { useShoppingList } from '../context/AppContext';
import { generateId } from '../utils/helpers';

export default function ShoppingList() {
  const navigate = useNavigate();
  const { items, addItem, removeItem, toggleItem, clearList } = useShoppingList();
  const [newItemName, setNewItemName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const groupedItems = items.reduce((acc, item) => {
    const key = item.recipeName || '其他';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addItem({
        id: generateId(),
        name: newItemName.trim(),
        checked: false,
      });
      setNewItemName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 sticky top-0 z-50 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-1">
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">购物清单</h1>
              <p className="text-xs text-gray-500">
                {checkedCount}/{totalCount} 已完成
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
            >
              <Plus className="w-5 h-5" />
            </button>
            {items.length > 0 && (
              <button
                onClick={clearList}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${(checkedCount / totalCount) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Add Item Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">添加食材</h3>
              <button onClick={() => setShowAddForm(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="输入食材名称"
                autoFocus
                className="flex-1 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                添加
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">购物清单是空的</p>
            <p className="text-sm text-gray-400 mt-1">
              浏览菜谱时可以将食材加入清单
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-medium hover:bg-orange-600"
            >
              添加食材
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedItems).map(([recipeName, groupItems]) => (
              <div key={recipeName}>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-orange-500 rounded-full" />
                  {recipeName}
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                  {groupItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center p-4 ${
                        index !== groupItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                          item.checked
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {item.checked && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          item.checked
                            ? 'text-gray-400 line-through'
                            : 'text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {item.name}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
