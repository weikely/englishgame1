export interface RewardItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  type: 'physical' | 'digital' | 'money';
}

export const rewardsData: RewardItem[] = [
  { id: '1', name: '小贴纸', description: '可爱的卡通贴纸一张', price: 50, icon: '🎨', type: 'physical' },
  { id: '2', name: '漫画书', description: '有趣的漫画书一本', price: 200, icon: '📚', type: 'physical' },
  { id: '3', name: '玩具车', description: '酷炫的玩具车一辆', price: 500, icon: '🚗', type: 'physical' },
  { id: '4', name: '乐高积木', description: '好玩的乐高积木一套', price: 8000, icon: '🧱', type: 'physical' },
  { id: '5', name: '零花钱10元', description: '可以买自己喜欢的东西', price: 3000, icon: '💰', type: 'money' },
  { id: '6', name: '零花钱50元', description: '可以买更大的礼物', price: 12000, icon: '💵', type: 'money' },
  { id: '7', name: '冰淇淋', description: '美味的冰淇淋一个', price: 3000, icon: '🍦', type: 'physical' },
  { id: '8', name: '电影票', description: '去电影院看动画片', price: 300, icon: '🎬', type: 'physical' },
  { id: '9', name: '爸爸妈妈一个点赞', description: '获得爸爸妈妈的表扬和鼓励', price: 10, icon: '👍', type: 'physical' },
  { id: '10', name: '看动画片30分钟', description: '可以看30分钟动画片', price: 1000, icon: '📺', type: 'digital' },
];
