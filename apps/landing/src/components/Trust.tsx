import { Shield, Zap, Database, Clock } from 'lucide-react';

export default function Trust() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Shield size={18} className="text-teal-600" />
            <span className="text-sm font-medium">JWT Seguro</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Database size={18} className="text-teal-600" />
            <span className="text-sm font-medium">Datos Binance</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Clock size={18} className="text-teal-600" />
            <span className="text-sm font-medium">Uptime 99.9%</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-700">
            <Zap size={18} className="text-teal-600" />
            <span className="text-sm font-medium">Baja latencia</span>
          </div>
        </div>
      </div>
    </section>
  );
}
