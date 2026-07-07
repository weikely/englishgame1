import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { rewardsData } from '../data/rewards';
import { trophiesData } from '../data/trophies';
import { allWordsData, categoryInfo, Category, WordData } from '../data/words';

interface GameRecord {
  id: string;
  gameType: 'word';
  score: number;
  level: number;
  date: string;
  earnedPoints: number;
  earnedStars: number;
}

interface RewardRecord {
  id: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  date: string;
  status: 'pending' | 'completed';
}

interface PointRecord {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  reason: string;
  date: string;
  detail?: string;
}

interface WordProgress {
  wordId: string;
  correctCount: number;
  errorCount: number;
  lastSeenDate: string;
}

interface LevelInfo {
  level: number;
  category: Category;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  words: WordData[];
  unlocked: boolean;
  completed: boolean;
}

interface GameState {
  points: number;
  stars: number;
  unlockedTrophies: string[];
  gameHistory: GameRecord[];
  rewardHistory: RewardRecord[];
  pointRecords: PointRecord[];
  consecutiveDays: number;
  lastPlayDate: string;
  currentLevel: number;
  maxLevel: number;
  wordTotalMatches: number;
  wordProgress: WordProgress[];
  completedLevels: number[];
  levelInfoList: LevelInfo[];

  addPoints: (amount: number, reason: string, detail?: string) => void;
  spendPoints: (amount: number, reason: string, detail?: string) => boolean;
  addStars: (amount: number) => void;
  unlockTrophy: (trophyId: string) => void;
  addGameRecord: (record: Omit<GameRecord, 'id' | 'date'>) => void;
  redeemReward: (rewardId: string) => boolean;
  checkDailyLogin: () => void;
  checkTrophyConditions: () => void;
  getUnlockedTrophyList: () => typeof trophiesData;
  getLockedTrophyList: () => typeof trophiesData;
  getWordsForLevel: (level: number, isBoostLevel?: boolean) => WordData[];
  getLevelInfo: (level: number) => LevelInfo | undefined;
  recordWordResult: (wordId: string, isCorrect: boolean) => void;
  getErrorWords: () => WordData[];
  completeLevel: (level: number, isBoostLevel?: boolean) => void;
  resetProgress: () => void;
  initializeLevels: () => void;
  getBoostLevelWords: () => WordData[];
  getPointRecords: () => PointRecord[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const PAIRS_PER_LEVEL = 6;

const generateLevels = (): LevelInfo[] => {
  const levels: LevelInfo[] = [];
  let levelCounter = 1;
  
  categoryInfo.forEach((category) => {
    const categoryWords = allWordsData.filter(w => w.category === category.id);
    
    for (let i = 0; i < categoryWords.length; i += PAIRS_PER_LEVEL) {
      const levelWords = categoryWords.slice(i, i + PAIRS_PER_LEVEL);
      
      levels.push({
        level: levelCounter++,
        category: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color,
        words: levelWords,
        unlocked: levelCounter <= 2,
        completed: false,
      });
    }
  });
  
  return levels;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 100,
      stars: 5,
      unlockedTrophies: [],
      gameHistory: [],
      rewardHistory: [],
      pointRecords: [{ id: generateId(), type: 'earn', amount: 100, reason: '新手奖励', date: new Date().toISOString() }],
      consecutiveDays: 0,
      lastPlayDate: '',
      currentLevel: 1,
      maxLevel: 0,
      wordTotalMatches: 0,
      wordProgress: [],
      completedLevels: [],
      levelInfoList: [],

      addPoints: (amount, reason, detail) => set((state) => {
        const newRecord: PointRecord = {
          id: generateId(),
          type: 'earn',
          amount,
          reason,
          detail,
          date: new Date().toISOString(),
        };
        return {
          points: state.points + amount,
          pointRecords: [newRecord, ...state.pointRecords],
        };
      }),

      spendPoints: (amount, reason, detail) => {
        const state = get();
        if (state.points < amount) return false;
        
        const newRecord: PointRecord = {
          id: generateId(),
          type: 'spend',
          amount,
          reason,
          detail,
          date: new Date().toISOString(),
        };
        
        set((state) => ({
          points: state.points - amount,
          pointRecords: [newRecord, ...state.pointRecords],
        }));
        
        return true;
      },

      addStars: (amount) => {
        set((state) => ({ stars: state.stars + amount }));
        get().checkTrophyConditions();
      },

      unlockTrophy: (trophyId) => {
        set((state) => {
          if (state.unlockedTrophies.includes(trophyId)) return state;
          return { unlockedTrophies: [...state.unlockedTrophies, trophyId] };
        });
        get().checkTrophyConditions();
      },

      addGameRecord: (record) => {
        set((state) => {
          const newRecord: GameRecord = {
            ...record,
            id: generateId(),
            date: new Date().toISOString(),
          };
          
          return {
            gameHistory: [newRecord, ...state.gameHistory],
            wordTotalMatches: state.wordTotalMatches + Math.floor(record.score / 20),
          };
        });
        get().checkDailyLogin();
        get().checkTrophyConditions();
      },

      redeemReward: (rewardId) => {
        const state = get();
        const reward = rewardsData.find((r) => r.id === rewardId);
        
        if (!reward || state.points < reward.price) {
          return false;
        }
        
        const newRecord: RewardRecord = {
          id: generateId(),
          rewardId,
          rewardName: reward.name,
          cost: reward.price,
          date: new Date().toISOString(),
          status: 'pending',
        };
        
        set((state) => ({
          rewardHistory: [newRecord, ...state.rewardHistory],
        }));
        
        get().spendPoints(reward.price, '兑换奖励', reward.name);
        
        return true;
      },

      checkDailyLogin: () => {
        const state = get();
        const today = new Date().toDateString();
        
        if (state.lastPlayDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (state.lastPlayDate === yesterday.toDateString()) {
            set((state) => ({ consecutiveDays: state.consecutiveDays + 1 }));
          } else {
            set({ consecutiveDays: 1 });
          }
          
          set({ lastPlayDate: today });
        }
      },

      checkTrophyConditions: () => {
        const state = get();
        
        if (state.wordTotalMatches >= 50 && !state.unlockedTrophies.includes('word-master')) {
          get().unlockTrophy('word-master');
        }
        
        if (state.completedLevels.length >= state.maxLevel && state.maxLevel > 0 && !state.unlockedTrophies.includes('level-master')) {
          get().unlockTrophy('level-master');
        }
        
        if (state.consecutiveDays >= 7 && !state.unlockedTrophies.includes('persistent')) {
          get().unlockTrophy('persistent');
        }
        
        if (state.stars >= 50 && !state.unlockedTrophies.includes('star-collector')) {
          get().unlockTrophy('star-collector');
        }
        
        const highScore = state.gameHistory.some((record) => record.score > 200);
        if (highScore && !state.unlockedTrophies.includes('high-score')) {
          get().unlockTrophy('high-score');
        }
        
        const nonAllRoundTrophies = trophiesData.filter((t) => t.id !== 'all-round');
        const unlockedNonAllRound = nonAllRoundTrophies.every((t) => 
          state.unlockedTrophies.includes(t.id)
        );
        if (unlockedNonAllRound && !state.unlockedTrophies.includes('all-round')) {
          get().unlockTrophy('all-round');
        }
      },

      getUnlockedTrophyList: () => {
        const state = get();
        return trophiesData.filter((t) => state.unlockedTrophies.includes(t.id));
      },

      getLockedTrophyList: () => {
        const state = get();
        return trophiesData.filter((t) => !state.unlockedTrophies.includes(t.id));
      },

      getWordsForLevel: (level, isBoostLevel = false) => {
        const state = get();
        
        if (isBoostLevel) {
          const errorWords = state.wordProgress
            .filter(p => p.errorCount > 0)
            .sort((a, b) => b.errorCount - a.errorCount)
            .slice(0, PAIRS_PER_LEVEL)
            .map(p => allWordsData.find(w => w.id === p.wordId))
            .filter(Boolean) as WordData[];
          
          if (errorWords.length >= PAIRS_PER_LEVEL) {
            return errorWords.sort(() => Math.random() - 0.5);
          }
          
          return errorWords.sort(() => Math.random() - 0.5);
        }
        
        const levelInfo = state.levelInfoList.find(l => l.level === level);
        
        if (!levelInfo) return [];
        
        const baseWords = levelInfo.words;
        
        const errorWords = state.wordProgress
          .filter(p => p.errorCount > 0 && !baseWords.some(w => w.id === p.wordId))
          .sort((a, b) => b.errorCount - a.errorCount)
          .slice(0, 2)
          .map(p => allWordsData.find(w => w.id === p.wordId))
          .filter(Boolean);
        
        const allWords = [...baseWords, ...errorWords as WordData[]];
        
        return allWords.sort(() => Math.random() - 0.5);
      },

      getLevelInfo: (level) => {
        const state = get();
        const levelInfo = state.levelInfoList.find(l => l.level === level);
        
        if (!levelInfo) return undefined;
        
        return {
          ...levelInfo,
          unlocked: level <= state.currentLevel + 1 || state.completedLevels.includes(level),
          completed: state.completedLevels.includes(level),
        };
      },

      recordWordResult: (wordId, isCorrect) => {
        set((state) => {
          const existingProgress = state.wordProgress.find(p => p.wordId === wordId);
          
          if (existingProgress) {
            return {
              wordProgress: state.wordProgress.map(p => 
                p.wordId === wordId
                  ? {
                      ...p,
                      correctCount: p.correctCount + (isCorrect ? 1 : 0),
                      errorCount: p.errorCount + (isCorrect ? 0 : 1),
                      lastSeenDate: new Date().toISOString(),
                    }
                  : p
              ),
            };
          }
          
          return {
            wordProgress: [
              ...state.wordProgress,
              {
                wordId,
                correctCount: isCorrect ? 1 : 0,
                errorCount: isCorrect ? 0 : 1,
                lastSeenDate: new Date().toISOString(),
              },
            ],
          };
        });
      },

      getErrorWords: () => {
        const state = get();
        return state.wordProgress
          .filter(p => p.errorCount > 0)
          .map(p => allWordsData.find(w => w.id === p.wordId))
          .filter(Boolean) as WordData[];
      },

      completeLevel: (level, isBoostLevel = false) => {
        set((state) => {
          if (!isBoostLevel && state.completedLevels.includes(level)) return state;
          
          if (isBoostLevel) {
            return state;
          }
          
          const newCompletedLevels = [...state.completedLevels, level];
          const nextLevel = Math.min(level + 1, state.maxLevel);
          
          return {
            completedLevels: newCompletedLevels,
            currentLevel: nextLevel,
            levelInfoList: state.levelInfoList.map(l => ({
              ...l,
              completed: l.level === level ? true : l.completed,
              unlocked: l.level === nextLevel ? true : l.unlocked,
            })),
          };
        });
        get().checkTrophyConditions();
      },

      resetProgress: () => {
        set({
          currentLevel: 1,
          completedLevels: [],
          wordProgress: [],
        });
        get().initializeLevels();
      },

      initializeLevels: () => {
        const levels = generateLevels();
        set({
          levelInfoList: levels,
          maxLevel: levels.length,
          currentLevel: 1,
        });
      },

      getBoostLevelWords: () => {
        const state = get();
        return state.wordProgress
          .filter(p => p.errorCount > 0)
          .map(p => allWordsData.find(w => w.id === p.wordId))
          .filter(Boolean) as WordData[];
      },

      getPointRecords: () => {
        return get().pointRecords;
      },
    }),
    {
      name: 'english-learning-game-storage',
    }
  )
);