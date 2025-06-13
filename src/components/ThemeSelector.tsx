
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { themes } from "../utils/themes";
import { CustomThemeUploader } from "./CustomThemeUploader";
import { useToast } from "@/hooks/use-toast";

export const ThemeSelector = ({ selectedTheme, onThemeSelect }) => {
  const [customThemes, setCustomThemes] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  // Load custom themes from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('customThemes') || '[]');
    setCustomThemes(saved);
  }, []);

  const handleCustomThemeCreated = (newTheme) => {
    setCustomThemes(prev => {
      const updated = [...prev, newTheme];
      localStorage.setItem('customThemes', JSON.stringify(updated));
      return updated;
    });
    
    // Auto-select the new theme
    onThemeSelect(newTheme.id);
  };

  const deleteCustomTheme = (themeId) => {
    setCustomThemes(prev => {
      const updated = prev.filter(theme => theme.id !== themeId);
      localStorage.setItem('customThemes', JSON.stringify(updated));
      
      // If deleted theme was selected, switch to default
      if (selectedTheme === themeId) {
        onThemeSelect('animals');
      }
      
      return updated;
    });

    toast({
      title: "Theme deleted",
      description: "Custom theme has been removed",
    });
  };

  const allThemes = [
    ...Object.entries(themes).map(([key, theme]) => ({ 
      id: key, 
      ...theme, 
      isCustom: false 
    })),
    ...customThemes
  ];

  const selectedThemeData = allThemes.find(theme => theme.id === selectedTheme);

  return (
    <div>
      {/* Current Selection Display */}
      {selectedThemeData && (
        <Card className="mb-4 border-green-600/50 bg-black/60">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-green-600 to-violet-600 flex items-center justify-center">
                {selectedThemeData.isCustom ? (
                  <img 
                    src={selectedThemeData.symbols[0]} 
                    alt="Custom theme preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex gap-1">
                    {selectedThemeData.symbols.slice(0, 2).map((symbol, index) => (
                      <span key={index} className="text-lg">{symbol}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  {selectedThemeData.name}
                  {selectedThemeData.isCustom && (
                    <Badge className="bg-violet-600 text-white text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Custom
                    </Badge>
                  )}
                </h4>
                <p className="text-sm text-gray-300">{selectedThemeData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.entries(themes).map(([themeKey, themeData]) => (
          <Card 
            key={themeKey}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 group",
              selectedTheme === themeKey 
                ? "ring-2 ring-green-400 bg-black/60 border-green-600/50" 
                : "bg-black/30 hover:bg-black/50 border-gray-600/30 hover:border-violet-600/50"
            )}
            onClick={() => onThemeSelect(themeKey)}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <div className={cn(
                  "w-full h-16 rounded-2xl mb-3 flex items-center justify-center transition-all duration-300",
                  `bg-gradient-to-br ${themeData.gradient}`,
                  selectedTheme === themeKey ? "scale-105" : "group-hover:scale-102"
                )}>
                  <div className="flex gap-1">
                    {themeData.symbols.slice(0, 3).map((symbol, index) => (
                      <span key={index} className="text-xl">{symbol}</span>
                    ))}
                  </div>
                </div>
                <h3 className={cn(
                  "font-semibold capitalize transition-colors",
                  selectedTheme === themeKey ? "text-green-400" : "text-white group-hover:text-violet-400"
                )}>
                  {themeData.name}
                </h3>
                <p className="text-gray-400 text-sm">{themeData.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Custom Themes */}
        {customThemes.map((theme) => (
          <Card 
            key={theme.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 group relative",
              selectedTheme === theme.id 
                ? "ring-2 ring-green-400 bg-black/60 border-green-600/50" 
                : "bg-black/30 hover:bg-black/50 border-gray-600/30 hover:border-violet-600/50"
            )}
            onClick={() => onThemeSelect(theme.id)}
          >
            <CardContent className="p-4">
              <div className="text-center">
                <div className={cn(
                  "w-full h-16 rounded-2xl mb-3 overflow-hidden transition-all duration-300",
                  selectedTheme === theme.id ? "scale-105" : "group-hover:scale-102"
                )}>
                  <img 
                    src={theme.symbols[0]} 
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={cn(
                  "font-semibold transition-colors",
                  selectedTheme === theme.id ? "text-green-400" : "text-white group-hover:text-violet-400"
                )}>
                  {theme.name}
                </h3>
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                  <Star className="w-3 h-3" />
                  Custom • {theme.symbols.length} images
                </p>
              </div>
              
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCustomTheme(theme.id);
                }}
                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </CardContent>
          </Card>
        ))}

        {/* Add Custom Theme Button */}
        <Card 
          className="cursor-pointer transition-all duration-300 hover:scale-105 group border-dashed border-2 border-violet-600/50 bg-violet-900/10 hover:bg-violet-900/20"
          onClick={() => setShowUploader(true)}
        >
          <CardContent className="p-4">
            <div className="text-center h-full flex flex-col justify-center">
              <div className="w-full h-16 rounded-2xl mb-3 flex items-center justify-center border-2 border-dashed border-violet-600/50 group-hover:border-violet-400 transition-colors">
                <Plus className="w-8 h-8 text-violet-400 group-hover:text-violet-300" />
              </div>
              <h3 className="font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                Create Theme
              </h3>
              <p className="text-gray-400 text-sm">Upload your images</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Theme Uploader Modal */}
      {showUploader && (
        <CustomThemeUploader 
          onThemeCreated={handleCustomThemeCreated}
          onClose={() => setShowUploader(false)}
        />
      )}
    </div>
  );
};
