export interface TrophyData {
  id: string;
  name: string;
  description: string;
  condition: string;
  icon: string;
}

export const trophiesData: TrophyData[] = [
  { 
    id: 'word-master', 
    name: '单词小达人', 
    description: '在单词游戏中表现出色！', 
    condition: '单词累计配对50个', 
    icon: '📖' 
  },
  { 
    id: 'level-master', 
    name: '闯关大师', 
    description: '完成所有关卡！', 
    condition: '完成全部关卡', 
    icon: '🏆' 
  },
  { 
    id: 'persistent', 
    name: '坚持不懈', 
    description: '连续7天坚持学习！', 
    condition: '连续7天玩游戏', 
    icon: '🔥' 
  },
  { 
    id: 'all-round', 
    name: '全能冠军', 
    description: '获得所有其他奖杯！', 
    condition: '解锁所有其他奖杯', 
    icon: '⭐' 
  },
  { 
    id: 'star-collector', 
    name: '星星收集者', 
    description: '收集了很多星星！', 
    condition: '累计获得50颗星星', 
    icon: '🌟' 
  },
  { 
    id: 'high-score', 
    name: '高分王', 
    description: '获得了很高的分数！', 
    condition: '任意关卡单次得分超过200', 
    icon: '💯' 
  },
];