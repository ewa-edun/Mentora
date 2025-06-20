import React, { useState } from 'react';
import { FileText, Upload, Loader2, Sparkles, Download, Copy, CheckCircle } from 'lucide-react';
import { summarizePDF } from '../../services/api';

const PDFSummarizer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
      setSummary('');
    } else if (file) {
      setError('Please select a valid PDF file');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setError('');

    const result = await summarizePDF(selectedFile);
    
    if (result.success && result.data) {
      setSummary(result.data.Summary);
    } else {
      setError(result.error || 'Failed to summarize PDF');
    }
    
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (summary) {
      const blob = new Blob([summary], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedFile?.name || 'document'}_summary.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-error">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">📄 PDF Summarizer</h3>
        <p className="text-neutral-600">Get AI-powered summaries of your PDF documents</p>
      </div>

      <div className="space-y-6">
        {/* File Upload */}
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
            className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-red-400 hover:bg-white/20 transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
          >
            <div className="text-center">
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-3" />
              <span className="text-gray-700 font-medium block">
                {selectedFile ? selectedFile.name : 'Click to select PDF file'}
              </span>
              <span className="text-sm text-neutral-500 mt-1 block">
                Maximum file size: 10MB
              </span>
            </div>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || isProcessing}
          className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span className="text-white">Analyzing PDF...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white">Summarize PDF</span>
            </>
          )}
        </button>

        {/* Summary Result */}
        {summary && (
          <div className="p-6 bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl border border-red-200/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-red-700 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Summary
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm"
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
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFSummarizer;