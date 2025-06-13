
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { themes } from "../utils/themes";

export const ThemeSelector = ({ selectedTheme, onThemeSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.entries(themes).map(([themeKey, themeData]) => (
        <Card 
          key={themeKey}
          className={cn(
            "cursor-pointer transition-all duration-200 hover:scale-105",
            selectedTheme === themeKey 
              ? "ring-2 ring-white bg-white/20" 
              : "bg-white/10 hover:bg-white/15"
          )}
          onClick={() => onThemeSelect(themeKey)}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className={cn(
                "w-full h-16 rounded-lg mb-3 flex items-center justify-center",
                `bg-gradient-to-br ${themeData.gradient}`
              )}>
                <div className="flex gap-1">
                  {themeData.symbols.slice(0, 3).map((symbol, index) => (
                    <span key={index} className="text-xl">{symbol}</span>
                  ))}
                </div>
              </div>
              <h3 className="font-semibold text-white capitalize">{themeData.name}</h3>
              <p className="text-white/70 text-sm">{themeData.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
