import React, { useState } from 'react';
import { Camera, Image, Loader2, Eye, Copy, CheckCircle, Sparkles } from 'lucide-react';
import { extractTextFromImage, summarizeText } from '../../services/api';

const HandwrittenNotes: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setError('');
      setExtractedText('');
      setSummary('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('Please select a valid image file');
    }
  };

  const handleExtractText = async () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    setError('');

    const result = await extractTextFromImage(selectedImage);
    
    if (result.success && result.data) {
      setExtractedText(result.data.extracted_text);
    } else {
      setError(result.error || 'Failed to extract text from image');
    }
    
    setIsProcessing(false);
  };

  const handleSummarize = async () => {
    if (!extractedText) return;
    
    setIsSummarizing(true);
    setError('');

    const result = await summarizeText(extractedText);
    
    if (result.success && result.data) {
      setSummary(result.data.Summary);
    } else {
      setError(result.error || 'Failed to summarize text');
    }
    
    setIsSummarizing(false);
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-success">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">📝 Handwritten Notes</h3>
        <p className="text-neutral-600">Convert handwritten text to digital format with AI</p>
      </div>

      <div className="space-y-6">
        {/* Image Upload */}
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
            className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-green-400 hover:bg-white/20 transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
          >
            {preview ? (
              <div className="text-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-w-xs mx-auto h-32 object-cover rounded-xl mb-3 shadow-md"
                />
                <p className="text-sm text-neutral-600">Click to change image</p>
              </div>
            ) : (
              <div className="text-center">
                <Image className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                <span className="text-neutral-700 font-medium block">
                  Click to select image file
                </span>
                <span className="text-sm text-neutral-500 mt-1 block">
                  Supports JPG, PNG, WEBP formats
                </span>
              </div>
            )}
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Extract Text Button */}
        <button
          onClick={handleExtractText}
          disabled={!selectedImage || isProcessing}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span className="text-white">Extracting text...</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5 text-white" />
              <span className="text-white">Extract Text</span>
            </>
          )}
        </button>

        {/* Extracted Text */}
        {extractedText && (
          <div className="p-6 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl border border-green-200/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-green-700 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Extracted Text
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(extractedText)}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors text-sm"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Summarizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Summarize</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="text-neutral-700 leading-relaxed whitespace-pre-wrap font-sans text-sm">{extractedText}</pre>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <div className="p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-blue-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Summary
              </h4>
              <button
                onClick={() => handleCopy(summary)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            </div>
            <p className="text-neutral-700 leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandwrittenNotes;