export default function Banner() {
  return (
    <div className="mx-4 my-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
      {/* Decorative sparkles */}
      <div className="absolute top-2 right-2 text-yellow-200 text-xl">✨</div>
      <div className="absolute bottom-2 left-2 text-yellow-200 text-sm">✨</div>

      <div className="flex items-center gap-2">
        <span className="text-white font-bold text-lg">早餐马拉松</span>
      </div>

      <button className="bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
        立即报名参加
      </button>
    </div>
  );
}
