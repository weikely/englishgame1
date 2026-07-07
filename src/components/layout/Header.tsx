import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trophy, Coins, Home, LogOut, History, Award, BookOpen, Menu, X, Info } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useUserStore } from '../../store/userStore';
import { currentVersion, versionHistory } from '../../data/version';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { points, stars, unlockedTrophies } = useGameStore();
  const { currentUser, logout } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showVersion, setShowVersion] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-3 py-2 sm:px-4 sm:py-4">
        {/* 第一行：标题 + 状态 + 菜单按钮 */}
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 cursor-pointer flex-shrink min-w-0"
            onClick={() => go('/')}
          >
            <div className="text-2xl sm:text-4xl animate-bounce-slow flex-shrink-0">🌟</div>
            <h1 className="text-base sm:text-2xl font-bold gradient-text truncate">马小跳的英语乐园</h1>
          </div>

          {/* 右侧：状态条（移动端紧凑显示） */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div
              className="flex items-center gap-1 bg-game-yellow/30 px-2 py-1 sm:px-4 sm:py-2 rounded-full cursor-pointer hover:bg-game-yellow/50 transition-colors"
              onClick={() => go('/points-history')}
            >
              <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              <span className="font-bold text-yellow-700 text-sm sm:text-base">{points}</span>
              <History className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 hidden sm:block" />
            </div>

            <div className="flex items-center gap-1 bg-game-orange/30 px-2 py-1 sm:px-4 sm:py-2 rounded-full">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 star-shine" />
              <span className="font-bold text-orange-600 text-sm sm:text-base">{stars}</span>
            </div>

            <div
              className="flex items-center gap-1 bg-game-purple/30 px-2 py-1 sm:px-4 sm:py-2 rounded-full cursor-pointer hover:bg-game-purple/50 transition-colors"
              onClick={() => go('/achievements')}
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 trophy-glow" />
              <span className="font-bold text-purple-600 text-sm sm:text-base">{unlockedTrophies.length}</span>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="菜单"
            >
              {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* 第二行：桌面端导航（md+ 显示） */}
        <div className="hidden md:flex items-center gap-2 mt-3">
          <div
            className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full cursor-pointer hover:bg-blue-200 transition-colors"
            onClick={() => go('/leaderboard')}
          >
            <Award className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-blue-700">排行榜</span>
          </div>

          <div
            className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full cursor-pointer hover:bg-green-200 transition-colors"
            onClick={() => go('/points-rules')}
          >
            <BookOpen className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-700">规则</span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3 ml-auto pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-br from-game-purple to-game-blue rounded-full flex items-center justify-center text-white font-bold">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
              <div className="font-bold text-gray-800 text-sm">{currentUser.username}</div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
                title="退出登录"
              >
                <LogOut className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}

          <button
            onClick={() => go('/')}
            className="bg-game-blue hover:bg-blue-400 px-4 py-2 text-sm font-bold text-white rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4 inline mr-1" />
            首页
          </button>
          
          <button
            onClick={() => setShowVersion(!showVersion)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title={`版本 ${currentVersion}`}
          >
            <Info className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        {menuOpen && (
          <div className="md:hidden mt-2 pb-2 border-t border-gray-200 pt-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => go('/')}
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl text-blue-700 font-bold active:bg-blue-100 transition-colors"
              >
                <Home className="w-5 h-5" />
                首页
              </button>
              <button
                onClick={() => go('/leaderboard')}
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl text-blue-700 font-bold active:bg-blue-100 transition-colors"
              >
                <Award className="w-5 h-5" />
                排行榜
              </button>
              <button
                onClick={() => go('/points-rules')}
                className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl text-green-700 font-bold active:bg-green-100 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                积分规则
              </button>
              {currentUser && (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-game-purple to-game-blue rounded-full flex items-center justify-center text-white font-bold">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-800">{currentUser.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl text-red-600 font-bold active:bg-red-100 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    退出登录
                  </button>
                </>
              )}
              <button
                onClick={() => setShowVersion(!showVersion)}
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-gray-600 font-bold active:bg-gray-100 transition-colors"
              >
                <Info className="w-5 h-5" />
                版本 {currentVersion}
              </button>
            </div>
          </div>
        )}

        {showVersion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30" onClick={() => setShowVersion(false)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-game-purple">版本信息</h3>
                <button onClick={() => setShowVersion(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-game-blue">v{currentVersion}</div>
                <div className="text-gray-500 text-sm mt-1">当前版本</div>
              </div>
              <div className="max-h-80 overflow-y-auto space-y-3">
                {versionHistory.map((item) => (
                  <div key={item.version} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">v{item.version}</span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {item.changes.map((change, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-game-green mr-2">•</span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
