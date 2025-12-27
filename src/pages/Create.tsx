import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Plus, X } from 'lucide-react';

export default function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const handleSubmit = () => {
    // In a real app, this would save to a backend
    alert('菜谱已保存！');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-50 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">发布菜谱</h1>
        <button
          onClick={handleSubmit}
          className="text-orange-500 font-medium"
        >
          发布
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Cover Image */}
        <div className="bg-white rounded-xl p-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-400 transition-colors cursor-pointer">
            <Camera className="w-12 h-12 mb-2" />
            <span className="text-sm">添加封面图片</span>
          </div>
        </div>

        {/* Title */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            菜谱名称
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给菜谱起个名字"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            简介
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="介绍一下这道菜的特色"
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
          />
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            食材用料
          </label>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder={`食材 ${index + 1}`}
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(index)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addIngredient}
            className="mt-3 flex items-center gap-1 text-orange-500 text-sm"
          >
            <Plus className="w-4 h-4" />
            添加食材
          </button>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            烹饪步骤
          </label>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-500 font-medium">
                    步骤 {index + 1}
                  </span>
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(index)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder="描述这一步骤的做法"
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-lg h-24 flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:border-orange-400 hover:text-orange-400 transition-colors">
                  <Camera className="w-5 h-5 mr-2" />
                  添加步骤图片
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addStep}
            className="mt-4 flex items-center gap-1 text-orange-500 text-sm"
          >
            <Plus className="w-4 h-4" />
            添加步骤
          </button>
        </div>
      </div>
    </div>
  );
}
