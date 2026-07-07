import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { WordMatch } from "@/pages/WordMatch";
import { RewardsShop } from "@/pages/RewardsShop";
import { AchievementCenter } from "@/pages/AchievementCenter";
import { LoginPage } from "@/pages/LoginPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { PointsRulesPage } from "@/pages/PointsRulesPage";
import { PointsHistoryPage } from "@/pages/PointsHistoryPage";
import { Header } from "@/components/layout/Header";
import { useUserStore } from "@/store/userStore";
import { useGameStore } from "@/store/gameStore";
import { currentVersion } from "@/data/version";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  state = { hasError: false, error: '' };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
            <div className="text-5xl mb-4">😵</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">出了点问题</h2>
            <p className="text-gray-600 mb-4">{this.state.error}</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: '' }); window.location.reload(); }}
              className="bg-purple-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-600 transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const location = useLocation();
  const currentUser = useUserStore((s) => s.currentUser);
  const updateGameData = useUserStore((s) => s.updateGameData);
  const initializeDefaultUsers = useUserStore((s) => s.initializeDefaultUsers);
  const { 
    points, 
    stars, 
    unlockedTrophies, 
    gameHistory, 
    rewardHistory,
    consecutiveDays,
    lastPlayDate,
    currentLevel,
    maxLevel,
    wordTotalMatches,
    wordProgress,
    completedLevels,
    levelInfoList,
    pointRecords,
    initializeLevels,
  } = useGameStore();

  const isLoginPage = location.pathname === '/login';
  const prevUserRef = useRef<string | null>(null);

  useEffect(() => {
    initializeDefaultUsers();
  }, [initializeDefaultUsers]);

  useEffect(() => {
    const savedVersion = localStorage.getItem('app_version');
    if (savedVersion !== currentVersion) {
      localStorage.setItem('app_version', currentVersion);
      console.log(`版本更新: ${savedVersion || 'none'} -> ${currentVersion}`);
    }
  }, [currentVersion]);

  useEffect(() => {
    const migrateUserData = () => {
      const userStoreKey = 'english-learning-game-users';
      const gameStoreKey = 'english-learning-game-storage';
      
      const userData = localStorage.getItem(userStoreKey);
      const gameData = localStorage.getItem(gameStoreKey);
      
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          if (!parsed._persist) {
            localStorage.setItem(userStoreKey, JSON.stringify({
              ...parsed,
              _persist: { version: 1, rehydrated: true }
            }));
          }
        } catch (e) {
          console.error('用户数据迁移失败:', e);
        }
      }
      
      if (gameData) {
        try {
          const parsed = JSON.parse(gameData);
          if (!parsed._persist) {
            localStorage.setItem(gameStoreKey, JSON.stringify({
              ...parsed,
              _persist: { version: 1, rehydrated: true }
            }));
          }
        } catch (e) {
          console.error('游戏数据迁移失败:', e);
        }
      }
    };
    
    migrateUserData();
  }, []);

  useEffect(() => {
    const username = currentUser?.username || null;
    if (username && username !== prevUserRef.current && levelInfoList.length === 0) {
      initializeLevels();
    }
    prevUserRef.current = username;
  }, [currentUser?.username, levelInfoList.length, initializeLevels]);

  // 同步游戏数据到用户记录（不依赖 currentUser 避免死循环）
  useEffect(() => {
    const user = useUserStore.getState().currentUser;
    if (user) {
      updateGameData({
        points,
        stars,
        unlockedTrophies,
        gameHistory,
        rewardHistory,
        consecutiveDays,
        lastPlayDate,
        currentLevel,
        maxLevel,
        wordTotalMatches,
        wordProgress,
        completedLevels,
        levelInfoList,
        pointRecords,
      } as any);
    }
  }, [
    points, 
    stars, 
    unlockedTrophies, 
    gameHistory, 
    rewardHistory,
    consecutiveDays,
    lastPlayDate,
    currentLevel,
    maxLevel,
    wordTotalMatches,
    wordProgress,
    completedLevels,
    levelInfoList,
    pointRecords,
    updateGameData,
  ]);

  return (
    <>
      {!isLoginPage && currentUser && <Header />}
      <Routes>
        <Route path="/" element={
          currentUser ? <HomePage /> : <Navigate to="/login" replace />
        } />
        <Route path="/word-match" element={
          currentUser ? <WordMatch /> : <Navigate to="/login" replace />
        } />
        <Route path="/rewards" element={
          currentUser ? <RewardsShop /> : <Navigate to="/login" replace />
        } />
        <Route path="/achievements" element={
          currentUser ? <AchievementCenter /> : <Navigate to="/login" replace />
        } />
        <Route path="/leaderboard" element={
          currentUser ? <LeaderboardPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/points-rules" element={
          currentUser ? <PointsRulesPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/points-history" element={
          currentUser ? <PointsHistoryPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router basename="/englishgame1">
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}