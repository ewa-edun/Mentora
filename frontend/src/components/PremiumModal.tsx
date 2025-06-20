import React, { useState } from 'react';
import { X, Crown, Mic, Brain, Heart, Zap, CheckCircle, Star } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const features = [
    { icon: <Mic className="w-5 h-5" />, text: "Unlimited voice conversations" },
    { icon: <Brain className="w-5 h-5" />, text: "Advanced AI tutoring" },
    { icon: <Heart className="w-5 h-5" />, text: "Premium emotion detection" },
    { icon: <Zap className="w-5 h-5" />, text: "Custom voice personalities" },
    { icon: <Star className="w-5 h-5" />, text: "Priority support" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "Detailed learning analytics" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="absolute bg-white rounded-3xl h-full max-w-2xl w-full shadow-2xl animate-fadeIn flex flex-col items-stretch">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-xl transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-neutral-600" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 px-8 pt-8 pb-4 border-b border-neutral-100">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Mentora+
            </h2>
            <p className="text-neutral-600 text-sm">Unlock your full learning potential</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-8 py-6 bg-white rounded-b-3xl">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="text-amber-500">{feature.icon}</div>
              <span className="text-neutral-800 text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-neutral-100 p-1 rounded-xl flex shadow-inner">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                selectedPlan === 'yearly'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              Yearly
              <span className="absolute -top-3 -right-4 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-neutral-800 mb-2">
            ${selectedPlan === 'monthly' ? '9.99' : '59.99'}
            <span className="text-lg text-neutral-600">
              /{selectedPlan === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          {selectedPlan === 'yearly' && (
            <p className="text-green-600 text-sm">Save $60 per year!</p>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 px-8 pb-8">
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Upgrade to Mentora+ 
          </button>
          <button
            onClick={onClose}
            className="w-full bg-neutral-100 text-neutral-700 py-3 px-6 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
          >
            Continue with Free Plan
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-500 pb-6">
          Cancel anytime • 7-day free trial • No commitment
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;