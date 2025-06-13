import React, { useState } from 'react';
import { Camera, Image, Loader2 } from 'lucide-react';

const HandwrittenNotes: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    // TODO: Connect to Flask API for OCR processing
    
    // Simulate API call for demo
    setTimeout(() => {
      setIsProcessing(false);
      alert('OCR text extraction would happen here!');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Camera className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">📝 Scan Handwritten Notes</h3>
        <p className="text-gray-600 text-sm mt-1">Convert handwritten text to digital format</p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            {preview ? (
              <div className="w-full max-w-xs">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-2">Click to change image</p>
              </div>
            ) : (
              <>
                <Image className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Click to select image file
                </span>
              </>
            )}
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedImage || isProcessing}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-green-700 transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Extracting...</span>
            </>
          ) : (
            <span>Extract Text</span>
          )}
        </button>
      </div>

      {/* TODO: Connect to Flask API for OCR text extraction */}
    </div>
  );
};

export default HandwrittenNotes;