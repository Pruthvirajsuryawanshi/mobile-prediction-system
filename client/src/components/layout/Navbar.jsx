import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, MessageSquare, TrendingUp, User, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Smartphone },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Trending', path: '/trending', icon: TrendingUp },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Smartphone className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold gradient-text">MobileAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-purple-400",
                    isActive ? "text-purple-400" : "text-gray-400"
                  )}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <ShoppingBag size={22} />
            </button>
            <Link to="/profile" className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white transition-colors">
              <User size={22} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
