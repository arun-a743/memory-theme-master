
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Lock, User, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        username: formData.username || formData.email.split('@')[0],
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
        token: 'mock-jwt-token-' + Date.now(),
        gamesPlayed: 0,
        bestScore: null,
        createdAt: new Date().toISOString()
      };

      onLogin(userData);
      setLoading(false);
      
      toast({
        title: isSignUp ? "Account created!" : "Welcome back!",
        description: `Successfully ${isSignUp ? 'registered' : 'logged in'} as ${userData.username}`,
      });
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    
    // Simulate Google OAuth
    setTimeout(() => {
      const userData = {
        id: Date.now(),
        username: 'GoogleUser',
        email: 'user@gmail.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
        token: 'mock-google-token-' + Date.now(),
        gamesPlayed: 5,
        bestScore: 42,
        createdAt: new Date().toISOString(),
        provider: 'google'
      };

      onLogin(userData);
      setLoading(false);
      
      toast({
        title: "Google Sign-in Successful!",
        description: `Welcome back, ${userData.username}`,
      });
    }, 1000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </Button>
          <CardTitle className="text-center">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Google Sign-in */}
          <Button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            <Chrome className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    className="pl-9"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="pl-9"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="pl-9"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <Badge className="bg-blue-100 text-blue-800 mb-2">Demo Mode</Badge>
            <p className="text-xs text-blue-700">
              This is a demo authentication system. In production, this would connect to a real backend with secure user management.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
