
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameBoard } from "@/components/GameBoard";
import { ThemeSelector } from "@/components/ThemeSelector";
import { AuthModal } from "@/components/AuthModal";
import { UserProfile } from "@/components/UserProfile";
import { Leaderboard } from "@/components/Leaderboard";
import { Brain, Trophy, Shuffle, Users, Sparkles, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-violet-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-violet-600 to-green-600 p-4 rounded-3xl backdrop-blur-sm shadow-2xl">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-violet-400 bg-clip-text text-transparent">
                Memory Master
              </h1>
              <p className="text-gray-300 text-lg">Challenge your mind with dynamic reshuffling</p>
            </div>
          </div>
          <UserProfile 
            user={currentUser}
            isAuthenticated={isAuthenticated}
            onLogin={() => setShowAuth(true)}
            onLogout={handleLogout}
          />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative">
            <h2 className="text-6xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-violet-400 via-green-400 to-violet-400 bg-clip-text mb-6">
              ULTIMATE
            </h2>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-4 right-1/4">
              <Zap className="w-6 h-6 text-green-400 animate-bounce" />
            </div>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the most challenging memory game ever created. 
            <span className="text-violet-400 font-semibold"> Cards reshuffle after every move</span> - 
            can you master the chaos?
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Game Setup */}
          <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shuffle className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">Choose Your Challenge</h2>
              </div>
              
              <ThemeSelector 
                selectedTheme={selectedTheme}
                onThemeSelect={setSelectedTheme}
              />
              
              <div className="mt-8 space-y-4">
                <Button 
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-violet-600 to-green-600 hover:from-violet-700 hover:to-green-700 text-white font-semibold py-4 text-lg rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Start Dynamic Memory Game
                </Button>
                
                <Button 
                  onClick={() => setShowLeaderboard(true)}
                  variant="outline"
                  className="w-full border-green-600/50 text-green-400 hover:bg-green-600/10 hover:border-green-400 rounded-2xl py-4"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  View Champions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Game Features */}
          <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-violet-400" />
                <h2 className="text-2xl font-bold text-white">Extreme Features</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Badge className="bg-red-600 text-white mt-1 px-3 py-1">
                    <Shuffle className="w-4 h-4 mr-1" />
                    INSANE
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Dynamic Chaos Mode</h3>
                    <p className="text-gray-300">Cards reshuffle after EVERY move - correct or wrong!</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="bg-violet-600 text-white mt-1 px-3 py-1">
                    <Users className="w-4 h-4 mr-1" />
                    AUTH
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Secure Accounts</h3>
                    <p className="text-gray-300">Sign in to save scores and compete globally</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="bg-green-600 text-white mt-1 px-3 py-1">
                    <Trophy className="w-4 h-4 mr-1" />
                    ELITE
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Champions Board</h3>
                    <p className="text-gray-300">Only real players who complete the challenge</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Badge className="bg-black text-green-400 border border-green-600 mt-1 px-3 py-1">
                    <Brain className="w-4 h-4 mr-1" />
                    THEMES
                  </Badge>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Custom Themes</h3>
                    <p className="text-gray-300">Multiple beautiful themes to master</p>
                  </div>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl border border-yellow-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-yellow-400 font-semibold">Ready to Challenge Yourself?</h4>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Create an account to play the ultimate memory game and join the elite leaderboard.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        {isAuthenticated && currentUser && (
          <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">Your Progress</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-violet-900/30 rounded-2xl border border-violet-600/30">
                  <div className="text-3xl font-bold text-violet-400">{currentUser.gamesPlayed || 0}</div>
                  <div className="text-gray-300 text-sm">Challenges Faced</div>
                </div>
                <div className="text-center p-4 bg-green-900/30 rounded-2xl border border-green-600/30">
                  <div className="text-3xl font-bold text-green-400">{currentUser.bestScore || 'N/A'}</div>
                  <div className="text-gray-300 text-sm">Best Performance</div>
                </div>
                <div className="text-center p-4 bg-black/50 rounded-2xl border border-gray-600/30">
                  <div className="text-3xl font-bold text-white capitalize">{selectedTheme}</div>
                  <div className="text-gray-300 text-sm">Current Theme</div>
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
