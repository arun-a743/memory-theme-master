
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

  // Load real scores from localStorage
  useEffect(() => {
    const loadRealScores = () => {
      setLoading(true);
      
      // Get real scores from localStorage
      const scores = JSON.parse(localStorage.getItem('memoryGameScores') || '[]');
      
      // Filter by selected theme and sort by performance
      const themeScores = scores
        .filter(score => score.theme === selectedTheme)
        .sort((a, b) => {
          // Sort by moves first, then by time
          if (a.moves !== b.moves) return a.moves - b.moves;
          return a.time - b.time;
        })
        .slice(0, 10) // Top 10 only
        .map((score, index) => ({
          ...score,
          rank: index + 1
        }));

      setLeaderboardData(themeScores);
      setLoading(false);
    };

    // Simulate loading delay
    setTimeout(loadRealScores, 500);
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
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>;
    }
  };

  const themeData = themes[selectedTheme];

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
          
          <Badge className="bg-black/50 text-violet-400 border border-violet-600/50 px-4 py-2 text-lg">
            <Trophy className="w-4 h-4 mr-2" />
            Champions Board
          </Badge>
        </div>

        {/* Theme Selector */}
        <Card className="mb-6 bg-black/40 backdrop-blur-xl border-violet-800/30">
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
                    ? "bg-gradient-to-r from-violet-600 to-green-600 text-white" 
                    : "border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
                  }
                >
                  {theme.symbols[0]} {theme.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Theme Display */}
        <Card className="mb-6 bg-black/40 backdrop-blur-xl border-violet-800/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${themeData.gradient} flex items-center justify-center`}>
                <span className="text-2xl">{themeData.symbols[0]}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white capitalize">{themeData.name} Champions</h2>
                <p className="text-gray-300">{themeData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Hall of Champions - {themeData.name} Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-violet-600/30 border-t-violet-400 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-300">Loading champions...</p>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="p-8 text-center">
                <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Champions Yet</h3>
                <p className="text-gray-500">
                  Be the first to conquer the {themeData.name} theme challenge!
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {leaderboardData.map((player) => (
                  <div 
                    key={`${player.userId}-${player.date}`}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-violet-900/20 ${
                      player.rank <= 3 ? 'bg-gradient-to-r from-violet-900/30 to-green-900/30 border border-violet-600/30' : 'bg-black/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(player.rank)}
                      </div>
                      
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`} alt={player.username} />
                        <AvatarFallback className="bg-violet-600 text-white">{player.username[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{player.username}</h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(player.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-white">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4 text-green-400" />
                          <span className="font-bold text-green-400">{player.moves}</span>
                        </div>
                        <p className="text-xs text-gray-400">moves</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-violet-400" />
                          <span className="font-bold text-violet-400">{formatTime(player.time)}</span>
                        </div>
                        <p className="text-xs text-gray-400">time</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        {leaderboardData.length > 0 && (
          <Card className="mt-6 bg-black/40 backdrop-blur-xl border-violet-800/30">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Theme Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-violet-900/30 rounded-2xl border border-violet-600/30">
                  <div className="text-2xl font-bold text-violet-400">{leaderboardData.length}</div>
                  <div className="text-gray-300 text-sm">Total Champions</div>
                </div>
                <div className="p-4 bg-green-900/30 rounded-2xl border border-green-600/30">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.min(...leaderboardData.map(p => p.moves))}
                  </div>
                  <div className="text-gray-300 text-sm">Best Score (Moves)</div>
                </div>
                <div className="p-4 bg-black/50 rounded-2xl border border-gray-600/30">
                  <div className="text-2xl font-bold text-white">
                    {formatTime(Math.min(...leaderboardData.map(p => p.time)))}
                  </div>
                  <div className="text-gray-300 text-sm">Fastest Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
