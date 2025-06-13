
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, RotateCcw, Trophy, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GameCard } from "./GameCard";
import { themes } from "../utils/themes";

export const GameBoard = ({ theme, user, onBackToMenu }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const [wrongMoveCounter, setWrongMoveCounter] = useState(0);
  const { toast } = useToast();

  // Get theme data (including custom themes)
  const getThemeData = useCallback(() => {
    // Check if it's a built-in theme
    if (themes[theme]) {
      return themes[theme];
    }
    
    // Check if it's a custom theme
    const customThemes = JSON.parse(localStorage.getItem('customThemes') || '[]');
    const customTheme = customThemes.find(t => t.id === theme);
    if (customTheme) {
      return customTheme;
    }
    
    // Fallback to animals theme
    return themes.animals;
  }, [theme]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const themeData = getThemeData();
    const gameCards = [];
    
    // Create pairs of cards - use only first 8 symbols/images
    const symbolsToUse = themeData.symbols.slice(0, 8);
    for (let i = 0; i < 8; i++) {
      const symbol = symbolsToUse[i];
      gameCards.push(
        { id: `${i}-a`, symbol, pairId: i },
        { id: `${i}-b`, symbol, pairId: i }
      );
    }
    
    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatchedCards(new Set());
    setMoves(0);
    setTime(0);
    setGameWon(false);
    setGameStarted(true);
    setCanFlip(true);
    setWrongMoveCounter(0);
  }, [getThemeData]);

  // Smart shuffle function - only shuffle after 3 wrong moves in a row
  const smartShuffle = useCallback(() => {
    if (wrongMoveCounter >= 3) {
      setIsShuffling(true);
      setCanFlip(false);
      
      setTimeout(() => {
        setCards(prevCards => {
          const newCards = [...prevCards];
          const unmatchedIndices = [];
          const unmatchedCards = [];
          
          // Collect unmatched cards and their indices
          newCards.forEach((card, index) => {
            if (!matchedCards.has(card.id)) {
              unmatchedIndices.push(index);
              unmatchedCards.push(card);
            }
          });
          
          // Shuffle only unmatched cards
          const shuffledUnmatched = unmatchedCards.sort(() => Math.random() - 0.5);
          
          // Place shuffled cards back in their positions
          unmatchedIndices.forEach((index, i) => {
            newCards[index] = shuffledUnmatched[i];
          });
          
          return newCards;
        });
        
        setTimeout(() => {
          setIsShuffling(false);
          setCanFlip(true);
          setWrongMoveCounter(0); // Reset counter after shuffle
        }, 300);
      }, 300);

      toast({
        title: "Strategic reshuffle! 🔄",
        description: "Cards reshuffled after 3 wrong moves",
      });
    }
  }, [wrongMoveCounter, matchedCards, toast]);

  // Handle card click with balanced logic
  const handleCardClick = useCallback((cardId) => {
    if (!canFlip || flippedCards.length >= 2 || flippedCards.includes(cardId) || matchedCards.has(cardId) || isShuffling) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves => moves + 1);
      setCanFlip(false);
      
      const card1 = cards.find(c => c.id === newFlippedCards[0]);
      const card2 = cards.find(c => c.id === newFlippedCards[1]);
      
      if (card1.pairId === card2.pairId) {
        // Match found - reset wrong move counter, no shuffle
        setTimeout(() => {
          setMatchedCards(prev => new Set([...prev, card1.id, card2.id]));
          setFlippedCards([]);
          setCanFlip(true);
          setWrongMoveCounter(0); // Reset on correct match
          
          toast({
            title: "Perfect match! 🎉",
            description: "Keep going!",
          });
        }, 1000);
      } else {
        // No match - increment wrong move counter
        setTimeout(() => {
          setFlippedCards([]);
          setCanFlip(true);
          setWrongMoveCounter(prev => prev + 1);
          
          toast({
            title: "Try again! 🔄",
            description: "Keep your memory sharp",
          });
          
          // Trigger smart shuffle after state update
          setTimeout(() => {
            smartShuffle();
          }, 100);
        }, 1000);
      }
    }
  }, [flippedCards, matchedCards, isShuffling, cards, moves, smartShuffle, toast, canFlip]);

  // Check win condition and save score
  useEffect(() => {
    if (matchedCards.size === cards.length && cards.length > 0) {
      setGameWon(true);
      setGameStarted(false);
      setWrongMoveCounter(0); // Reset for next game
      
      // Save score to localStorage (simulating backend save)
      const score = {
        userId: user.id,
        username: user.username,
        theme: getThemeData().name || theme,
        moves,
        time,
        date: new Date().toISOString()
      };
      
      // Get existing scores
      const existingScores = JSON.parse(localStorage.getItem('memoryGameScores') || '[]');
      existingScores.push(score);
      localStorage.setItem('memoryGameScores', JSON.stringify(existingScores));
      
      // Save to user's game history
      const existingHistory = JSON.parse(localStorage.getItem('userGameHistory') || '[]');
      existingHistory.push(score);
      localStorage.setItem('userGameHistory', JSON.stringify(existingHistory));
      
      console.log('Game completed! Score saved:', score);
      
      toast({
        title: "🏆 Victory!",
        description: `Completed in ${moves} moves and ${time} seconds!`,
      });
    }
  }, [matchedCards.size, cards.length, moves, time, theme, user, toast, getThemeData]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    initializeGame();
  };

  const themeData = getThemeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBackToMenu}
            variant="outline"
            className="border-green-600/50 text-green-400 hover:bg-green-600/10 hover:border-green-400"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-black/50 text-green-400 border border-green-600/50 px-3 py-1">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(time)}
            </Badge>
            <Badge className="bg-black/50 text-violet-400 border border-violet-600/50 px-3 py-1">
              Moves: {moves}
            </Badge>
            {wrongMoveCounter > 0 && (
              <Badge className="bg-orange-600/80 text-white border border-orange-600/50 px-3 py-1">
                Wrong: {wrongMoveCounter}/3
              </Badge>
            )}
            <Badge className="bg-black/50 text-white border border-gray-600/50 px-3 py-1 capitalize">
              {themeData.name}
            </Badge>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-violet-400 bg-clip-text text-transparent mb-2">
            Smart Challenge Mode
          </h2>
          <p className="text-gray-300">
            Find all pairs • Cards reshuffle only after 3 wrong moves!
          </p>
          {wrongMoveCounter > 0 && (
            <p className="text-orange-400 text-sm mt-2">
              {wrongMoveCounter === 1 && "First wrong move - stay focused!"}
              {wrongMoveCounter === 2 && "Two wrong moves - one more and cards will reshuffle!"}
            </p>
          )}
          {isShuffling && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shuffle className="w-4 h-4 text-green-400 animate-spin" />
              <span className="text-green-400 font-medium">Strategic reshuffle...</span>
            </div>
          )}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6 max-w-2xl mx-auto">
          {cards.map((card, index) => (
            <GameCard
              key={card.id}
              card={card}
              isFlipped={flippedCards.includes(card.id)}
              isMatched={matchedCards.has(card.id)}
              onClick={() => handleCardClick(card.id)}
              isShuffling={isShuffling}
              theme={theme}
              isCustomTheme={themeData.isCustom}
            />
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={resetGame}
            variant="outline"
            className="border-violet-600/50 text-violet-400 hover:bg-violet-600/10 hover:border-violet-400"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Challenge
          </Button>
        </div>

        {/* Win Modal */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-black/90 border-green-600/50 max-w-md w-full">
              <CardContent className="p-6 text-center">
                <Trophy className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Victory!</h3>
                <p className="text-gray-300 mb-4">
                  You completed the challenge in <strong className="text-green-400">{moves} moves</strong> and <strong className="text-violet-400">{formatTime(time)}</strong>!
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={resetGame} 
                    className="w-full bg-gradient-to-r from-violet-600 to-green-600 hover:from-violet-700 hover:to-green-700"
                  >
                    Play Again
                  </Button>
                  <Button 
                    onClick={onBackToMenu} 
                    variant="outline" 
                    className="w-full border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
                  >
                    Back to Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
