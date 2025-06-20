
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy, Crown, Users, Sword } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GameCard } from "./GameCard";
import { themes } from "../utils/themes";

export const MultiplayerGameBoard = ({ roomData, user, onBackToLobby }) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState(new Set());
  const [currentTurn, setCurrentTurn] = useState(roomData.hostId);
  const [playerScores, setPlayerScores] = useState({
    [roomData.hostId]: 0,
    [roomData.guestId || 'guest']: 0
  });
  const [gameWon, setGameWon] = useState(false);
  const [winner, setWinner] = useState(null);
  const [time, setTime] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const [wrongMoveCounter, setWrongMoveCounter] = useState(0);
  const { toast } = useToast();

  const isMyTurn = currentTurn === user.id;
  const opponent = roomData.hostId === user.id ? roomData.guestName : roomData.hostName;

  // Get theme data (including custom themes)
  const getThemeData = useCallback(() => {
    // Check if it's a built-in theme
    if (themes[roomData.theme]) {
      return themes[roomData.theme];
    }
    
    // Check if it's a custom theme
    const customThemes = JSON.parse(localStorage.getItem('customThemes') || '[]');
    const customTheme = customThemes.find(t => t.id === roomData.theme);
    if (customTheme) {
      return customTheme;
    }
    
    // Fallback to animals theme
    return themes.animals;
  }, [roomData.theme]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (!gameWon) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameWon]);

  // Smart shuffle function - only shuffle after 3 wrong moves in a row
  const smartShuffle = useCallback(() => {
    if (wrongMoveCounter >= 3) {
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
      
      setWrongMoveCounter(0); // Reset counter after shuffle
      
      toast({
        title: "Cards reshuffled! 🔄",
        description: "Time to adapt your strategy",
      });
    }
  }, [wrongMoveCounter, matchedCards, toast]);

  // Initialize game
  const initializeGame = useCallback(() => {
    const themeData = getThemeData();
    const gameCards = [];
    
    for (let i = 0; i < 8; i++) {
      const symbol = themeData.symbols[i % themeData.symbols.length];
      gameCards.push(
        { id: `${i}-a`, symbol, pairId: i },
        { id: `${i}-b`, symbol, pairId: i }
      );
    }
    
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setWrongMoveCounter(0); // Reset wrong move counter
  }, [getThemeData]);

  // Switch turns
  const switchTurn = () => {
    const nextPlayer = currentTurn === roomData.hostId ? (roomData.guestId || 'guest') : roomData.hostId;
    setCurrentTurn(nextPlayer);
  };

  // Handle card click with improved shuffle logic
  const handleCardClick = useCallback((cardId) => {
    if (!isMyTurn || !canFlip || flippedCards.length >= 2 || flippedCards.includes(cardId) || matchedCards.has(cardId)) {
      if (!isMyTurn) {
        toast({
          title: "Not your turn! ⏰",
          description: `Wait for ${opponent} to play`,
        });
      }
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setCanFlip(false);
      
      const card1 = cards.find(c => c.id === newFlippedCards[0]);
      const card2 = cards.find(c => c.id === newFlippedCards[1]);
      
      if (card1.pairId === card2.pairId) {
        // Match found - reset wrong move counter
        setTimeout(() => {
          setMatchedCards(prev => new Set([...prev, card1.id, card2.id]));
          setFlippedCards([]);
          setPlayerScores(prev => ({
            ...prev,
            [user.id]: prev[user.id] + 1
          }));
          setCanFlip(true);
          setWrongMoveCounter(0); // Reset on correct match
          
          toast({
            title: "Perfect match! 🎉",
            description: "You get another turn!",
          });
          
          // Don't switch turns on correct match
        }, 1000);
      } else {
        // No match - increment wrong move counter and check for shuffle
        setTimeout(() => {
          setFlippedCards([]);
          setCanFlip(true);
          setWrongMoveCounter(prev => prev + 1);
          switchTurn();
          
          toast({
            title: "No match 😔",
            description: `${opponent}'s turn now`,
          });
          
          // Trigger smart shuffle after state update
          setTimeout(() => {
            smartShuffle();
          }, 100);
        }, 1000);
      }
    }
  }, [flippedCards, matchedCards, isMyTurn, cards, user.id, opponent, toast, canFlip, smartShuffle]);

  // Check win condition
  useEffect(() => {
    if (matchedCards.size === cards.length && cards.length > 0) {
      setGameWon(true);
      setWrongMoveCounter(0); // Reset for next game
      
      const hostScore = playerScores[roomData.hostId];
      const guestScore = playerScores[roomData.guestId || 'guest'];
      
      if (hostScore > guestScore) {
        setWinner({ id: roomData.hostId, name: roomData.hostName, score: hostScore });
      } else if (guestScore > hostScore) {
        setWinner({ id: roomData.guestId, name: roomData.guestName, score: guestScore });
      } else {
        setWinner({ name: 'Tie Game!', score: hostScore });
      }

      toast({
        title: "🏆 Game Over!",
        description: `Final score - Host: ${hostScore}, Guest: ${guestScore}`,
      });
    }
  }, [matchedCards.size, cards.length, playerScores, roomData]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const themeData = getThemeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            onClick={onBackToLobby}
            variant="outline"
            className="border-green-600/50 text-green-400 hover:bg-green-600/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lobby
          </Button>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-black/50 text-green-400 border border-green-600/50 px-3 py-1">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(time)}
            </Badge>
            {wrongMoveCounter > 0 && (
              <Badge className="bg-orange-600/80 text-white border border-orange-600/50 px-3 py-1">
                Wrong: {wrongMoveCounter}/3
              </Badge>
            )}
          </div>
        </div>

        {/* Players Status */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className={`${currentTurn === roomData.hostId ? 'border-green-400 bg-green-900/20' : 'border-gray-600/30 bg-black/30'} transition-all duration-300`}>
            <CardContent className="p-4 flex items-center gap-3">
              <Crown className="w-6 h-6 text-green-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{roomData.hostName}</h3>
                <p className="text-sm text-gray-300">Host • {playerScores[roomData.hostId]} matches</p>
              </div>
              {currentTurn === roomData.hostId && (
                <Badge className="bg-green-600 text-white">
                  <Sword className="w-3 h-3 mr-1" />
                  Turn
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card className={`${currentTurn === (roomData.guestId || 'guest') ? 'border-violet-400 bg-violet-900/20' : 'border-gray-600/30 bg-black/30'} transition-all duration-300`}>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-violet-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{roomData.guestName || 'Guest'}</h3>
                <p className="text-sm text-gray-300">Guest • {playerScores[roomData.guestId || 'guest']} matches</p>
              </div>
              {currentTurn === (roomData.guestId || 'guest') && (
                <Badge className="bg-violet-600 text-white">
                  <Sword className="w-3 h-3 mr-1" />
                  Turn
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Turn Indicator */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isMyTurn ? "Your Turn!" : `${opponent}'s Turn`}
          </h2>
          <p className="text-gray-300">
            {isMyTurn ? "Find matching pairs to score points!" : "Wait for your opponent to make a move..."}
          </p>
          {wrongMoveCounter > 0 && (
            <p className="text-orange-400 text-sm mt-2">
              {wrongMoveCounter === 1 && "First wrong move - stay focused!"}
              {wrongMoveCounter === 2 && "Two wrong moves - one more and cards will reshuffle!"}
              {wrongMoveCounter >= 3 && "Cards reshuffled! Fresh start."}
            </p>
          )}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 mb-6 max-w-2xl mx-auto">
          {cards.map((card) => (
            <GameCard
              key={card.id}
              card={card}
              isFlipped={flippedCards.includes(card.id)}
              isMatched={matchedCards.has(card.id)}
              onClick={() => handleCardClick(card.id)}
              isShuffling={false}
              theme={roomData.theme}
              isCustomTheme={themeData.isCustom}
            />
          ))}
        </div>

        {/* Win Modal */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-black/90 border-green-600/50 max-w-md w-full">
              <CardContent className="p-6 text-center">
                <Trophy className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Game Over!</h3>
                {winner.name === 'Tie Game!' ? (
                  <p className="text-gray-300 mb-4">
                    It's a tie! Both players scored <strong className="text-green-400">{winner.score}</strong> matches!
                  </p>
                ) : (
                  <p className="text-gray-300 mb-4">
                    <strong className="text-green-400">{winner.name}</strong> wins with <strong className="text-violet-400">{winner.score}</strong> matches!
                  </p>
                )}
                <div className="space-y-2">
                  <Button 
                    onClick={onBackToLobby} 
                    className="w-full bg-gradient-to-r from-green-600 to-violet-600 hover:from-green-700 hover:to-violet-700"
                  >
                    Back to Lobby
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
