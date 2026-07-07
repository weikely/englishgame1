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
      points: 2580,
      stars: 45,
      unlockedTrophies: ['word-master', 'level-master', 'persistent', 'star-collector'],
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      currentLevel: 11,
      maxLevel: 15,
      wordTotalMatches: 85,
      consecutiveDays: 7,
    },
  },
  {
    username: '小红',
    createdAt: '2026-07-02T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 1890,
      stars: 32,
      unlockedTrophies: ['word-master', 'level-master'],
      completedLevels: [1, 2, 3, 4, 5, 6, 7],
      currentLevel: 8,
      maxLevel: 15,
      wordTotalMatches: 62,
      consecutiveDays: 5,
    },
  },
  {
    username: '小华',
    createdAt: '2026-07-03T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 1450,
      stars: 28,
      unlockedTrophies: ['word-master'],
      completedLevels: [1, 2, 3, 4, 5],
      currentLevel: 6,
      maxLevel: 15,
      wordTotalMatches: 50,
      consecutiveDays: 3,
    },
  },
  {
    username: '小李',
    createdAt: '2026-07-04T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 980,
      stars: 18,
      unlockedTrophies: [],
      completedLevels: [1, 2, 3],
      currentLevel: 4,
      maxLevel: 15,
      wordTotalMatches: 30,
      consecutiveDays: 2,
    },
  },
  {
    username: '小王',
    createdAt: '2026-07-05T00:00:00.000Z',
    gameData: {
      ...defaultGameData,
      points: 520,
      stars: 10,
      unlockedTrophies: [],
      completedLevels: [1, 2],
      currentLevel: 3,
      maxLevel: 15,
      wordTotalMatches: 18,
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
