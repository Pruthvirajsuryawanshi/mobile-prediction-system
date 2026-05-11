import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap, Target, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-24 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <span className="px-4 py-1.5 rounded-full glass text-xs font-bold text-purple-400 uppercase tracking-widest border border-purple-500/20">
            Next-Gen Mobile Discovery
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight">
            Find Your Next Phone <br />
            <span className="gradient-text">With AI Intelligence.</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Stop scrolling through endless specs. Talk to our AI expert and get personalized smartphone recommendations based on your unique lifestyle.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link 
            to="/chat" 
            className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-purple-500/20 hover:scale-105 active:scale-95"
          >
            Start AI Chat <MessageSquare size={20} />
          </Link>
          <Link 
            to="/trending" 
            className="px-8 py-4 glass hover:bg-white/10 text-white rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            Browse Trending <Zap size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: Target,
            title: "Precision Matching",
            desc: "Our AI analyzes 50+ data points to match you with the perfect hardware for your needs.",
            color: "text-blue-400"
          },
          {
            icon: Zap,
            title: "Live Streaming AI",
            desc: "Experience real-time conversational intelligence that learns from your preferences.",
            color: "text-purple-400"
          },
          {
            icon: ShieldCheck,
            title: "Verified Specs",
            desc: "Every recommendation is backed by a curated database of authentic smartphone data.",
            color: "text-green-400"
          }
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-8 space-y-4"
            >
              <div className={cn("w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center", feature.color)}>
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </section>

      {/* Social Proof / Call to action */}
      <section className="glass rounded-3xl p-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-3xl font-bold text-white">Ready to upgrade your mobile experience?</h2>
            <p className="text-gray-400">Join thousands of users who found their perfect match using MobileAI.</p>
          </div>
          <Link to="/chat" className="group flex items-center gap-2 text-white font-bold bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition-all">
            Open Chatbot <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/20 blur-[100px] rounded-full" />
      </section>
    </div>
  );
};

// Simple CN helper for inline use since I didn't want to import it everywhere in this chunk
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default Home;
