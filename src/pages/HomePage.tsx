import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trophy, Coins, ArrowRight, Zap, Gift, Award, BookOpen, History, Flame, User } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useGameStore } from '../store/gameStore';
import { useUserStore } from '../store/userStore';
import { trophiesData } from '../data/trophies';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { points, stars, unlockedTrophies, consecutiveDays, completedLevels, currentLevel, maxLevel, checkDailyLogin, getErrorWords } = useGameStore();
  const { currentUser } = useUserStore();
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [floatingElements, setFloatingElements] = useState<{id: number, x: number, y: number, emoji: string}[]>([]);

  useEffect(() => {
    checkDailyLogin();
    
    const elements = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: ['🌟', '⭐', '✨', '💫', '🌈'][Math.floor(Math.random() * 5)],
    }));
    setFloatingElements(elements);
  }, [checkDailyLogin]);

  const handleStartGame = () => {
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      navigate('/word-match');
    }, 500);
  };

  const recentTrophies = trophiesData
    .filter(t => unlockedTrophies.includes(t.id))
    .slice(0, 4);

  const errorWordsCount = getErrorWords().length;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {floatingElements.map((el) => (
        <div
          key={el.id}
          className="absolute text-xl sm:text-2xl animate-float opacity-50"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            animationDelay: `${el.id * 0.3}s`,
          }}
        >
          {el.emoji}
        </div>
      ))}

      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50">
          <div className="text-6xl animate-celebrate">🎮</div>
        </div>
      )}

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8 relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce-slow">🎈</div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {currentUser ? `${currentUser.username}，欢迎回来！` : '欢迎来到马小跳的英语乐园！'}
          </h2>
          <p className="text-base sm:text-xl text-white/90 drop-shadow">
            今天也要开心学习哦！
          </p>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
          <Button
            onClick={() => navigate('/word-match')}
            variant="primary"
            size="sm"
            className="sm:px-6 sm:py-3 sm:text-base"
          >
            📚 单词闯关
          </Button>
          <Button
            onClick={() => navigate('/rewards')}
            variant="warning"
            size="sm"
            className="sm:px-6 sm:py-3 sm:text-base"
          >
            🎁 奖励商店
          </Button>
          <Button
            onClick={() => navigate('/achievements')}
            variant="secondary"
            size="sm"
            className="sm:px-6 sm:py-3 sm:text-base"
          >
            🏆 成就中心
          </Button>
          <Button
            onClick={() => navigate('/leaderboard')}
            variant="success"
            size="sm"
            className="sm:px-6 sm:py-3 sm:text-base"
          >
            📊 排行榜
          </Button>
          <Button
            onClick={() => navigate('/points-rules')}
            variant="info"
            size="sm"
            className="sm:px-6 sm:py-3 sm:text-base"
          >
            📋 积分规则
          </Button>
        </div>

        <div className="flex justify-center mb-8 sm:mb-12">
          <Card
            className="text-center max-w-lg"
            onClick={handleStartGame}
            hover
          >
            <div className="text-5xl sm:text-7xl mb-3 sm:mb-4 animate-wiggle">📚</div>
            <h3 className="text-2xl sm:text-3xl font-bold text-game-purple mb-3">单词闯关</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">匹配图片和单词，闯关学习英语！</p>
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 flex-wrap">
              <div className="bg-game-purple/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <span className="font-bold text-purple-700 text-sm sm:text-base">第 {currentLevel} 关</span>
              </div>
              <div className="bg-game-green/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
                <span className="font-bold text-green-700 text-sm sm:text-base">已完成 {completedLevels.length}/{maxLevel}</span>
              </div>
            </div>
            <Button variant="secondary" size="md" className="sm:px-8 sm:py-4 sm:text-lg w-full sm:w-auto">
              开始闯关
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </Card>
        </div>

        {errorWordsCount > 0 && (
          <div className="flex justify-center mb-8 sm:mb-12">
            <Card
              className="text-center max-w-lg bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/word-match')}
              hover
            >
              <div className="text-4xl sm:text-5xl mb-2">🔥</div>
              <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-2">强化关卡</h3>
              <p className="text-gray-600 mb-3 text-sm sm:text-base">
                你有 <span className="font-bold text-red-500">{errorWordsCount}</span> 个易错单词
              </p>
              <p className="text-xs sm:text-sm text-orange-500 mb-3">专练易错单词，积分翻倍！</p>
              <Button variant="warning" size="sm" className="sm:px-6 sm:py-3 sm:text-base w-full sm:w-auto">
                <Flame className="w-4 h-4 inline mr-1" />
                去挑战
              </Button>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <Card
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/points-history')}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              <h3 className="text-base sm:text-lg font-bold text-yellow-700">积分</h3>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-yellow-600 mb-2">{points}</div>
            <p className="text-xs sm:text-sm text-gray-500">点击查看明细</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 star-shine" />
              <h3 className="text-base sm:text-lg font-bold text-orange-700">星星</h3>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-orange-600 mb-2">{stars}</div>
            <p className="text-xs sm:text-sm text-gray-500">表现好就能获得！</p>
          </Card>

          <Card
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate('/leaderboard')}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <h3 className="text-base sm:text-lg font-bold text-blue-700">排行榜</h3>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-blue-600 mb-2">🏆</div>
            <p className="text-xs sm:text-sm text-gray-500">看看排名第几</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              <h3 className="text-base sm:text-lg font-bold text-purple-700">连续天数</h3>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-purple-600 mb-2">{consecutiveDays}</div>
            <p className="text-xs sm:text-sm text-gray-500">坚持每天学习！</p>
          </Card>
        </div>

        {recentTrophies.length > 0 && (
          <Card className="mb-8 sm:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-orange-500 trophy-glow" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">我的奖杯</h3>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {recentTrophies.map((trophy) => (
                <div
                  key={trophy.id}
                  className="flex flex-col items-center bg-game-yellow/20 px-3 py-2 sm:px-4 sm:py-3 rounded-xl"
                >
                  <div className="text-2xl sm:text-3xl mb-1">{trophy.icon}</div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{trophy.name}</span>
                </div>
              ))}
            </div>
            <Button
              onClick={() => navigate('/achievements')}
              variant="warning"
              size="sm"
              className="mt-4"
            >
              查看全部成就
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
          <Card className="text-center">
            <div className="text-4xl sm:text-4xl mb-3 sm:mb-4">🎁</div>
            <h3 className="text-lg sm:text-xl font-bold text-game-orange mb-2">想兑换礼物？</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">用积分兑换玩具、漫画书、零花钱等奖励！</p>
            <Button variant="warning" size="md" className="sm:px-8 sm:py-4 sm:text-lg w-full sm:w-auto" onClick={() => navigate('/rewards')}>
              去奖励商店
              <Gift className="w-5 h-5 ml-2 inline" />
            </Button>
          </Card>

          <Card className="text-center">
            <div className="text-4xl sm:text-4xl mb-3 sm:mb-4">📋</div>
            <h3 className="text-lg sm:text-xl font-bold text-game-green mb-2">积分规则说明</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">了解如何获得积分和成就奖杯！</p>
            <Button variant="success" size="md" className="sm:px-8 sm:py-4 sm:text-lg w-full sm:w-auto" onClick={() => navigate('/points-rules')}>
              查看规则
              <BookOpen className="w-5 h-5 ml-2 inline" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};