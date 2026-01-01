export default function Banner() {
  return (
    <div className="mx-4 mt-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-3 flex items-center justify-between">
      <span className="text-white font-bold">🍳 早餐马拉松</span>
      <button className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors">
        立即参加
      </button>
    </div>
  );
}
