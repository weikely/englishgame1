import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useUserStore } from '../store/userStore';
import { useGameStore } from '../store/gameStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, login, currentUser, users } = useUserStore();
  const { initializeLevels } = useGameStore();
  
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const loadUserData = () => {
    const user = useUserStore.getState().currentUser;
    if (!user) return;

    if (user.gameData.levelInfoList && user.gameData.levelInfoList.length > 0) {
      useGameStore.setState({
        points: user.gameData.points,
        stars: user.gameData.stars,
        unlockedTrophies: user.gameData.unlockedTrophies,
        gameHistory: user.gameData.gameHistory,
        rewardHistory: user.gameData.rewardHistory,
        consecutiveDays: user.gameData.consecutiveDays,
        lastPlayDate: user.gameData.lastPlayDate,
        currentLevel: user.gameData.currentLevel,
        maxLevel: user.gameData.maxLevel,
        wordTotalMatches: user.gameData.wordTotalMatches,
        wordProgress: user.gameData.wordProgress,
        completedLevels: user.gameData.completedLevels,
        levelInfoList: user.gameData.levelInfoList,
        pointRecords: (user.gameData as any).pointRecords || [],
      });
    } else {
      initializeLevels();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('请输入你的名字');
      return;
    }

    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
      const success = login(username);
      if (success) {
        loadUserData();
        navigate('/');
      } else {
        setError('登录失败，请重试');
      }
    } else {
      const success = register(username);
      if (success) {
        initializeLevels();
        navigate('/');
      } else {
        setError('登录失败，请重试');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow">🌟</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg mb-2">
            马小跳的英语乐园
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            输入名字，开始你的学习之旅！
          </p>
        </div>

        <Card>
          <div className="text-center mb-6">
            <Sparkles className="w-8 h-8 text-game-purple mx-auto mb-2" />
            <h2 className="text-xl font-bold text-gray-800">
              进入乐园
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              新名字自动创建账号，老用户直接登录
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                你的名字
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-game-purple focus:outline-none transition-colors text-base"
                placeholder="请输入你的名字"
                autoComplete="username"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              开始学习
            </Button>
          </form>

          <div className="mt-4 p-3 bg-game-yellow/20 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              💡 <span className="font-bold">小贴士：</span>
              第一次来？输入你喜欢的名字就能直接玩！
            </p>
          </div>
        </Card>

        <p className="text-center text-white/60 text-xs sm:text-sm mt-6">
          🎮 趣味学习 · 🏆 成就奖励 · 🎁 惊喜兑换
        </p>
      </div>
    </div>
  );
};
