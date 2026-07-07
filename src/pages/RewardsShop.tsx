import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, ShoppingCart, Check, Coins } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useGameStore } from '../store/gameStore';
import { rewardsData } from '../data/rewards';

export const RewardsShop: React.FC = () => {
  const navigate = useNavigate();
  const { points, redeemReward, rewardHistory } = useGameStore();
  
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRedeem = (rewardId: string) => {
    setRedeemingId(rewardId);
    
    setTimeout(() => {
      const success = redeemReward(rewardId);
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
      
      setRedeemingId(null);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          
          <div className="flex items-center gap-2 bg-game-yellow/30 px-6 py-3 rounded-full">
            <Coins className="w-6 h-6 text-yellow-600" />
            <span className="text-2xl font-bold text-yellow-700">{points}</span>
            <span className="text-yellow-600">积分</span>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-game-green text-white px-8 py-6 rounded-2xl shadow-2xl text-center animate-pop">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-xl font-bold">兑换成功！</div>
              <div className="text-sm opacity-80">请找爸爸妈妈领取奖励</div>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg">奖励商店</h2>
          <p className="text-white/80 mt-2">用积分兑换你喜欢的礼物吧！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {rewardsData.map(reward => {
            const canAfford = points >= reward.price;
            
            return (
              <Card key={reward.id} className="relative">
                <div className="text-center">
                  <div className={`text-5xl mb-4 ${!canAfford ? 'opacity-50' : ''}`}>
                    {reward.icon}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${!canAfford ? 'text-gray-400' : 'text-gray-800'}`}>
                    {reward.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{reward.description}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Coins className={`w-5 h-5 ${canAfford ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span className={`text-2xl font-bold ${canAfford ? 'text-yellow-600' : 'text-gray-400'}`}>
                      {reward.price}
                    </span>
                  </div>
                  
                  <Badge variant={reward.type === 'money' ? 'warning' : 'success'}>
                    {reward.type === 'money' ? '零花钱' : '实物奖励'}
                  </Badge>
                </div>
                
                <Button
                  onClick={() => handleRedeem(reward.id)}
                  disabled={!canAfford || redeemingId === reward.id}
                  variant={canAfford ? 'success' : 'secondary'}
                  className="w-full mt-4"
                >
                  {redeemingId === reward.id ? (
                    <span className="flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 mr-2 animate-spin" />
                      兑换中...
                    </span>
                  ) : canAfford ? (
                    <span className="flex items-center justify-center">
                      <Gift className="w-5 h-5 mr-2" />
                      兑换
                    </span>
                  ) : (
                    '积分不足'
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {rewardHistory.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Check className="w-6 h-6 text-game-green" />
              我的兑换记录
            </h3>
            <div className="space-y-3">
              {rewardHistory.slice(0, 10).map(record => (
                <div 
                  key={record.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎁</div>
                    <div>
                      <div className="font-bold text-gray-800">{record.rewardName}</div>
                      <div className="text-sm text-gray-500">{formatDate(record.date)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-game-pink">-{record.cost}</div>
                    <Badge variant="success" className="text-xs">
                      {record.status === 'pending' ? '待领取' : '已领取'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
