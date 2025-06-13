
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
  const { toast } = useToast();

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
    const themeData = themes[theme];
    const gameCards = [];
    
    // Create pairs of cards
    for (let i = 0; i < 8; i++) {
      const symbol = themeData.symbols[i % themeData.symbols.length];
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
  }, [theme]);

  // Shuffle unmatched cards
  const shuffleUnmatchedCards = useCallback(() => {
    setIsShuffling(true);
    
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
      
      setIsShuffling(false);
    }, 300);
  }, [matchedCards]);

  // Handle card click
  const handleCardClick = useCallback((cardId) => {
    if (flippedCards.length >= 2 || flippedCards.includes(cardId) || matchedCards.has(cardId) || isShuffling) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves => moves + 1);
      
      const card1 = cards.find(c => c.id === newFlippedCards[0]);
      const card2 = cards.find(c => c.id === newFlippedCards[1]);
      
      if (card1.pairId === card2.pairId) {
        // Match found
        setTimeout(() => {
          setMatchedCards(prev => new Set([...prev, card1.id, card2.id]));
          setFlippedCards([]);
          
          toast({
            title: "Perfect match! 🎉",
            description: "Cards found and shuffling deck...",
          });
          
          // Shuffle after correct match
          setTimeout(() => {
            shuffleUnmatchedCards();
          }, 500);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
          
          toast({
            title: "Try again! 🔄",
            description: "No match found, shuffling deck...",
          });
          
          // Shuffle after incorrect match
          setTimeout(() => {
            shuffleUnmatchedCards();
          }, 500);
        }, 1000);
      }
    }
  }, [flippedCards, matchedCards, isShuffling, cards, moves, shuffleUnmatchedCards, toast]);

  // Check win condition
  useEffect(() => {
    if (matchedCards.size === cards.length && cards.length > 0) {
      setGameWon(true);
      setGameStarted(false);
      
      // Save score (simulate API call)
      const score = {
        userId: user.id,
        username: user.username,
        theme,
        moves,
        time,
        date: new Date().toISOString()
      };
      
      console.log('Game completed! Score:', score);
      
      toast({
        title: "🏆 Congratulations!",
        description: `Game completed in ${moves} moves and ${time} seconds!`,
      });
    }
  }, [matchedCards.size, cards.length, moves, time, theme, user, toast]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBackToMenu}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white px-3 py-1">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(time)}
            </Badge>
            <Badge className="bg-white/20 text-white px-3 py-1">
              Moves: {moves}
            </Badge>
            <Badge className="bg-white/20 text-white px-3 py-1 capitalize">
              {theme}
            </Badge>
          </div>
        </div>

        {/* Game Status */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Memory Master - Dynamic Mode
          </h2>
          <p className="text-white/80">
            Find all pairs • Cards shuffle after every move!
          </p>
          {isShuffling && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <Shuffle className="w-4 h-4 text-yellow-300 animate-spin" />
              <span className="text-yellow-300 font-medium">Shuffling cards...</span>
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
            />
          ))}
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={resetGame}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Game
          </Button>
        </div>

        {/* Win Modal */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-white max-w-md w-full">
              <CardContent className="p-6 text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
                <p className="text-gray-600 mb-4">
                  You completed the game in <strong>{moves} moves</strong> and <strong>{formatTime(time)}</strong>!
                </p>
                <div className="space-y-2">
                  <Button onClick={resetGame} className="w-full">
                    Play Again
                  </Button>
                  <Button onClick={onBackToMenu} variant="outline" className="w-full">
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
