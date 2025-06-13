
import { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CustomThemeUploader = ({ onThemeCreated }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [themeName, setThemeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
      return 'Only PNG, JPG, and WEBP files are allowed';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 2MB';
    }
    return null;
  };

  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files || []) as File[];
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      toast({
        title: "File validation errors",
        description: errors.join(', '),
        variant: "destructive"
      });
    }

    if (selectedFiles.length + validFiles.length > 18) {
      toast({
        title: "Too many files",
        description: "Maximum 18 images allowed",
        variant: "destructive"
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  }, [selectedFiles.length, toast]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files) as File[];
    handleFileSelect({ target: { files } });
  }, [handleFileSelect]);

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const createTheme = async () => {
    if (selectedFiles.length < 8) {
      toast({
        title: "Not enough images",
        description: "Minimum 8 images required",
        variant: "destructive"
      });
      return;
    }

    if (!themeName.trim()) {
      toast({
        title: "Theme name required",
        description: "Please enter a name for your theme",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Convert files to base64 URLs for demo (in production, upload to cloud storage)
      const imageUrls = await Promise.all(
        selectedFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result);
            reader.readAsDataURL(file);
          });
        })
      );

      const customTheme = {
        id: `custom-${Date.now()}`,
        name: themeName,
        symbols: imageUrls,
        isCustom: true,
        gradient: 'from-violet-600 to-green-600'
      };

      // Save to localStorage (in production, save to database)
      const existingThemes = JSON.parse(localStorage.getItem('customThemes') || '[]');
      existingThemes.push(customTheme);
      localStorage.setItem('customThemes', JSON.stringify(existingThemes));

      toast({
        title: "Theme created!",
        description: `"${themeName}" is ready to use`,
      });

      onThemeCreated(customTheme);
      setSelectedFiles([]);
      setThemeName('');
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to create theme. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-violet-800/30 shadow-2xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-violet-400" />
          Create Custom Theme
        </h3>

        {/* Theme Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Theme Name
          </label>
          <input
            type="text"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            placeholder="Enter theme name..."
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-violet-400 focus:outline-none"
          />
        </div>

        {/* Upload Zone */}
        <div
          className="border-2 border-dashed border-gray-600/50 rounded-xl p-8 text-center mb-4 hover:border-violet-400/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-300 mb-2">Drag & drop images here or</p>
          <Button
            variant="outline"
            className="border-violet-600/50 text-violet-400 hover:bg-violet-600/10"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Select Files
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-400 mt-2">
            8-18 images • PNG, JPG, WEBP • Max 2MB each
          </p>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-300">
                Selected Images ({selectedFiles.length}/18)
              </span>
              <Badge className={`${selectedFiles.length >= 8 ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
                {selectedFiles.length >= 8 ? 'Ready' : `Need ${8 - selectedFiles.length} more`}
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-16 object-cover rounded-lg border border-gray-600/50"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Button */}
        <Button
          onClick={createTheme}
          disabled={selectedFiles.length < 8 || !themeName.trim() || isUploading}
          className="w-full bg-gradient-to-r from-violet-600 to-green-600 hover:from-violet-700 hover:to-green-700 disabled:opacity-50"
        >
          {isUploading ? (
            "Creating Theme..."
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Create Theme
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
