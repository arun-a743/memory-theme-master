
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { themes } from "../utils/themes";

export const ThemeSelector = ({ selectedTheme, onThemeSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
};
