import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, Volume2, Trophy, Star, ChevronRight, Map, BookOpen } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useSound } from '../hooks/useSound';
import { useGameStore } from '../store/gameStore';
import { allWordsData, WordData, categoryInfo } from '../data/words';

interface CardItem {
  id: string;
  type: 'image' | 'word';
  wordId: string;
  content: string;
  matched: boolean;
}

export const WordMatch: React.FC = () => {
  const navigate = useNavigate();
  const { 
    addPoints, 
    addStars, 
    addGameRecord, 
    getWordsForLevel, 
    getLevelInfo,
    recordWordResult,
    completeLevel,
    currentLevel,
    maxLevel,
    completedLevels,
    initializeLevels,
    levelInfoList,
    getErrorWords,
    getBoostLevelWords,
  } = useGameStore();
  const { playSuccess, playError, playLevelComplete, speakWord, speakSentence, speakChinese, cancelSpeech } = useSound();
  
  const [gameState, setGameState] = useState<'level-select' | 'playing' | 'level-complete' | 'all-complete'>('level-select');
  const [selectedLevel, setSelectedLevel] = useState<number>(currentLevel);
  const [isBoostLevel, setIsBoostLevel] = useState(false);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [currentWords, setCurrentWords] = useState<WordData[]>([]);
  const [showSentencePopup, setShowSentencePopup] = useState(false);
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [currentChinese, setCurrentChinese] = useState('');
  const [errorCounts, setErrorCounts] = useState<Record<string, number>>({});
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [hintWord, setHintWord] = useState('');
  const [hintChinese, setHintChinese] = useState('');
  const PAIRS_PER_LEVEL = 6;

  useEffect(() => {
    if (levelInfoList.length === 0) {
      initializeLevels();
    }
  }, [levelInfoList.length, initializeLevels]);

  const shuffleArray = useCallback((array: CardItem[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const initializeLevel = useCallback((level: number, boostLevel = false) => {
    const levelWords = getWordsForLevel(level, boostLevel);
    setCurrentWords(levelWords);
    
    const gameCards: CardItem[] = [];
    
    levelWords.forEach(word => {
      gameCards.push({
        id: `img-${word.id}`,
        type: 'image',
        wordId: word.id,
        content: word.image,
        matched: false,
      });
      gameCards.push({
        id: `word-${word.id}`,
        type: 'word',
        wordId: word.id,
        content: word.word,
        matched: false,
      });
    });
    
    setCards(shuffleArray(gameCards));
  }, [getWordsForLevel, shuffleArray]);

  const startLevel = useCallback((level: number, boostLevel = false) => {
    setSelectedLevel(level);
    setIsBoostLevel(boostLevel);
    setGameState('playing');
    setScore(0);
    setSelectedCards([]);
    setMatchedCount(0);
    setErrorCounts({});
    setShowSentencePopup(false);
    cancelSpeech();
    initializeLevel(level, boostLevel);
  }, [initializeLevel, cancelSpeech]);

  const handleCardClick = useCallback((card: CardItem) => {
    if (gameState !== 'playing' || card.matched) return;
    if (selectedCards.length >= 2) return;
    if (selectedCards.includes(card.id)) return;

    const newSelected = [...selectedCards, card.id];
    setSelectedCards(newSelected);
    
    if (card.type === 'word') {
      speakWord(card.content);
    }

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = cards.find(c => c.id === firstId)!;
      const secondCard = cards.find(c => c.id === secondId)!;

      if (firstCard.type !== secondCard.type && firstCard.wordId === secondCard.wordId) {
        setScore(prev => prev + 20);
        setMatchedCount(prev => prev + 1);
        playSuccess();
        
        setCards(prev => prev.map(c => 
          c.wordId === firstCard.wordId ? { ...c, matched: true } : c
        ));
        
        const wordData = allWordsData.find(w => w.id === firstCard.wordId);
        if (wordData) {
          recordWordResult(wordData.id, true);
          
          setCurrentWord(wordData.word);
          setCurrentChinese(wordData.chinese);
          setCurrentSentence(wordData.sentence);
          setShowSentencePopup(true);
          
          setTimeout(() => {
            speakSentence(wordData.sentence, () => {
              setShowSentencePopup(false);
            });
          }, 100);
        }
      } else {
        setScore(prev => Math.max(0, prev - 5));
        playError();
        
        const firstWordId = firstCard.wordId;
        const secondWordId = secondCard.wordId;
        recordWordResult(firstWordId, false);
        recordWordResult(secondWordId, false);
        
        setErrorCounts(prev => ({
          ...prev,
          [firstWordId]: (prev[firstWordId] || 0) + 1,
          [secondWordId]: (prev[secondWordId] || 0) + 1,
        }));
        
        const checkHint = (wordId: string) => {
          const count = (errorCounts[wordId] || 0) + 1;
          if (count >= 2) {
            const wordData = allWordsData.find(w => w.id === wordId);
            if (wordData) {
              setHintWord(wordData.word);
              setHintChinese(wordData.chinese);
              setShowHintPopup(true);
              setTimeout(() => setShowHintPopup(false), 2000);
            }
          }
        };
        
        checkHint(firstWordId);
        checkHint(secondWordId);
      }

      setTimeout(() => {
        setSelectedCards([]);
      }, 500);
    }
  }, [gameState, selectedCards, cards, playSuccess, playError, speakWord, speakSentence, recordWordResult, errorCounts]);

  const completeCurrentLevel = useCallback(() => {
    setGameState('level-complete');
    
    const basePoints = matchedCount >= PAIRS_PER_LEVEL ? 30 : matchedCount >= PAIRS_PER_LEVEL - 2 ? 15 : 5;
    const earnedPoints = isBoostLevel ? basePoints * 2 : basePoints;
    const earnedStars = matchedCount >= PAIRS_PER_LEVEL ? 2 : matchedCount >= PAIRS_PER_LEVEL - 2 ? 1 : 0;
    
    const reason = isBoostLevel ? '强化关卡通关' : '闯关通关';
    const detail = isBoostLevel ? `第${selectedLevel}关（积分翻倍）` : `第${selectedLevel}关`;
    
    addPoints(earnedPoints, reason, detail);
    addStars(earnedStars);
    addGameRecord({ gameType: 'word', score, level: selectedLevel, earnedPoints, earnedStars });
    
    if (matchedCount >= PAIRS_PER_LEVEL && !isBoostLevel) {
      completeLevel(selectedLevel);
      playLevelComplete();
    }
    
    if (matchedCount >= PAIRS_PER_LEVEL && isBoostLevel) {
      playLevelComplete();
    }
    
    if (selectedLevel >= maxLevel && completedLevels.length >= maxLevel && !isBoostLevel) {
      setGameState('all-complete');
    }
  }, [matchedCount, score, selectedLevel, maxLevel, completedLevels, isBoostLevel, addPoints, addStars, addGameRecord, completeLevel, playLevelComplete]);

  useEffect(() => {
    if (gameState === 'playing' && matchedCount === currentWords.length) {
      setTimeout(completeCurrentLevel, 1000);
    }
  }, [gameState, matchedCount, currentWords.length, completeCurrentLevel]);

  const goToLevelSelect = useCallback(() => {
    setGameState('level-select');
    setSelectedLevel(currentLevel);
  }, [currentLevel]);

  const nextLevel = useCallback(() => {
    if (selectedLevel < maxLevel) {
      startLevel(selectedLevel + 1);
    } else {
      setGameState('level-select');
    }
  }, [selectedLevel, maxLevel, startLevel]);

  const groupedLevels = categoryInfo.reduce((acc, category) => {
    const levels = levelInfoList.filter(l => l.category === category.id);
    if (levels.length > 0) {
      acc.push({
        category,
        levels,
      });
    }
    return acc;
  }, [] as { category: typeof categoryInfo[0]; levels: typeof levelInfoList }[]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white/80 backdrop-blur-md shadow-lg p-2 sm:p-4">
        <div className="container mx-auto">
          {/* 顶部行：返回按钮 + 标题 */}
          <div className="flex items-center justify-between mb-2 sm:mb-0">
            <Button
              onClick={() => navigate('/')}
              variant="secondary"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              返回
            </Button>

            {gameState !== 'playing' && (
              <div className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-game-purple">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                单词闯关
              </div>
            )}
          </div>

          {/* 游戏中状态栏：移动端 grid 布局，桌面端 flex 布局 */}
          {gameState === 'playing' && (
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2 sm:gap-4 lg:gap-8">
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-500">关卡</div>
                <div className="text-base sm:text-2xl font-bold text-game-purple truncate">
                  {isBoostLevel ? '强化关' : `第 ${selectedLevel} 关`}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-500">主题</div>
                {isBoostLevel ? (
                  <div className="text-sm sm:text-lg font-bold text-orange-500 flex items-center justify-center gap-1 sm:gap-2">
                    <span>🔥</span>
                    <span>强化练习</span>
                  </div>
                ) : (
                  getLevelInfo(selectedLevel) && (
                    <div className="text-sm sm:text-lg font-bold text-game-orange flex items-center justify-center gap-1 sm:gap-2">
                      <span>{getLevelInfo(selectedLevel)!.categoryIcon}</span>
                      <span className="truncate">{getLevelInfo(selectedLevel)!.categoryName}</span>
                    </div>
                  )
                )}
              </div>

              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-500">得分</div>
                <div className="text-2xl sm:text-4xl font-bold text-game-blue">{score}</div>
              </div>

              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-500">配对</div>
                <div className="text-2xl sm:text-4xl font-bold text-game-green">{matchedCount}/{currentWords.length}</div>
              </div>

              {isBoostLevel && (
                <div className="col-span-2 sm:col-span-1 text-center">
                  <div className="inline-block bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-sm sm:text-base">
                    🔥 积分翻倍
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showSentencePopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20"
          onClick={() => setShowSentencePopup(false)}
        >
          <Card 
            className="text-center bg-game-yellow/90 w-full max-w-md animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl sm:text-4xl mb-2">✨</div>
            <div 
              className="text-xl sm:text-2xl font-bold text-game-purple mb-1 cursor-pointer hover:text-game-blue transition-colors"
              onClick={() => speakWord(currentWord)}
            >{currentWord}</div>
            <div 
              className="text-lg sm:text-xl font-medium text-game-green mb-2 cursor-pointer hover:text-game-orange transition-colors"
              onClick={() => speakChinese(currentChinese)}
            >{currentChinese}</div>
            <div className="text-base sm:text-lg text-gray-700 italic">"{currentSentence}"</div>
            <Button
              onClick={() => speakSentence(currentSentence)}
              variant="primary"
              size="sm"
              className="mt-3"
            >
              <Volume2 className="w-4 h-4 inline mr-1" />
              再听一遍
            </Button>
          </Card>
        </div>
      )}

      {showHintPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20">
          <Card className="text-center bg-game-blue/90 w-full max-w-md animate-pop">
            <div className="text-3xl sm:text-4xl mb-2">💡</div>
            <div className="text-xl sm:text-2xl font-bold text-white mb-1">{hintWord}</div>
            <div className="text-lg sm:text-xl font-medium text-yellow-300">意思是：{hintChinese}</div>
          </Card>
        </div>
      )}

      <div className="flex-1 py-4 px-3 sm:py-8 sm:px-4">
        {gameState === 'level-select' && (
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🗺️</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">选择关卡</h2>
              <p className="text-white/80 mt-2 text-sm sm:text-base">已完成 {completedLevels.length}/{maxLevel} 关</p>
            </div>

            {getErrorWords().length > 0 && (
              <div className="mb-6 sm:mb-8">
                <Card
                  className="bg-gradient-to-r from-orange-400 to-red-500 text-white cursor-pointer hover:scale-[1.02] transition-transform"
                  onClick={() => startLevel(0, true)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                      <div className="text-3xl sm:text-5xl flex-shrink-0">🔥</div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-2xl font-bold">强化关卡</h3>
                        <p className="text-white/80 text-xs sm:text-base">专练易错单词，积分翻倍！</p>
                        <p className="text-xs text-white/70 mt-1">
                          共 {getErrorWords().length} 个易错单词
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl sm:text-3xl font-bold">2x</div>
                      <div className="text-xs sm:text-sm text-white/80">积分翻倍</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {groupedLevels.map(({ category, levels }) => (
              <div key={category.id} className="mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">{category.icon}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow">{category.name}</h3>
                  <div className="flex-1 h-1 bg-white/30 rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                  {levels.map((levelInfo) => {
                    const isCompleted = completedLevels.includes(levelInfo.level);
                    const isCurrent = levelInfo.level === currentLevel;
                    const isLocked = levelInfo.level > currentLevel + 1 && !isCompleted;

                    return (
                      <Card
                        key={levelInfo.level}
                        className={`text-center cursor-pointer transition-all ${
                          isLocked
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:scale-105 hover:shadow-xl'
                        } ${isCurrent ? 'ring-4 ring-game-purple' : ''}`}
                        onClick={() => !isLocked && startLevel(levelInfo.level)}
                      >
                        <div className="relative">
                          <div className={`text-3xl sm:text-4xl mb-2 ${isCompleted ? 'text-game-green' : 'text-gray-400'}`}>
                            {isCompleted ? '🏆' : isLocked ? '🔒' : '⭐'}
                          </div>
                          <div className={`text-base sm:text-xl font-bold ${isCurrent ? 'text-game-purple' : 'text-gray-700'}`}>
                            第 {levelInfo.level} 关
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">
                            {levelInfo.words.length} 个单词
                          </div>

                          {isCompleted && (
                            <Badge variant="success" className="mt-2">已完成</Badge>
                          )}
                          {isCurrent && !isCompleted && (
                            <Badge variant="warning" className="mt-2">当前</Badge>
                          )}
                          {isLocked && (
                            <Badge variant="default" className="mt-2">未解锁</Badge>
                          )}
                        </div>

                        {!isLocked && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              startLevel(levelInfo.level);
                            }}
                            variant={isCurrent ? 'primary' : 'secondary'}
                            size="sm"
                            className="mt-3"
                          >
                            <Play className="w-4 h-4 inline mr-1" />
                            开始
                          </Button>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="text-center mt-6 sm:mt-8">
              <Button onClick={() => navigate('/')} variant="primary" size="md" className="sm:px-8 sm:py-4 sm:text-lg w-full sm:w-auto">
                <Map className="w-5 h-5 inline mr-2" />
                返回首页
              </Button>
            </div>
          </div>
        )}

        {gameState === 'level-complete' && (
          <div className="flex items-center justify-center h-full px-3">
            <Card className="text-center max-w-md w-full">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
                {matchedCount >= Math.min(PAIRS_PER_LEVEL, currentWords.length) ? '🎉' : '💪'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-game-orange mb-3 sm:mb-4">
                {isBoostLevel ? '强化关卡完成！' : matchedCount >= Math.min(PAIRS_PER_LEVEL, currentWords.length) ? '关卡完成！' : '继续努力！'}
              </h2>
              <div className="text-4xl sm:text-5xl font-bold text-game-purple mb-2">{score}</div>
              <div className="text-gray-600 mb-2 text-sm sm:text-base">本关得分</div>
              <div className="text-base sm:text-xl text-game-green mb-4">成功配对 {matchedCount} 组！</div>

              {isBoostLevel && (
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold mb-4 inline-block text-sm sm:text-base">
                  🔥 积分翻倍奖励
                </div>
              )}

              {!isBoostLevel && getLevelInfo(selectedLevel) && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-2xl">{getLevelInfo(selectedLevel)!.categoryIcon}</span>
                  <span className="text-base sm:text-lg text-gray-600">{getLevelInfo(selectedLevel)!.categoryName}</span>
                </div>
              )}

              {matchedCount >= Math.min(PAIRS_PER_LEVEL, currentWords.length) && (
                <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-game-yellow/30 px-3 py-2 sm:px-4 rounded-full">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-yellow-700 text-sm sm:text-base">
                      +{matchedCount >= Math.min(PAIRS_PER_LEVEL, currentWords.length) ? 2 : 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-game-green/30 px-3 py-2 sm:px-4 rounded-full">
                    <Trophy className="w-5 h-5 text-green-500" />
                    <span className="font-bold text-green-700 text-sm sm:text-base">
                      {isBoostLevel ? '强化完成' : '关卡解锁'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
                {!isBoostLevel && matchedCount >= Math.min(PAIRS_PER_LEVEL, currentWords.length) && selectedLevel < maxLevel && (
                  <Button onClick={nextLevel} variant="success" size="sm" className="sm:px-8 sm:py-4 sm:text-lg">
                    下一关
                    <ChevronRight className="w-5 h-5 inline ml-2" />
                  </Button>
                )}
                <Button onClick={() => startLevel(selectedLevel, isBoostLevel)} variant="secondary" size="sm" className="sm:px-8 sm:py-4 sm:text-lg">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                  {isBoostLevel ? '再来一次' : '重玩本关'}
                </Button>
                <Button onClick={goToLevelSelect} variant="primary" size="sm" className="sm:px-8 sm:py-4 sm:text-lg">
                  选择关卡
                </Button>
              </div>
            </Card>
          </div>
        )}

        {gameState === 'all-complete' && (
          <div className="flex items-center justify-center h-full px-3">
            <Card className="text-center max-w-md w-full">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🏆</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-game-orange mb-3 sm:mb-4">恭喜通关！</h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                你已经完成了所有关卡！<br />
                你是真正的单词小达人！
              </p>
              <div className="text-3xl sm:text-4xl font-bold text-game-purple mb-4">
                共学习 {allWordsData.length} 个单词
              </div>
              <div className="flex gap-2 sm:gap-4 justify-center flex-wrap">
                <Button onClick={goToLevelSelect} variant="success" size="sm" className="sm:px-8 sm:py-4 sm:text-lg">
                  重玩关卡
                </Button>
                <Button onClick={() => navigate('/')} variant="primary" size="sm" className="sm:px-8 sm:py-4 sm:text-lg">
                  返回首页
                </Button>
              </div>
            </Card>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="container mx-auto max-w-4xl">
            {/* 移动端 2 列，平板 3 列，桌面 4 列 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {cards.map(card => {
                const wordData = allWordsData.find(w => w.id === card.wordId);
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className={`relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 transform ${
                      card.matched
                        ? 'bg-game-green/30 opacity-60 scale-95'
                        : selectedCards.includes(card.id)
                          ? 'bg-game-yellow/50 scale-105 shadow-xl ring-4 ring-game-yellow'
                          : 'bg-white/90 hover:scale-105 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {card.type === 'image' ? (
                      <div className="text-center">
                        <div 
                          className="text-3xl sm:text-4xl md:text-5xl cursor-pointer hover:scale-110 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(card);
                          }}
                        >{card.content}</div>
                        {wordData && (
                          <div 
                            className="text-xs sm:text-sm md:text-base font-medium text-game-green mt-1"
                          >{wordData.chinese}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div 
                          className="text-base sm:text-lg md:text-xl font-bold text-game-purple break-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(card);
                          }}
                        >{card.content}</div>
                      </div>
                    )}

                    {card.matched && (
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-xl sm:text-2xl animate-bounce">✅</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};