import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Gift, Award } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/word-match', icon: BookOpen, label: '单词闯关', color: 'bg-game-purple' },
    { path: '/rewards', icon: Gift, label: '奖励商店', color: 'bg-game-orange' },
    { path: '/achievements', icon: Award, label: '成就中心', color: 'bg-game-green' },
  ];

  return (
    <nav className={`flex flex-wrap justify-center gap-4 ${className}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white transition-all duration-200 transform ${
              isActive 
                ? `${item.color} scale-110 shadow-xl` 
                : `${item.color}/70 hover:scale-105 hover:shadow-lg`
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};