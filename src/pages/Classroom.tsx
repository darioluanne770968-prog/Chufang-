import { Play, Clock, ChefHat } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: '零基础学做饭',
    instructor: '王大厨',
    duration: '30课时',
    students: 12345,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=250&fit=crop',
  },
  {
    id: 2,
    title: '家常菜进阶课程',
    instructor: '李师傅',
    duration: '25课时',
    students: 8932,
    image: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=400&h=250&fit=crop',
  },
  {
    id: 3,
    title: '烘焙入门',
    instructor: '小美老师',
    duration: '20课时',
    students: 15678,
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=250&fit=crop',
  },
  {
    id: 4,
    title: '川菜精选',
    instructor: '张大师',
    duration: '35课时',
    students: 6543,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop',
  },
];

export default function Classroom() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-900">课堂</h1>
        <p className="text-sm text-gray-500 mt-1">跟着大厨学做菜</p>
      </div>

      {/* Featured Course */}
      <div className="px-4 py-4">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop"
            alt="Featured course"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">热门推荐</span>
            <h2 className="text-white font-bold text-lg mt-2">厨艺大师养成计划</h2>
            <p className="text-white/80 text-sm">从零开始，成为厨房达人</p>
          </div>
          <button className="absolute top-4 right-4 bg-white/90 rounded-full p-3 hover:bg-white transition-colors">
            <Play className="w-6 h-6 text-orange-500" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Course List */}
      <div className="px-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">全部课程</h3>
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl overflow-hidden flex shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-32 h-24 object-cover"
              />
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{course.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <ChefHat className="w-3 h-3" />
                    {course.instructor}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className="text-xs text-orange-500">
                    {course.students.toLocaleString()}人学习
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
