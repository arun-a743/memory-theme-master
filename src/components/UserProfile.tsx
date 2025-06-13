
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, LogOut, User } from "lucide-react";

export const UserProfile = ({ user, isAuthenticated, onLogin, onLogout }) => {
  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-gradient-to-r from-violet-600 to-green-600 hover:from-violet-700 hover:to-green-700 text-white rounded-2xl">
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="ring-2 ring-green-400/50">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-gradient-to-br from-violet-600 to-green-600 text-white">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{user.username}</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white text-xs">Champion</Badge>
              {user.provider === 'google' && (
                <Badge className="bg-violet-600 text-white text-xs">Google</Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLogout}
            className="text-gray-300 hover:text-white hover:bg-violet-600/20"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
