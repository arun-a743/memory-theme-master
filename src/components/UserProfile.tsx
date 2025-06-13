
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LogIn, LogOut, User } from "lucide-react";

export const UserProfile = ({ user, isAuthenticated, onLogin, onLogout }) => {
  if (!isAuthenticated) {
    return (
      <Button onClick={onLogin} className="bg-white text-purple-600 hover:bg-white/90">
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback className="bg-white text-purple-600">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{user.username}</h3>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white text-xs">Online</Badge>
              {user.provider === 'google' && (
                <Badge className="bg-red-500 text-white text-xs">Google</Badge>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onLogout}
            className="text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
