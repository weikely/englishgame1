import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, Coins, Medal, Crown } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useUserStore } from '../store/userStore';
import { trophiesData } from '../data/trophies';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { getAllUsers, currentUser } = useUserStore();

  const users = getAllUsers();

  const sortedUsers = [...users].sort((a, b) => {
    if (b.gameData.points !== a.gameData.points) {
      return b.gameData.points - a.gameData.points;
    }
    if (b.gameData.completedLevels.length !== a.gameData.completedLevels.length) {
      return b.gameData.completedLevels.length - a.gameData.completedLevels.length;
    }
    return b.gameData.stars - a.gameData.stars;
  });

  const currentUserIndex = currentUser 
    ? sortedUsers.findIndex(u => u.username === currentUser.username)
    : -1;
  const currentRank = currentUserIndex >= 0 ? currentUserIndex + 1 : null;

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-500">{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400';
    if (index === 1) return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-600';
    return 'bg-white';
  };

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
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            排行榜
          </div>

          <div className="w-16 sm:w-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8 max-w-4xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">学习排行榜</h2>
          <p className="text-white/80 mt-2 text-sm sm:text-base">看看谁是英语小达人！</p>
          {currentRank && (
            <div className="mt-4 inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
              <span className="text-gray-600">我的排名：</span>
              <span className="text-2xl sm:text-3xl font-bold text-game-purple ml-2">第 {currentRank} 名</span>
              <span className="text-gray-500 ml-2">/ 共 {sortedUsers.length} 人</span>
            </div>
          )}
        </div>

        {sortedUsers.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">👤</div>
            <p className="text-gray-500">还没有其他玩家</p>
            <p className="text-gray-400 text-sm mt-2">邀请朋友一起来学习吧！</p>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sortedUsers.map((user, index) => {
              const isCurrentUser = currentUser?.username === user.username;
              const userTrophies = trophiesData.filter(t =>
                user.gameData.unlockedTrophies.includes(t.id)
              );

              return (
                <Card
                  key={user.username}
                  className={`${getRankBg(index)} ${
                    isCurrentUser 
                      ? 'ring-4 ring-game-purple shadow-xl scale-[1.02] relative' 
                      : ''
                  } border-2 transition-all`}
                >
                  {isCurrentUser && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-game-purple to-game-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                      就是我！
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="w-8 sm:w-12 flex justify-center flex-shrink-0">
                      {getRankIcon(index)}
                    </div>

                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-game-purple to-game-blue rounded-full flex items-center justify-center text-white text-base sm:text-xl font-bold flex-shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-gray-800 truncate">
                          {user.username}
                        </span>
                        {isCurrentUser && (
                          <span className="bg-game-purple text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                            我
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 mt-1">
                        {user.gameData.completedLevels.length} 关 · {userTrophies.length} 奖杯
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 sm:gap-2 justify-end mb-1">
                        <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                        <span className="text-base sm:text-xl font-bold text-yellow-600">
                          {user.gameData.points}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 justify-end">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                        <span className="text-xs sm:text-sm text-orange-500">
                          {user.gameData.stars}
                        </span>
                      </div>
                    </div>
                  </div>

                  {userTrophies.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {userTrophies.slice(0, 6).map(trophy => (
                          <div
                            key={trophy.id}
                            className="text-xl sm:text-2xl"
                            title={trophy.name}
                          >
                            {trophy.icon}
                          </div>
                        ))}
                        {userTrophies.length > 6 && (
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            +{userTrophies.length - 6}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-center mt-6 sm:mt-8">
          <Button onClick={() => navigate('/')} variant="primary" size="md" className="sm:px-8 sm:py-4 sm:text-lg w-full sm:w-auto">
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
};
