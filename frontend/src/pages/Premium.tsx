import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Check, Brain, Heart, Star, Shield, Headphones, Sparkles, ArrowLeft, CreditCard, Gift, Infinity, Target, TrendingUp} from 'lucide-react';
import { getCurrentUser } from '../services/firebase';

const Premium: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const freeFeatures = [
    "Basic AI tutoring",
    "Text summarization (200/day)",
    "Youtube Video summarization (20/day)",
    "Images to Notes summarization (20/day)",
    "Simple quiz generation",
    "Basic voice chat (100 min/day)",
    "Standard emotion detection",
    "Community support"
  ];

  const premiumFeatures = [
    "Unlimited AI conversations",
    "Advanced emotion analysis",
    "Custom voice personalities",
    "Unlimited summaries & quizzes",
    "Priority AI processing",
    "Advanced learning analytics",
    "Personalized study plans",
    "Premium wellness content",
    "Video avatar tutoring",
    "Export & sharing tools",
    "Priority customer support",
    "Early access to new features"
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Medical Student",
      content: "Mentora+ transformed my study routine. The unlimited voice conversations help me learn on-the-go, and the emotion detection keeps me balanced during stressful exam periods.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "High School Senior",
      content: "The custom voice personalities make studying actually fun! I have different AI tutors for different subjects, and they adapt to my mood perfectly.",
      rating: 5,
      avatar: "MJ"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "University Professor",
      content: "I recommend Mentora+ to all my students. The advanced analytics help me understand how they're learning, and the wellness features support their mental health.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const handleUpgrade = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, this would integrate with RevenueCat or Stripe
      alert('🎉 Welcome to Mentora+! Your premium features are now active.');
    }, 2000);
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'there';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-secondary-200/30 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary-100/40 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239d75ff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-3 group">
              <ArrowLeft className="w-5 h-5 text-primary-600 group-hover:-translate-x-1 transition-transform" />
              <span className="text-primary-600 font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Mentora
              </span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto glow-error animate-float">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-15 h-15 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse-slow">
                <a
                  href="https://bolt.new/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Powered by Bolt.new"
                  className="block w-16 h-16"
                >
                <img
                  src='../../public/white_bolt.png'
                  alt="Bolt.new logo"
                  className="w-16 h-16 object-contain"
                  draggable={false}
                />
               </a>
             </div>
             <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse-slow">
               <Sparkles className="w-4 h-4 text-white" />
             </div>
           </div>
            
            <h1 className="text-5xl md:text-6xl font-serif font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-6">
              Mentora+
            </h1>
            <p className="text-2xl text-black-600 mb-4">
              Unlock Your Full Learning Potential
            </p>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
              {user ? `Hey ${getUserDisplayName()}! ` : ''}
              Experience the most advanced AI-powered learning platform with unlimited conversations, 
              premium emotion detection, and personalized study experiences designed just for you.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-5">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">10K+</div>
                <div className="text-sm text-neutral-600">Happy Students</div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">95%</div>
                <div className="text-sm text-neutral-600">Success Rate</div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
                <div className="text-sm text-neutral-600">AI Support</div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-amber-600 mb-2">∞</div>
                <div className="text-sm text-neutral-600">Conversations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-2 rounded-2xl flex">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-8 py-3 rounded-xl font-medium transition-all ${
                    selectedPlan === 'monthly'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'text-black-600 hover:text-black-900 bg-white/60 hover:bg-white/90'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-8 py-3 rounded-xl font-medium transition-all relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'text-black-600 hover:text-black-900 bg-white/60 hover:bg-white/90'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Save 40%
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-serif font-bold text-neutral-800 mb-2">Free Plan</h3>
                  <div className="text-4xl font-bold text-neutral-800 mb-4">
                    $0<span className="text-lg text-neutral-600">/month</span>
                  </div>
                  <p className="text-neutral-600">Perfect for getting started</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full bg-white/70 border border-black/50 text-black-700 py-3 px-6 rounded-xl font-medium hover:bg-white/100 hover:border-black/80 transition-all duration-300">
                  Current Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-2 border-amber-200/50 rounded-3xl p-8 shadow-2xl relative">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>

                <div className="text-center mb-8 mt-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Crown className="w-8 h-8 text-amber-500" />
                    <h3 className="text-2xl font-serif font-bold text-neutral-800">Mentora+</h3>
                  </div>
                  
                  <div className="text-5xl font-bold text-neutral-800 mb-2">
                    ${selectedPlan === 'monthly' ? '9.99' : '59.99'}
                    <span className="text-lg text-neutral-600">
                      /{selectedPlan === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  
                  {selectedPlan === 'yearly' && (
                    <div className="text-green-600 font-medium mb-2">
                      Save $60 per year!
                    </div>
                  )}
                  
                  <p className="text-neutral-600">Everything you need to excel</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-neutral-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Upgrade to Mentora+</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-neutral-500 mt-4">
                  14-day free trial • Cancel anytime • No commitment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase */}
        <section className="px-6 py-20 bg-white/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Premium Features That Make a Difference
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Discover how Mentora+ transforms your learning experience with advanced AI and personalized features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-2xl p-8 hover:bg-white/40 hover:border-white/50 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Infinity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-3">Unlimited Everything</h3>
                <p className="text-neutral-600 leading-relaxed">No limits on AI conversations, summaries, or quizzes. Learn as much as you want, whenever you want.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-3">Advanced Emotion AI</h3>
                <p className="text-neutral-600 leading-relaxed">Sophisticated emotion detection that understands subtle mood changes and provides precise wellness recommendations.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-3">Custom Voice Personalities</h3>
                <p className="text-neutral-600 leading-relaxed">Choose from multiple AI tutors with different personalities, or create your own custom voice companion.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-3">Learning Analytics</h3>
                <p className="text-neutral-600 leading-relaxed">Detailed insights into your learning patterns, emotional trends, and personalized improvement recommendations.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-3">Personalized Study Plans</h3>
                <p className="text-neutral-600 leading-relaxed">AI-generated study schedules that adapt to your learning style, emotional patterns, and academic goals.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-bold text-neutral-800 mb-3">Priority Support</h3>
                <p className="text-neutral-600 leading-relaxed">Get help when you need it with priority customer support and early access to new features.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                What Our Premium Users Say
              </h2>
              <p className="text-xl text-neutral-600">
                Join thousands of students who've transformed their learning with Mentora+
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-8 hover:bg-white/30 hover:border-white/40 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-neutral-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-800">{testimonial.name}</div>
                      <div className="text-sm text-neutral-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-20 bg-white/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Can I cancel my subscription anytime?</h3>
                <p className="text-neutral-600">Yes! You can cancel your Mentora+ subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Is there a free trial?</h3>
                <p className="text-neutral-600">Absolutely! We offer a 14-day free trial so you can experience all the premium features before committing to a subscription.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">What happens to my data if I cancel?</h3>
                <p className="text-neutral-600">Your learning data and progress are always yours. If you cancel, you can still access your basic account and export your data anytime.</p>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Do you offer student discounts?</h3>
                <p className="text-neutral-600">Yes! We offer special pricing for students. Contact our support team with your student ID for more information about available discounts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl p-12">
              <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                <Gift className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-6">
                Ready to Unlock Your Potential?
              </h2>
              <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already learning smarter, feeling better, and achieving more with Mentora+.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5" />
                      <span>Start Free Trial</span>
                    </>
                  )}
                </button>
                
                <Link 
                  to="/home" 
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-neutral-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 hover:border-white/50 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
                >
                  <span>Continue with Free</span>
                </Link>
              </div>

              <p className="text-sm text-neutral-500 mt-6">
                No credit card required for trial • Full access to all features • Cancel anytime
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Premium;