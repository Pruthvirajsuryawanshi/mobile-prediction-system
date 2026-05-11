import React, { useState, useEffect } from 'react';
import { mobileService } from '../services/api';
import MobileCard from '../components/recommendation/MobileCard';
import { Loader2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Trending = () => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await mobileService.getTrending();
        setMobiles(response.data.data);
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="space-y-10 py-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400">
          <TrendingUp size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Trending Devices</h1>
          <p className="text-gray-400 text-sm">Most viewed and top-rated smartphones this month.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mobiles.map((mobile, idx) => (
            <motion.div
              key={mobile._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <MobileCard mobile={mobile} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;
