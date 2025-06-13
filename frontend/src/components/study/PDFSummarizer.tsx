import React, { useState } from 'react';
import { FileText, Upload, Loader2, Sparkles } from 'lucide-react';

const PDFSummarizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    // TODO: Connect to Flask API for PDF processing
    
    // Simulate API call for demo
    setTimeout(() => {
      setIsProcessing(false);
      setSummary("This document covers advanced machine learning concepts including neural networks, deep learning architectures, and practical applications in computer vision and natural language processing...");
    }, 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">📄 Upload PDF</h3>
        <p className="text-gray-600">Get AI-powered summaries of your documents</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-red-400 transition-colors cursor-pointer bg-gradient-to-br from-white/50 to-gray-50/50"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-600 font-medium">
                {selectedFile ? selectedFile.name : 'Click to select PDF file'}
              </span>
            </div>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isProcessing}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Summarizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Summarize PDF</span>
            </>
          )}
        </button>

        {summary && (
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
            <h4 className="font-semibold text-red-700 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Summary
            </h4>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}
      </div>

      {/* TODO: Connect to Flask API for PDF summarization */}
    </div>
  );
};

export default PDFSummarizer;