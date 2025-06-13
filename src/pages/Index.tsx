
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameBoard } from "@/components/GameBoard";
import { ThemeSelector } from "@/components/ThemeSelector";
import { AuthModal } from "@/components/AuthModal";
import { UserProfile } from "@/components/UserProfile";
import { Leaderboard } from "@/components/Leaderboard";
import { Brain, Trophy, Shuffle, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('animals');
  const [gameStarted, setGameStarted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing authentication
    const user = localStorage.getItem('memoryGameUser');
    const token = localStorage.getItem('memoryGameToken');
    if (user && token) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('memoryGameUser', JSON.stringify(userData));
    localStorage.setItem('memoryGameToken', userData.token);
    setShowAuth(false);
    toast({
      title: "Welcome back!",
      description: `Logged in as ${userData.username}`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setGameStarted(false);
    localStorage.removeItem('memoryGameUser');
    localStorage.removeItem('memoryGameToken');
    toast({
      title: "Goodbye!",
      description: "You've been logged out successfully",
    });
  };

  const startGame = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to play the game",
        variant: "destructive"
      });
      setShowAuth(true);
      return;
    }
    setGameStarted(true);
  };

  const backToMenu = () => {
    setGameStarted(false);
    setShowLeaderboard(false);
  };

  if (gameStarted) {
    return (
      <GameBoard 
        theme={selectedTheme} 
        user={currentUser}
        onBackToMenu={backToMenu}
      />
    );
  }

  if (showLeaderboard) {
    return (
      <Leaderboard 
        theme={selectedTheme}
        onBackToMenu={backToMenu}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Memory Master</h1>
              <p className="text-white/80">Challenge your mind with dynamic shuffling</p>
            </div>
          </div>
          <UserProfile 
            user={currentUser}
            isAuthenticated={isAuthenticated}
            onLogin={() => setShowAuth(true)}
            onLogout={handleLogout}
          />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Game Setup */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Choose Your Theme</h2>
              <ThemeSelector 
                selectedTheme={selectedTheme}
                onThemeSelect={setSelectedTheme}
              />
              
              <div className="mt-6 space-y-3">
                <Button 
                  onClick={startGame}
                  className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold py-3 text-lg"
                  size="lg"
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Start Dynamic Memory Game
                </Button>
                
                <Button 
                  onClick={() => setShowLeaderboard(true)}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  View Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Features */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Game Features</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Badge className="bg-red-500 text-white mt-1">
                    <Shuffle className="w-4 h-4 mr-1" />
                    HARD
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white">Dynamic Shuffling</h3>
                    <p className="text-white/80 text-sm">Cards reshuffle after every move - even correct ones!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-500 text-white mt-1">
                    <Users className="w-4 h-4 mr-1" />
                    AUTH
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white">User Accounts</h3>
                    <p className="text-white/80 text-sm">Sign in to save scores and compete</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-500 text-white mt-1">
                    <Trophy className="w-4 h-4 mr-1" />
                    RANK
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white">Global Leaderboard</h3>
                    <p className="text-white/80 text-sm">Compare your skills with other players</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="bg-purple-500 text-white mt-1">
                    <Brain className="w-4 h-4 mr-1" />
                    THEMES
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white">Custom Themes</h3>
                    <p className="text-white/80 text-sm">Multiple themes to keep the game fresh</p>
                  </div>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-white text-sm">
                    <strong>Sign in required:</strong> Create an account to play the game and appear on the leaderboard.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        {isAuthenticated && currentUser && (
          <Card className="mt-8 bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.gamesPlayed || 0}</div>
                  <div className="text-white/80 text-sm">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentUser.bestScore || 'N/A'}</div>
                  <div className="text-white/80 text-sm">Best Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{selectedTheme}</div>
                  <div className="text-white/80 text-sm">Current Theme</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
