import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Gamepad2, QrCode } from 'lucide-react';

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            رحلة نوّار
          </h1>
          <p className="text-xl text-blue-200">
            Nawwar Journey
          </p>
          <p className="text-sm text-blue-300 mt-2">
            منصة تعليمية متقدمة | Advanced Educational Platform
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Educational Games */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 hover:bg-white/20 transition-all cursor-pointer group"
            onClick={() => navigate('/games')}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  ألعاب تعليمية
                </h2>
                <p className="text-blue-200">
                  Educational Games
                </p>
              </div>
            </div>
            <p className="text-blue-100 mb-4">
              ألعاب تفاعلية لتعليم الطلاب بطريقة ممتعة وفعّالة
            </p>
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600">
              اذهب إلى الألعاب | Go to Games
            </Button>
          </div>

          {/* QR Generator */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 hover:bg-white/20 transition-all cursor-pointer group"
            onClick={() => navigate('/apps/quiz-generator')}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  مولد QR متقدم
                </h2>
                <p className="text-blue-200">
                  Advanced QR Generator
                </p>
              </div>
            </div>
            <p className="text-blue-100 mb-4">
              أنشئ ألعاب تعليمية مخصصة مع شهادات احترافية
            </p>
            <Button className="w-full bg-purple-500 hover:bg-purple-600">
              إنشاء لعبة | Create Game
            </Button>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            مميزات أخرى قريباً
          </h3>
          <p className="text-blue-200">
            More Features Coming Soon | نعمل على إضافة ميزات جديدة ومثيرة
          </p>
        </div>
      </div>
    </div>
  );
}
