
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GameBoard } from "@/components/GameBoard";
import { MultiplayerLobby } from "@/components/MultiplayerLobby";
import { MultiplayerGameBoard } from "@/components/MultiplayerGameBoard";
import { ThemeSelector } from "@/components/ThemeSelector";
import { AuthModal } from "@/components/AuthModal";
import { UserProfile } from "@/components/UserProfile";
import { Leaderboard } from "@/components/Leaderboard";
import { Brain, Trophy, Shuffle, Users, Sparkles, Zap, Swords, Crown, Play, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState('animals');
  const [gameMode, setGameMode] = useState('menu'); // 'menu', 'single', 'multiplayer', 'lobby', 'multiGame'
  const [showAuth, setShowAuth] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [multiplayerRoom, setMultiplayerRoom] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
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
    setGameMode('menu');
    localStorage.removeItem('memoryGameUser');
    localStorage.removeItem('memoryGameToken');
    toast({
      title: "Goodbye!",
      description: "You've been logged out successfully",
    });
  };

  const startSinglePlayer = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to play the game",
        variant: "destructive"
      });
      setShowAuth(true);
      return;
    }
    setGameMode('single');
  };

  const startMultiplayer = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to play multiplayer",
        variant: "destructive"
      });
      setShowAuth(true);
      return;
    }
    setGameMode('multiplayer');
  };

  const handleMultiplayerStart = (roomData) => {
    setMultiplayerRoom(roomData);
    setGameMode('multiGame');
  };

  const backToMenu = () => {
    setGameMode('menu');
    setShowLeaderboard(false);
    setMultiplayerRoom(null);
  };

  const backToMultiplayerLobby = () => {
    setGameMode('multiplayer');
    setMultiplayerRoom(null);
  };

  if (gameMode === 'single') {
    return (
      <GameBoard 
        theme={selectedTheme} 
        user={currentUser}
        onBackToMenu={backToMenu}
      />
    );
  }

  if (gameMode === 'multiplayer') {
    return (
      <MultiplayerLobby
        user={currentUser}
        onBackToMenu={backToMenu}
        onStartMultiplayer={handleMultiplayerStart}
      />
    );
  }

  if (gameMode === 'multiGame' && multiplayerRoom) {
    return (
      <MultiplayerGameBoard
        roomData={multiplayerRoom}
        user={currentUser}
        onBackToLobby={backToMultiplayerLobby}
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-violet-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-violet-900/20" />
        <div className="relative z-10 px-4 py-12 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-violet-600 to-green-600 p-4 rounded-3xl backdrop-blur-sm shadow-2xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-violet-400 bg-clip-text text-transparent">
                    Memory Master
                  </h1>
                  <p className="text-gray-300 text-sm md:text-base">Elite Memory Challenge Platform</p>
                </div>
              </div>
              <UserProfile 
                user={currentUser}
                isAuthenticated={isAuthenticated}
                onLogin={() => setShowAuth(true)}
                onLogout={handleLogout}
              />
            </div>

            {/* Hero Content */}
            <div className="text-center mb-20">
              <div className="relative inline-block">
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
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Challenge your mind with dynamic reshuffling and 
                <span className="text-violet-400 font-semibold"> compete in real-time multiplayer battles</span>
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">∞</div>
                  <div className="text-sm text-gray-400">Reshuffles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-violet-400">6+</div>
                  <div className="text-sm text-gray-400">Themes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">2P</div>
                  <div className="text-sm text-gray-400">Battles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Modes Section */}
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Choose Your Challenge</h3>
            <p className="text-gray-300 text-lg">Master your memory in solo or multiplayer mode</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Single Player Mode */}
            <Card className="bg-black/40 backdrop-blur-xl border-green-800/30 shadow-2xl hover:border-green-600/50 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Brain className="w-16 h-16 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-2">Solo Challenge</h3>
                  <p className="text-gray-300">Dynamic chaos mode with constant reshuffling</p>
                </div>

                <ThemeSelector 
                  selectedTheme={selectedTheme}
                  onThemeSelect={setSelectedTheme}
                />
                
                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={startSinglePlayer}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 text-lg rounded-2xl"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Solo Game
                  </Button>
                  
                  <div className="flex gap-2">
                    <Badge className="bg-green-600/20 text-green-400 border border-green-600/30 flex-1 justify-center py-2">
                      <Shuffle className="w-3 h-3 mr-1" />
                      Chaos Mode
                    </Badge>
                    <Badge className="bg-violet-600/20 text-violet-400 border border-violet-600/30 flex-1 justify-center py-2">
                      <Star className="w-3 h-3 mr-1" />
                      6 Themes
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multiplayer Mode */}
            <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl hover:border-violet-600/50 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="relative">
                    <Swords className="w-16 h-16 text-violet-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-violet-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">NEW</Badge>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Mastermind Room</h3>
                  <p className="text-gray-300">Real-time battles with friends</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-violet-900/20 rounded-xl border border-violet-600/30">
                    <Crown className="w-5 h-5 text-violet-400" />
                    <div>
                      <div className="font-semibold text-white text-sm">Create Room</div>
                      <div className="text-xs text-gray-400">Host & invite friends</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-xl border border-green-600/30">
                    <Users className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="font-semibold text-white text-sm">Join Room</div>
                      <div className="text-xs text-gray-400">Enter room ID</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={startMultiplayer}
                  className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-semibold py-4 text-lg rounded-2xl"
                >
                  <Swords className="w-5 h-5 mr-2" />
                  Enter Battle Arena
                </Button>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="bg-black/40 backdrop-blur-xl border-gray-800/30 shadow-2xl hover:border-gray-600/50 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-white mb-2">Champions</h3>
                  <p className="text-gray-300">Elite players leaderboard</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center p-3 bg-yellow-900/20 rounded-xl border border-yellow-600/30">
                    <span className="text-yellow-400 font-semibold">#1 Master</span>
                    <Badge className="bg-yellow-600 text-black">12 moves</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-900/20 rounded-xl border border-gray-600/30">
                    <span className="text-gray-300">#2 Expert</span>
                    <Badge className="bg-gray-600 text-white">15 moves</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-900/20 rounded-xl border border-orange-600/30">
                    <span className="text-orange-400">#3 Pro</span>
                    <Badge className="bg-orange-600 text-white">18 moves</Badge>
                  </div>
                </div>
                
                <Button 
                  onClick={() => setShowLeaderboard(true)}
                  variant="outline"
                  className="w-full border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/10 hover:border-yellow-400 rounded-2xl py-4"
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  View Full Rankings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Highlight */}
          <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">Elite Features</h3>
                <p className="text-gray-300">Why Memory Master is the ultimate challenge</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <Shuffle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-1">Dynamic Chaos</h4>
                  <p className="text-sm text-gray-400">Cards reshuffle after every move</p>
                </div>
                
                <div className="text-center p-4">
                  <Swords className="w-12 h-12 text-violet-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-1">Real-time PvP</h4>
                  <p className="text-sm text-gray-400">Challenge friends instantly</p>
                </div>
                
                <div className="text-center p-4">
                  <Brain className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-1">6+ Themes</h4>
                  <p className="text-sm text-gray-400">Animals, nature, space & more</p>
                </div>
                
                <div className="text-center p-4">
                  <Trophy className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-1">Global Rankings</h4>
                  <p className="text-sm text-gray-400">Compete for the #1 spot</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
