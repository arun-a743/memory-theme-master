
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Crown, Trophy, Calendar, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const UserProfile = ({ user, isAuthenticated, onLogin, onLogout }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load user's game history
  useEffect(() => {
    if (isAuthenticated && user) {
      const history = JSON.parse(localStorage.getItem('userGameHistory') || '[]');
      // Filter by current user
      const userHistory = history.filter(game => game.userId === user.id);
      setGameHistory(userHistory.slice(-10)); // Show last 10 games
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <Button 
        onClick={onLogin}
        className="bg-gradient-to-r from-green-600 to-violet-600 hover:from-green-700 hover:to-violet-700 text-white"
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const bestScore = gameHistory.length > 0 
    ? gameHistory.reduce((best, game) => 
        !best || game.moves < best.moves ? game : best
      )
    : null;

  const totalGames = gameHistory.length;
  const averageMoves = totalGames > 0 
    ? Math.round(gameHistory.reduce((sum, game) => sum + game.moves, 0) / totalGames)
    : 0;

  return (
    <div className="relative">
      <Card className="bg-black/40 backdrop-blur-xl border-green-800/30 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate flex items-center gap-2">
                {user.username}
                <Badge className="bg-violet-600 text-white text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Player
                </Badge>
              </h3>
              <p className="text-sm text-gray-300 truncate">{user.email}</p>
              {bestScore && (
                <p className="text-xs text-green-400">
                  Best: {bestScore.moves} moves
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowHistory(!showHistory)}
                variant="outline"
                size="sm"
                className="border-violet-600/50 text-violet-400 hover:bg-violet-600/10"
              >
                <Trophy className="w-4 h-4" />
              </Button>
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game History Dropdown */}
      {showHistory && (
        <Card className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border-violet-800/30 shadow-2xl z-50">
          <CardContent className="p-4">
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-violet-400" />
              Game History
            </h4>
            
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 bg-violet-900/20 rounded-lg border border-violet-600/30">
                <div className="text-lg font-bold text-white">{totalGames}</div>
                <div className="text-xs text-gray-400">Games</div>
              </div>
              <div className="text-center p-2 bg-green-900/20 rounded-lg border border-green-600/30">
                <div className="text-lg font-bold text-white">{averageMoves}</div>
                <div className="text-xs text-gray-400">Avg Moves</div>
              </div>
              <div className="text-center p-2 bg-gray-900/20 rounded-lg border border-gray-600/30">
                <div className="text-lg font-bold text-white">{bestScore?.moves || '-'}</div>
                <div className="text-xs text-gray-400">Best</div>
              </div>
            </div>

            {/* Recent Games */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {gameHistory.length > 0 ? (
                gameHistory.slice().reverse().map((game, index) => (
                  <div key={index} className="p-3 bg-gray-900/20 rounded-lg border border-gray-600/30">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-white text-sm">{game.theme}</span>
                      <Badge className={cn(
                        "text-xs",
                        game.moves === bestScore?.moves 
                          ? "bg-green-600 text-white" 
                          : "bg-gray-600 text-white"
                      )}>
                        {game.moves === bestScore?.moves && <Crown className="w-3 h-3 mr-1" />}
                        {game.moves} moves
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(game.time / 60)}:{(game.time % 60).toString().padStart(2, '0')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(game.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">
                  No games played yet. Start your first game!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
