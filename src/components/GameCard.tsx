
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { themes } from "../utils/themes";

export const GameCard = ({ card, isFlipped, isMatched, onClick, isShuffling, theme }) => {
  const themeData = themes[theme];
  
  return (
    <Card 
      className={cn(
        "aspect-square cursor-pointer transition-all duration-300 transform-gpu relative overflow-hidden",
        "hover:scale-105 active:scale-95",
        isShuffling && "animate-pulse opacity-70",
        isMatched && "ring-2 ring-green-400 bg-green-100",
        isFlipped && !isMatched && "ring-2 ring-blue-400",
        "bg-gradient-to-br from-white to-gray-100 shadow-lg"
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
              <div className="text-white/80 text-2xl font-bold">?</div>
            </div>
          </div>
          
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg rotate-y-180">
            <div className="w-full h-full bg-white rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-3xl md:text-4xl" role="img" aria-label={card.symbol}>
                {card.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {isShuffling && (
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-ping" />
        </div>
      )}
    </Card>
  );
};
