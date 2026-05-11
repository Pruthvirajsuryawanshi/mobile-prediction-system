import React from 'react';
import { Smartphone, Cpu, Battery, Camera, Star, ExternalLink } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

const MobileCard = ({ mobile }) => {
  return (
    <div className="glass-card group flex flex-col h-full overflow-hidden">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={mobile.image || 'https://via.placeholder.com/400x225'} 
          alt={mobile.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3 flex gap-2">
          {mobile.has5G && (
            <span className="px-2 py-1 bg-blue-600/80 backdrop-blur-md text-[10px] font-bold text-white rounded">5G</span>
          )}
          <span className="px-2 py-1 bg-purple-600/80 backdrop-blur-md text-[10px] font-bold text-white rounded">{mobile.category.toUpperCase()}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{mobile.name}</h3>
            <p className="text-sm text-gray-400">{mobile.brand}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-bold">{mobile.performanceScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Cpu size={14} className="text-purple-400" />
            <span>{mobile.processor}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Battery size={14} className="text-green-400" />
            <span>{mobile.battery} mAh</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Camera size={14} className="text-pink-400" />
            <span>{mobile.camera} MP</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <Smartphone size={14} className="text-blue-400" />
            <span>{mobile.ram}GB / {mobile.storage}GB</span>
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
          <span className="text-xl font-black text-white">{formatPrice(mobile.price)}</span>
          <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all">
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCard;
