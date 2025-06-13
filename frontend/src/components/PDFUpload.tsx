import React, { useState } from 'react';
import { FileText, Upload, Loader2 } from 'lucide-react';

const PDFUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    // TODO: Connect to Flask API for PDF processing
    
    // Simulate API call for demo
    setTimeout(() => {
      setIsUploading(false);
      alert('PDF processing would happen here!');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-shadow">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">📄 Upload PDF Notes</h3>
        <p className="text-gray-600 text-sm mt-1">Get AI-powered summaries of your documents</p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              {selectedFile ? selectedFile.name : 'Click to select PDF file'}
            </span>
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isUploading}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-red-700 transition-all"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Summarize PDF</span>
          )}
        </button>
      </div>

      {/* TODO: Connect to Flask API for PDF summarization */}
    </div>
  );
};

export default PDFUpload;