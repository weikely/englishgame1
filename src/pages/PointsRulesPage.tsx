import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, Star, Trophy, Gift, Target, Zap, Flame, BookOpen, Award } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { trophiesData } from '../data/trophies';

export const PointsRulesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <div className="bg-white/80 backdrop-blur-md shadow-lg p-2 sm:p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button
            onClick={() => navigate('/')}
            variant="secondary"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 inline mr-1" />
            返回
          </Button>

          <div className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-game-purple">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            积分规则
          </div>

          <div className="w-16 sm:w-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8 max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📋</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">积分规则说明</h2>
          <p className="text-white/80 mt-2 text-sm sm:text-base">了解如何获得积分和成就！</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">如何获得积分</h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-game-yellow/20 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-game-purple flex-shrink-0" />
                  <span className="text-sm sm:text-base">完美通关</span>
                </div>
                <span className="font-bold text-game-purple text-sm sm:text-base flex-shrink-0">+30</span>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-game-yellow/20 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-game-blue flex-shrink-0" />
                  <span className="text-sm sm:text-base">良好通关（错1-2）</span>
                </div>
                <span className="font-bold text-game-blue text-sm sm:text-base flex-shrink-0">+15</span>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-game-yellow/20 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-game-green flex-shrink-0" />
                  <span className="text-sm sm:text-base">通关（错2+）</span>
                </div>
                <span className="font-bold text-game-green text-sm sm:text-base flex-shrink-0">+5</span>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">强化关卡通关</span>
                </div>
                <span className="font-bold text-orange-600 text-sm sm:text-base flex-shrink-0">2x 积分</span>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-game-green/20 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">新手奖励</span>
                </div>
                <span className="font-bold text-purple-600 text-sm sm:text-base flex-shrink-0">+100</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">如何获得星星</h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between p-2 sm:p-3 bg-game-orange/20 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">完美通关</span>
                </div>
                <span className="font-bold text-orange-600 text-sm sm:text-base flex-shrink-0">+2 星</span>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-game-orange/20 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">良好通关</span>
                </div>
                <span className="font-bold text-orange-500 text-sm sm:text-base flex-shrink-0">+1 星</span>
              </div>

              <div className="flex items-center justify-between p-2 sm:p-3 bg-game-orange/10 rounded-xl gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">新手奖励</span>
                </div>
                <span className="font-bold text-orange-500 text-sm sm:text-base flex-shrink-0">+5 星</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">成就奖杯</h3>
            </div>

            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              获得奖杯不仅是荣誉的象征，还能获得额外积分奖励哦！
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
              {trophiesData.map(trophy => (
                <div
                  key={trophy.id}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-game-purple/10 rounded-xl"
                >
                  <div className="text-2xl sm:text-3xl flex-shrink-0">{trophy.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-purple-700 text-sm sm:text-base">{trophy.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{trophy.condition}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-yellow-600 text-sm sm:text-base">+50</div>
                    <div className="text-xs text-gray-400">积分</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-2 sm:p-3 bg-game-yellow/30 rounded-xl">
              <div className="flex items-center gap-2 text-yellow-700 font-bold text-sm sm:text-base">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>每解锁一个奖杯，+50 积分！</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">积分可以做什么</h3>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-game-green/20 rounded-xl">
                <span className="text-xl sm:text-2xl flex-shrink-0">🎁</span>
                <div>
                  <div className="font-bold text-green-700 text-sm sm:text-base">兑换奖励</div>
                  <div className="text-xs sm:text-sm text-gray-500">用积分兑换礼物</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-game-green/20 rounded-xl">
                <span className="text-xl sm:text-2xl flex-shrink-0">🏆</span>
                <div>
                  <div className="font-bold text-green-700 text-sm sm:text-base">排行榜竞争</div>
                  <div className="text-xs sm:text-sm text-gray-500">积分越多排名越高</div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-game-green/20 rounded-xl">
                <span className="text-xl sm:text-2xl flex-shrink-0">⭐</span>
                <div>
                  <div className="font-bold text-green-700 text-sm sm:text-base">收集成就</div>
                  <div className="text-xs sm:text-sm text-gray-500">解锁更多奖杯</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-game-purple/10 to-game-blue/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-game-purple" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-game-purple">小提示</h3>
            </div>

            <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-game-purple flex-shrink-0">✨</span>
                <span>每天坚持学习，可获得"坚持不懈"成就</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-game-purple flex-shrink-0">🔥</span>
                <span>强化关卡积分翻倍，快速获得积分</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-game-purple flex-shrink-0">📚</span>
                <span>完成所有关卡，可获得"闯关大师"奖杯</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-game-purple flex-shrink-0">⭐</span>
                <span>星星越多，说明学习越认真</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="text-center mt-6 sm:mt-8">
          <Button onClick={() => navigate('/')} variant="primary" size="md" className="sm:px-8 sm:py-4 sm:text-lg w-full sm:w-auto">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};
