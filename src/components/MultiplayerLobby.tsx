
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Copy, Lock, Crown, Eye, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeSelector } from "./ThemeSelector";

export const MultiplayerLobby = ({ user, onBackToMenu, onStartMultiplayer }) => {
  const [mode, setMode] = useState('select'); // 'select', 'create', 'join'
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('animals');
  const [difficulty, setDifficulty] = useState(16); // number of cards
  const [roomData, setRoomData] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const { toast } = useToast();

  const createRoom = async () => {
    if (!roomName.trim()) {
      toast({
        title: "Room name required",
        description: "Please enter a room name",
        variant: "destructive"
      });
      return;
    }

    const newRoom = {
      roomId: `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      roomName: roomName.trim(),
      password: roomPassword,
      hostId: user.id,
      hostName: user.username,
      theme: selectedTheme,
      difficulty,
      status: 'waiting',
      createdAt: new Date().toISOString()
    };

    // Simulate room creation (in real app, this would be an API call)
    setRoomData(newRoom);
    setIsHost(true);
    setMode('lobby');

    toast({
      title: "Room created! 🎮",
      description: `Share the room ID: ${newRoom.roomId}`,
    });
  };

  const joinRoom = async () => {
    if (!joinRoomId.trim()) {
      toast({
        title: "Room ID required",
        description: "Please enter a room ID",
        variant: "destructive"
      });
      return;
    }

    // Simulate room joining (in real app, this would be an API call)
    const mockRoom = {
      roomId: joinRoomId,
      roomName: "Friend's Room",
      hostId: 'host123',
      hostName: 'Host Player',
      guestId: user.id,
      guestName: user.username,
      theme: selectedTheme,
      difficulty: 16,
      status: 'ready'
    };

    setRoomData(mockRoom);
    setIsHost(false);
    setMode('lobby');

    toast({
      title: "Joined room! 🎯",
      description: `Welcome to ${mockRoom.roomName}`,
    });
  };

  const copyRoomLink = () => {
    const roomLink = `${window.location.origin}/room/${roomData.roomId}`;
    navigator.clipboard.writeText(roomLink);
    toast({
      title: "Link copied! 📋",
      description: "Share this link with your friend",
    });
  };

  const startGame = () => {
    if (roomData) {
      onStartMultiplayer(roomData);
    }
  };

  if (mode === 'lobby' && roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-violet-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button 
              onClick={() => setMode('select')}
              variant="outline"
              className="border-green-600/50 text-green-400 hover:bg-green-600/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-violet-400 bg-clip-text text-transparent mb-2">
                  {roomData.roomName}
                </h2>
                <p className="text-gray-300">Room ID: {roomData.roomId}</p>
                {isHost && (
                  <Button 
                    onClick={copyRoomLink}
                    variant="outline"
                    className="mt-2 border-green-600/50 text-green-400 hover:bg-green-600/10"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Room Link
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Host Player */}
                <div className="text-center p-6 bg-green-900/30 rounded-2xl border border-green-600/30">
                  <Crown className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white text-lg">{roomData.hostName}</h3>
                  <Badge className="bg-green-600 text-white mt-2">Host</Badge>
                </div>

                {/* Guest Player */}
                <div className="text-center p-6 bg-violet-900/30 rounded-2xl border border-violet-600/30">
                  <Users className="w-8 h-8 text-violet-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white text-lg">
                    {roomData.guestName || 'Waiting for player...'}
                  </h3>
                  <Badge className={roomData.guestName ? "bg-violet-600 text-white" : "bg-gray-600 text-gray-300"}>
                    {roomData.guestName ? 'Guest' : 'Waiting'}
                  </Badge>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4 text-gray-300">
                  <span>Theme: <strong className="text-green-400 capitalize">{roomData.theme}</strong></span>
                  <span>•</span>
                  <span>Cards: <strong className="text-violet-400">{roomData.difficulty}</strong></span>
                </div>

                {roomData.guestName && (
                  <Button 
                    onClick={startGame}
                    className="bg-gradient-to-r from-green-600 to-violet-600 hover:from-green-700 hover:to-violet-700 text-white font-semibold py-3 px-8 text-lg rounded-2xl"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Multiplayer Game
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-violet-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <Button 
            onClick={onBackToMenu}
            variant="outline"
            className="border-green-600/50 text-green-400 hover:bg-green-600/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-violet-400 bg-clip-text text-transparent mb-4">
            Mastermind Room
          </h1>
          <p className="text-xl text-gray-300">Challenge friends in real-time memory battles</p>
        </div>

        {mode === 'select' && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-black/40 backdrop-blur-xl border-green-800/30 shadow-2xl hover:border-green-600/50 transition-all duration-300 cursor-pointer" onClick={() => setMode('create')}>
              <CardContent className="p-8 text-center">
                <Crown className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Create Room</h2>
                <p className="text-gray-300">Host a game and invite friends</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl hover:border-violet-600/50 transition-all duration-300 cursor-pointer" onClick={() => setMode('join')}>
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-violet-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Join Room</h2>
                <p className="text-gray-300">Join a friend's game room</p>
              </CardContent>
            </Card>
          </div>
        )}

        {mode === 'create' && (
          <Card className="bg-black/40 backdrop-blur-xl border-green-800/30 shadow-2xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Game Room</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Room Name</label>
                  <Input
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name..."
                    className="bg-black/50 border-green-600/30 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Password (Optional)</label>
                  <Input
                    type="password"
                    value={roomPassword}
                    onChange={(e) => setRoomPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="bg-black/50 border-green-600/30 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Theme</label>
                  <ThemeSelector 
                    selectedTheme={selectedTheme}
                    onThemeSelect={setSelectedTheme}
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => setMode('select')}
                    variant="outline"
                    className="flex-1 border-gray-600/50 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={createRoom}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  >
                    Create Room
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {mode === 'join' && (
          <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Join Game Room</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Room ID</label>
                  <Input
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="Enter room ID..."
                    className="bg-black/50 border-violet-600/30 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Password (if required)</label>
                  <Input
                    type="password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="bg-black/50 border-violet-600/30 text-white"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => setMode('select')}
                    variant="outline"
                    className="flex-1 border-gray-600/50 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={joinRoom}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800"
                  >
                    Join Room
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
