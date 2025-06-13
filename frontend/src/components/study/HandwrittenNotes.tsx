import React, { useState } from 'react';
import { Camera, Image, Loader2, Eye } from 'lucide-react';

const HandwrittenNotes: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');

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
      setExtractedText("Newton's Laws of Motion:\n1. An object at rest stays at rest unless acted upon by force\n2. F = ma (Force equals mass times acceleration)\n3. For every action, there is an equal and opposite reaction");
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">📝 Handwritten Notes</h3>
        <p className="text-gray-600">Convert handwritten text to digital format</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-400 transition-colors cursor-pointer bg-gradient-to-br from-white/50 to-gray-50/50"
          >
            {preview ? (
              <div className="text-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-w-xs mx-auto h-32 object-cover rounded-xl mb-2"
                />
                <p className="text-sm text-gray-600">Click to change image</p>
              </div>
            ) : (
              <div className="text-center">
                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-600 font-medium">
                  Click to select image file
                </span>
              </div>
            )}
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedImage || isProcessing}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Extracting...</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              <span>Extract Text</span>
            </>
          )}
        </button>

        {extractedText && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <h4 className="font-semibold text-green-700 mb-3 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Extracted Text
            </h4>
            <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">{extractedText}</pre>
          </div>
        )}
      </div>

      {/* TODO: Connect to Flask API for OCR text extraction */}
    </div>
  );
};

export default HandwrittenNotes;