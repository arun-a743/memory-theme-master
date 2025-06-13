
import { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const CustomThemeUploader = ({ onThemeCreated, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [themeName, setThemeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Some files were skipped",
        description: "Only image files under 5MB are allowed",
        variant: "destructive"
      });
    }

    setSelectedFiles(prev => {
      const combined = [...prev, ...validFiles];
      return combined.slice(0, 16); // Max 16 images
    });
  }, [toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertFilesToBase64 = async (files) => {
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    return Promise.all(promises);
  };

  const handleSaveTheme = async () => {
    if (selectedFiles.length < 8) {
      toast({
        title: "Not enough images",
        description: "Please upload at least 8 images for a complete theme",
        variant: "destructive"
      });
      return;
    }

    if (!themeName.trim()) {
      toast({
        title: "Theme name required",
        description: "Please enter a name for your custom theme",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert files to base64 for local storage (in real app, upload to cloud)
      const base64Images = await convertFilesToBase64(selectedFiles);
      
      // Create theme object
      const customTheme = {
        id: `custom_${Date.now()}`,
        name: themeName,
        description: `Custom theme with ${selectedFiles.length} images`,
        symbols: base64Images,
        gradient: 'from-violet-600 to-green-600',
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (in real app, save to backend)
      const existingThemes = JSON.parse(localStorage.getItem('customThemes') || '[]');
      existingThemes.push(customTheme);
      localStorage.setItem('customThemes', JSON.stringify(existingThemes));

      toast({
        title: "Theme created successfully! 🎨",
        description: `"${themeName}" is now available in your themes`,
      });

      onThemeCreated(customTheme);
      onClose();
    } catch (error) {
      toast({
        title: "Failed to create theme",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isValid = selectedFiles.length >= 8 && themeName.trim();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="bg-black/90 border-green-600/50 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Create Custom Theme</h3>
              <p className="text-gray-300">Upload 8-16 images to create your personalized memory game</p>
            </div>
            <Button 
              onClick={onClose}
              variant="outline"
              size="sm"
              className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Theme Name Input */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Theme Name</label>
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Custom Theme"
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
              maxLength={30}
            />
          </div>

          {/* Upload Area */}
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 mb-6",
              selectedFiles.length > 0 
                ? "border-green-600/50 bg-green-900/10" 
                : "border-gray-600/50 bg-gray-900/20 hover:border-violet-600/50 hover:bg-violet-900/10"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">
              Drag & drop images here
            </h4>
            <p className="text-gray-300 mb-4">
              Or click to select files (JPG, PNG, WEBP - max 5MB each)
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-violet-600 to-green-600 hover:from-violet-700 hover:to-green-700"
            >
              <Image className="w-4 h-4 mr-2" />
              Select Images
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File Count Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge 
                className={cn(
                  "text-white",
                  selectedFiles.length >= 8 
                    ? "bg-green-600" 
                    : "bg-gray-600"
                )}
              >
                {selectedFiles.length >= 8 ? <Check className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {selectedFiles.length}/16 images
              </Badge>
              {selectedFiles.length < 8 && (
                <span className="text-sm text-gray-400">
                  Need at least 8 images
                </span>
              )}
            </div>
            {selectedFiles.length > 0 && (
              <Button
                onClick={() => setSelectedFiles([])}
                variant="outline"
                size="sm"
                className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Image Previews */}
          {selectedFiles.length > 0 && (
            <div className="max-h-64 overflow-y-auto mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-900/50 border border-gray-600/30">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSaveTheme}
              disabled={!isValid || isUploading}
              className={cn(
                "flex-1 font-semibold py-3",
                isValid 
                  ? "bg-gradient-to-r from-green-600 to-violet-600 hover:from-green-700 hover:to-violet-700" 
                  : "bg-gray-600 cursor-not-allowed"
              )}
            >
              {isUploading ? "Creating Theme..." : "Create Custom Theme"}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600/50 text-gray-300 hover:bg-gray-800/50"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
