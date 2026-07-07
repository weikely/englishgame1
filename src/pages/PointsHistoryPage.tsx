import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useGameStore } from '../store/gameStore';

type FilterType = 'all' | 'earn' | 'spend';

export const PointsHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { getPointRecords, points } = useGameStore();
  const [filter, setFilter] = useState<FilterType>('all');

  const records = getPointRecords();
  
  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    return record.type === filter;
  });

  const totalEarned = records
    .filter(r => r.type === 'earn')
    .reduce((sum, r) => sum + r.amount, 0);
    
  const totalSpent = records
    .filter(r => r.type === 'spend')
    .reduce((sum, r) => sum + r.amount, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
            积分记录
          </div>

          <div className="w-16 sm:w-20"></div>
        </div>
      </div>

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-8 max-w-3xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">💰</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">积分明细</h2>
          <p className="text-white/80 mt-2 text-sm sm:text-base">查看你的积分变动记录</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="text-center bg-yellow-50">
            <div className="text-xs sm:text-sm text-yellow-600 mb-1">当前积分</div>
            <div className="text-xl sm:text-3xl font-bold text-yellow-600">{points}</div>
          </Card>
          <Card className="text-center bg-green-50">
            <div className="text-xs sm:text-sm text-green-600 mb-1">累计获得</div>
            <div className="text-xl sm:text-3xl font-bold text-green-600">+{totalEarned}</div>
          </Card>
          <Card className="text-center bg-red-50">
            <div className="text-xs sm:text-sm text-red-600 mb-1">累计消耗</div>
            <div className="text-xl sm:text-3xl font-bold text-red-600">-{totalSpent}</div>
          </Card>
        </div>

        <div className="flex gap-2 mb-4 sm:mb-6">
          <button
            className={`flex-1 py-2 px-2 sm:px-4 rounded-xl font-bold transition-all text-sm sm:text-base ${
              filter === 'all'
                ? 'bg-game-purple text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('all')}
          >
            全部
          </button>
          <button
            className={`flex-1 py-2 px-2 sm:px-4 rounded-xl font-bold transition-all text-sm sm:text-base ${
              filter === 'earn'
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('earn')}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            获取
          </button>
          <button
            className={`flex-1 py-2 px-2 sm:px-4 rounded-xl font-bold transition-all text-sm sm:text-base ${
              filter === 'spend'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('spend')}
          >
            <TrendingDown className="w-4 h-4 inline mr-1" />
            消耗
          </button>
        </div>

        {filteredRecords.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500">
              {filter === 'all' ? '还没有积分记录' :
               filter === 'earn' ? '还没有获得积分' : '还没有消耗积分'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              开始游戏就能获得积分哦！
            </p>
          </Card>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {filteredRecords.map(record => (
              <Card key={record.id}>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    record.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {record.type === 'earn' ? (
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{record.reason}</div>
                    {record.detail && (
                      <div className="text-xs sm:text-sm text-gray-500">{record.detail}</div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(record.date)}
                    </div>
                  </div>

                  <div className={`text-base sm:text-xl font-bold flex-shrink-0 ${
                    record.type === 'earn' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {record.type === 'earn' ? '+' : '-'}{record.amount}
                  </div>
                </div>
              </Card>
            ))}
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
