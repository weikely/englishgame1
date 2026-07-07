import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Lock, Star, Award, Map } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useGameStore } from '../store/gameStore';
import { trophiesData } from '../data/trophies';

export const AchievementCenter: React.FC = () => {
  const navigate = useNavigate();
  const { unlockedTrophies, stars, consecutiveDays, wordTotalMatches, completedLevels, currentLevel, maxLevel, gameHistory } = useGameStore();

  const unlockedList = trophiesData.filter(t => unlockedTrophies.includes(t.id));
  const lockedList = trophiesData.filter(t => !unlockedTrophies.includes(t.id));

  const getProgress = (trophyId: string): { current: number; max: number; percentage: number } => {
    switch (trophyId) {
      case 'word-master':
        return { current: wordTotalMatches, max: 50, percentage: Math.min((wordTotalMatches / 50) * 100, 100) };
      case 'level-master':
        return { current: completedLevels.length, max: maxLevel, percentage: Math.min((completedLevels.length / maxLevel) * 100, 100) };
      case 'persistent':
        return { current: consecutiveDays, max: 7, percentage: Math.min((consecutiveDays / 7) * 100, 100) };
      case 'star-collector':
        return { current: stars, max: 50, percentage: Math.min((stars / 50) * 100, 100) };
      case 'high-score':
        const highScore = gameHistory.some((record) => record.score > 200);
        return { current: highScore ? 1 : 0, max: 1, percentage: highScore ? 100 : 0 };
      default:
        return { current: 0, max: 1, percentage: 0 };
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="secondary" 
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            返回
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-game-orange/30 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-orange-500 star-shine" />
              <span className="font-bold text-orange-600">{stars} 星星</span>
            </div>
            <div className="flex items-center gap-2 bg-game-purple/30 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-purple-500 trophy-glow" />
              <span className="font-bold text-purple-600">{unlockedTrophies.length}/{trophiesData.length} 奖杯</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4 trophy-glow">🏆</div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">成就中心</h2>
          <p className="text-white/80 mt-2">收集奖杯，成为英语小达人！</p>
        </div>

        <Card className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-6 h-6 text-game-purple" />
            <h3 className="text-xl font-bold text-gray-800">闯关进度</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center bg-game-purple/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">📍</div>
              <div className="text-2xl font-bold text-game-purple">{currentLevel}</div>
              <div className="text-sm text-gray-500">当前关卡</div>
            </div>
            <div className="text-center bg-game-green/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-game-green">{completedLevels.length}</div>
              <div className="text-sm text-gray-500">已完成关卡</div>
            </div>
            <div className="text-center bg-game-orange/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-game-orange">{maxLevel}</div>
              <div className="text-sm text-gray-500">总关卡数</div>
            </div>
            <div className="text-center bg-game-blue/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-game-blue">{Math.round((completedLevels.length / maxLevel) * 100)}%</div>
              <div className="text-sm text-gray-500">完成进度</div>
            </div>
          </div>
          <Button onClick={() => navigate('/word-match')} variant="primary" size="md">
            继续闯关
          </Button>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-game-yellow" />
              已获得的奖杯 ({unlockedList.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unlockedList.map(trophy => (
                <Card key={trophy.id} className="text-center bg-gradient-to-br from-game-yellow/20 to-game-orange/20">
                  <div className="text-5xl mb-3 trophy-glow">{trophy.icon}</div>
                  <h4 className="text-lg font-bold text-game-orange mb-1">{trophy.name}</h4>
                  <p className="text-gray-600 text-sm">{trophy.description}</p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-game-green">
                    <span className="text-lg">✓</span>
                    <span className="text-sm font-medium">已解锁</span>
                  </div>
                </Card>
              ))}
            </div>

            {unlockedList.length === 0 && (
              <Card className="text-center py-8">
                <div className="text-4xl mb-4">🔓</div>
                <p className="text-gray-500">还没有获得任何奖杯哦！</p>
                <p className="text-gray-400 text-sm mt-2">快去闯关获取奖杯吧！</p>
              </Card>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-gray-300" />
              待解锁的奖杯 ({lockedList.length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lockedList.map(trophy => {
                const progress = getProgress(trophy.id);
                
                return (
                  <Card key={trophy.id} className="text-center bg-gray-100/50">
                    <div className="text-5xl mb-3 opacity-50 grayscale">{trophy.icon}</div>
                    <h4 className="text-lg font-bold text-gray-600 mb-1">{trophy.name}</h4>
                    <p className="text-gray-500 text-sm mb-3">{trophy.description}</p>
                    
                    <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-game-blue transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      {progress.max !== 1 ? (
                        `${progress.current}/${progress.max}`
                      ) : (
                        trophy.condition
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {lockedList.length === 0 && (
              <Card className="text-center py-8">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-game-green font-bold">恭喜！你已获得所有奖杯！</p>
              </Card>
            )}
          </div>
        </div>

        <Card className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 学习数据统计</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center bg-game-purple/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold text-game-purple">{wordTotalMatches}</div>
              <div className="text-sm text-gray-500">累计配对单词</div>
            </div>
            
            <div className="text-center bg-game-orange/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-game-orange">{consecutiveDays}</div>
              <div className="text-sm text-gray-500">连续学习天数</div>
            </div>
            
            <div className="text-center bg-game-green/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-game-green">{completedLevels.length}</div>
              <div className="text-sm text-gray-500">已通关数</div>
            </div>
            
            <div className="text-center bg-game-yellow/10 p-4 rounded-xl">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-2xl font-bold text-game-yellow">{stars}</div>
              <div className="text-sm text-gray-500">获得星星总数</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};