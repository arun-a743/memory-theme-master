
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { themes } from "../utils/themes";

export const GameCard = ({ card, isFlipped, isMatched, onClick, isShuffling, theme, isCustomTheme }) => {
  // Get theme data (including custom themes)
  const getThemeData = () => {
    if (isCustomTheme) {
      const customThemes = JSON.parse(localStorage.getItem('customThemes') || '[]');
      const customTheme = customThemes.find(t => t.id === theme);
      return customTheme || themes.animals;
    }
    return themes[theme] || themes.animals;
  };

  const themeData = getThemeData();
  
  return (
    <Card 
      className={cn(
        "aspect-square cursor-pointer transition-all duration-300 transform-gpu relative overflow-hidden",
        "hover:scale-105 active:scale-95",
        isShuffling && "animate-pulse opacity-70",
        isMatched && "ring-2 ring-green-400 bg-green-900/30",
        isFlipped && !isMatched && "ring-2 ring-violet-400",
        "bg-gradient-to-br from-black to-gray-900 shadow-xl border border-gray-700"
      )}
      onClick={onClick}
    >
      <div className="w-full h-full relative perspective-1000">
        <div 
          className={cn(
            "w-full h-full transition-transform duration-500 transform-style-preserve-3d",
            (isFlipped || isMatched) && "rotate-y-180"
          )}
        >
          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg">
            <div 
              className={cn(
                "w-full h-full rounded-lg flex items-center justify-center",
                `bg-gradient-to-br ${themeData.gradient}`,
                "shadow-inner"
              )}
            >
              <div className="text-white/90 text-2xl font-bold">?</div>
            </div>
          </div>
          
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg rotate-y-180">
            <div className="w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-lg flex items-center justify-center shadow-inner border border-gray-200">
              {isCustomTheme ? (
                <img 
                  src={card.symbol} 
                  alt="Custom card"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-3xl md:text-4xl" role="img" aria-label={card.symbol}>
                  {card.symbol}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isShuffling && (
        <div className="absolute inset-0 bg-violet-600/20 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" />
        </div>
      )}
    </Card>
  );
};
