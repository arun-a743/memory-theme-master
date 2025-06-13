
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Medal, Award, Clock, Target } from "lucide-react";
import { themes } from "../utils/themes";

export const Leaderboard = ({ theme, onBackToMenu }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [loading, setLoading] = useState(true);

  // Mock leaderboard data generation
  useEffect(() => {
    const generateMockData = () => {
      const mockUsers = [
        { username: 'MemoryMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master' },
        { username: 'BrainChamp', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=champ' },
        { username: 'QuickThink', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=quick' },
        { username: 'ShuffleKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=king' },
        { username: 'CardWizard', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wizard' },
        { username: 'ThemeHero', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hero' },
        { username: 'FastFlip', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fast' },
        { username: 'MatchGenius', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=genius' },
      ];

      return mockUsers.map((user, index) => ({
        id: index + 1,
        ...user,
        theme: selectedTheme,
        moves: 16 + Math.floor(Math.random() * 20),
        time: 45 + Math.floor(Math.random() * 60),
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        rank: index + 1
      })).sort((a, b) => a.moves - b.moves || a.time - b.time);
    };

    setLoading(true);
    setTimeout(() => {
      setLeaderboardData(generateMockData());
      setLoading(false);
    }, 800);
  }, [selectedTheme]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-500" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const themeData = themes[selectedTheme];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
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
          
          <Badge className="bg-white/20 text-white px-4 py-2 text-lg">
            <Trophy className="w-4 h-4 mr-2" />
            Global Leaderboard
          </Badge>
        </div>

        {/* Theme Selector */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">Select Theme:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(themes).map(([themeKey, theme]) => (
                <Button
                  key={themeKey}
                  variant={selectedTheme === themeKey ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTheme(themeKey)}
                  className={selectedTheme === themeKey 
                    ? "bg-white text-purple-600" 
                    : "border-white/30 text-white hover:bg-white/10"
                  }
                >
                  {theme.symbols[0]} {theme.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Theme Display */}
        <Card className="mb-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${themeData.gradient} flex items-center justify-center`}>
                <span className="text-2xl">{themeData.symbols[0]}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white capitalize">{themeData.name} Theme</h2>
                <p className="text-white/80">{themeData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Top Players - {themeData.name} Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
                <p className="text-white/80">Loading leaderboard...</p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {leaderboardData.map((player, index) => (
                  <div 
                    key={player.id}
                    className={`flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-white/5 ${
                      index < 3 ? 'bg-white/10' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(player.rank)}
                      </div>
                      
                      <Avatar>
                        <AvatarImage src={player.avatar} alt={player.username} />
                        <AvatarFallback>{player.username[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{player.username}</h3>
                        <p className="text-white/60 text-sm">
                          {new Date(player.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-white">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span className="font-bold">{player.moves}</span>
                        </div>
                        <p className="text-xs text-white/60">moves</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-bold">{formatTime(player.time)}</span>
                        </div>
                        <p className="text-xs text-white/60">time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card className="mt-6 bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-3">Challenge Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{leaderboardData.length}</div>
                <div className="text-white/80 text-sm">Total Players</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {leaderboardData.length > 0 ? Math.min(...leaderboardData.map(p => p.moves)) : '-'}
                </div>
                <div className="text-white/80 text-sm">Best Score (Moves)</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {leaderboardData.length > 0 ? formatTime(Math.min(...leaderboardData.map(p => p.time))) : '-'}
                </div>
                <div className="text-white/80 text-sm">Fastest Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
