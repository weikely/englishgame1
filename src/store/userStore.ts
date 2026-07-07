import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserData {
  points: number;
  stars: number;
  unlockedTrophies: string[];
  gameHistory: any[];
  rewardHistory: any[];
  consecutiveDays: number;
  lastPlayDate: string;
  currentLevel: number;
  maxLevel: number;
  wordTotalMatches: number;
  wordProgress: any[];
  completedLevels: number[];
  levelInfoList: any[];
}

export interface User {
  username: string;
  createdAt: string;
  gameData: UserData;
}

interface UserState {
  currentUser: User | null;
  users: User[];
  register: (username: string) => boolean;
  login: (username: string) => boolean;
  logout: () => void;
  updateGameData: (data: Partial<UserData>) => void;
  getAllUsers: () => User[];
  isLoggedIn: () => boolean;
  initializeDefaultUsers: () => void;
}

const defaultGameData: UserData = {
  points: 100,
  stars: 5,
  unlockedTrophies: [],
  gameHistory: [],
  rewardHistory: [],
  consecutiveDays: 0,
  lastPlayDate: '',
  currentLevel: 1,
  maxLevel: 0,
  wordTotalMatches: 0,
  wordProgress: [],
  completedLevels: [],
  levelInfoList: [],
};

const defaultUsers: User[] = [
  {
    username: '小明同学',
    createdAt: '2026-07-01T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 15680,
      stars: 120,
      unlockedTrophies: ['word-master', 'level-master', 'persistent', 'star-collector', 'high-score', 'all-round'],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      currentLevel: 21,
      maxLevel: 30,
      wordTotalMatches: 250,
      consecutiveDays: 30,
    },
  },
  {
    username: '小红',
    createdAt: '2026-07-02T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 12350,
      stars: 98,
      unlockedTrophies: ['word-master', 'level-master', 'persistent', 'star-collector', 'high-score'],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      currentLevel: 18,
      maxLevel: 30,
      wordTotalMatches: 198,
      consecutiveDays: 25,
    },
  },
  {
    username: '小华',
    createdAt: '2026-07-03T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 9870,
      stars: 76,
      unlockedTrophies: ['word-master', 'level-master', 'persistent', 'star-collector'],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      currentLevel: 15,
      maxLevel: 30,
      wordTotalMatches: 156,
      consecutiveDays: 20,
    },
  },
  {
    username: '小李',
    createdAt: '2026-07-04T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 7620,
      stars: 58,
      unlockedTrophies: ['word-master', 'level-master', 'persistent'],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      currentLevel: 12,
      maxLevel: 30,
      wordTotalMatches: 120,
      consecutiveDays: 15,
    },
  },
  {
    username: '小王',
    createdAt: '2026-07-05T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 5430,
      stars: 42,
      unlockedTrophies: ['word-master', 'level-master'],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
      currentLevel: 9,
      maxLevel: 30,
      wordTotalMatches: 85,
      consecutiveDays: 12,
    },
  },
  {
    username: '小张',
    createdAt: '2026-07-06T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 3890,
      stars: 30,
      unlockedTrophies: ['word-master'],
      completedLevels: [1, 2, 3, 4, 5, 6],
      currentLevel: 7,
      maxLevel: 30,
      wordTotalMatches: 62,
      consecutiveDays: 8,
    },
  },
  {
    username: '小刘',
    createdAt: '2026-07-07T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 2650,
      stars: 22,
      unlockedTrophies: [],
      completedLevels: [1, 2, 3, 4, 5],
      currentLevel: 6,
      maxLevel: 30,
      wordTotalMatches: 45,
      consecutiveDays: 6,
    },
  },
  {
    username: '小陈',
    createdAt: '2026-07-08T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 1780,
      stars: 15,
      unlockedTrophies: [],
      completedLevels: [1, 2, 3, 4],
      currentLevel: 5,
      maxLevel: 30,
      wordTotalMatches: 32,
      consecutiveDays: 5,
    },
  },
  {
    username: '小杨',
    createdAt: '2026-07-09T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 1120,
      stars: 10,
      unlockedTrophies: [],
      completedLevels: [1, 2, 3],
      currentLevel: 4,
      maxLevel: 30,
      wordTotalMatches: 22,
      consecutiveDays: 4,
    },
  },
  {
    username: '小周',
    createdAt: '2026-07-10T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 680,
      stars: 6,
      unlockedTrophies: [],
      completedLevels: [1, 2],
      currentLevel: 3,
      maxLevel: 30,
      wordTotalMatches: 14,
      consecutiveDays: 3,
    },
  },
  {
    username: '小吴',
    createdAt: '2026-07-11T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 350,
      stars: 3,
      unlockedTrophies: [],
      completedLevels: [1],
      currentLevel: 2,
      maxLevel: 30,
      wordTotalMatches: 8,
      consecutiveDays: 2,
    },
  },
  {
    username: '小郑',
    createdAt: '2026-07-12T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 120,
      stars: 1,
      unlockedTrophies: [],
      completedLevels: [],
      currentLevel: 1,
      maxLevel: 30,
      wordTotalMatches: 3,
      consecutiveDays: 1,
    },
  },
];

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      initializeDefaultUsers: () => {
        set((state) => {
          const existingUsernames = new Set(state.users.map(u => u.username));
          const newUsers = defaultUsers.filter(u => !existingUsernames.has(u.username));
          if (newUsers.length > 0) {
            return { users: [...state.users, ...newUsers] };
          }
          return state;
        });
      },

      register: (username) => {
        const state = get();
        const existingUser = state.users.find(u => u.username === username);
        
        if (existingUser) {
          return false;
        }

        const newUser: User = {
          username,
          createdAt: new Date().toISOString(),
          gameData: { ...defaultGameData },
        };

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
        }));

        return true;
      },

      login: (username) => {
        const state = get();
        const user = state.users.find(u => u.username === username);
        
        if (!user) {
          return false;
        }

        set({ currentUser: user });
        return true;
      },

      logout: () => {
        set({ currentUser: null });
      },

      updateGameData: (data) => {
        const state = get();
        if (!state.currentUser) return;

        const updatedUserData = {
          ...state.currentUser,
          gameData: {
            ...state.currentUser.gameData,
            ...data,
          },
        };

        set((state) => ({
          currentUser: updatedUserData,
          users: state.users.map(u =>
            u.username === state.currentUser?.username ? updatedUserData : u
          ),
        }));
      },

      getAllUsers: () => {
        return get().users;
      },

      isLoggedIn: () => {
        return get().currentUser !== null;
      },
    }),
    {
      name: 'english-learning-game-users',
    }
  )
);
