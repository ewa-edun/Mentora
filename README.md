# 🎙️ Mentora – The Emotion-Aware, Voice-First AI Study & Wellness Assistant

> Built for the Bolt.new Hackathon  
> Team Members: Ewa, Naghul, Gurmeet, Sandesh  
> Tech Stack: React, Flask, Firebase, Gemini, Whisper, ElevenLabs, Emotion Recognition API

> **"Learn smarter, not harder."**  
Mentora is a voice-first AI study coach that adapts to your learning style, emotional state, and study goals. It speaks like a tutor, listens like a friend, and remembers like a mentor.
Built for students, neurodivergent learners, and self-learners who crave an intuitive and motivating learning experience.

## 🧠 What is Mentora?

**Mentora** is a revolutionary voice-first, emotion-aware AI assistant that helps students **study smarter, feel better**, and stay on track. It's not just a chatbot — it's a tutor, a wellness coach, a storyteller, and a friend all in one.

The inspiration for Mentora came from recognizing a fundamental gap in modern education technology. While we have countless study apps and tools, most treat learning as a purely cognitive process, ignoring the emotional and psychological aspects that significantly impact how we absorb and retain information.

### 🎯 **Core Problem We Solve:**
- **Emotional overwhelm** during study sessions with no personalized support
- **Lack of adaptive learning** that responds to mood and stress levels
- **Disconnected tools** that separate academic help from mental wellness
- **Accessibility barriers** for neurodivergent learners and those who prefer audio learning

In one voice-driven app, Mentora lets you:
- Learn from AI-generated summaries and quizzes
- Get **emotional support** through adaptive breaks
- Enjoy interactive storytelling and voice conversations
- Speak, scan, or upload your content and start learning
- Let your **mood** and progress shape the experience

---

## 🌟 Core Features (MVP)

### 🧠 **Study & Learning Features:**
| Feature | Description |
|--------|-------------|
| 🎙️ **Voice-to-AI Chat** | Users ask academic questions by speaking, get dynamic spoken answers (Gemini + ElevenLabs) |
| ✍️ **Smart Summaries** | Paste notes or upload a PDF/screenshot to get clean summaries with AI |
| 📚 **Quiz Generator** | Mentora creates flashcards or quizzes based on learning material (auto-difficulty scaling) |
| ✍️ **OCR Reader** | Scan handwritten or printed notes and turn them into study-ready content |
| 🎬 **YouTube Learning** | Extract and summarize key insights from educational videos |

### 💝 **Emotion-Aware Wellness:**
| Feature | Description |
|--------|-------------|
| 🎭 **Real-Time Emotion Detection** | Analyze voice and text to understand current emotional state |
| 🧘 **Mood-Adaptive Break Coach** | Mentora detects your mood and recommends meditations, stretches, or jokes |
| 🎨 **Emotion-Responsive UI** | Interface adapts colors and messaging based on your emotional state |
| 🌅 **Personalized Wellness** | Custom break activities for stress, fatigue, overwhelm, or focus needs |

### 🎙️ **Voice-First Experience:**
| Feature | Description |
|--------|-------------|
| 🗣️ **Natural Conversations** | Speak to Mentora like you would to a human tutor |
| 🎵 **Emotion-Responsive Voice** | AI voice changes tone based on your mood (ElevenLabs integration) |
| 🙌 **Hands-Free Learning** | Perfect for accessibility and audio learners |
| 🔄 **Multi-Modal Input** | Seamlessly switch between voice, text, and visual inputs |

### 📊 **Personalized Learning:**
| Feature | Description |
|--------|-------------|
| 🧠 **Memory Mode** | Remembers what you've learned, what topics you struggled with, and tailors next sessions |
| 📈 **Progress Tracking** | Monitor study sessions, emotional patterns, and achievements |
| 🎯 **Adaptive Recommendations** | AI learns your preferences and suggests optimal study strategies |
| 🗓️ **Smart Reminders** | Suggests when to break, revise, or slow down |

---

## ⚙️ Tech Stack & Architecture

### 🧱 Frontend Architecture
- **React 18** with TypeScript for type-safe, component-based UI
- **Tailwind CSS** for beautiful, responsive design with custom animations
- **Vite** for lightning-fast development and optimized builds
- **React Router** for seamless navigation between study and break modes

### 🔧 Backend Architecture
- **Flask** as lightweight, flexible API framework
- **Python 3.8+** for robust server-side logic and AI integrations
- **Flask-CORS** for secure cross-origin requests
- **Modular Blueprint Architecture** for organized, scalable code

### 🔮 AI & Voice Technologies
- **Google Gemini v1.5 Flash** – Content understanding, Q&A, quiz generation, and summarization
- **ElevenLabs API** – Realistic AI-generated voices with emotional tone switching
- **Tavus API** - Conversational AI video agents
- **Web Speech API** – Browser-based speech-to-text for user voice input
- **Tesseract OCR** – Handwritten and printed text recognition
- **Custom NLP** – Emotion detection using keyword matching and sentiment analysis
- **RevenueCat SDK** - Mentora+ modal integration

### 🗄️ Database & Authentication
- **Firebase Authentication** – Secure user management with Google OAuth
- **Firestore** – Real-time user data, preferences, and study history
- **Local Storage** – Session management and offline capabilities
- **Supabase Storage** - For media storage (media files)

### 🚀 Deployment & Infrastructure
- **Netlify** – Frontend hosting with continuous deployment
- **Render** – Backend API hosting
- **Custom Domain** – Professional domain via Entri integration
- **Environment Variables** – Secure API key management


---

## 🏆 Hackathon Challenge Completions

Mentora is submitted to the **Bolt.new Hackathon** and qualifies for the following prizes:

### 🎯 Challenge Prizes
- ✅ **Voice AI Challenge** — Uses **ElevenLabs** for real-time AI voice interactions with emotion-responsive synthesis
- ✅ **Deploy Challenge** — Deployed on **Netlify** (frontend) and **Render** (backend) with live production environment
- ✅ **Custom Domain Challenge** — Hosted on custom IONOS domain via **Entri** integration
- ✅ **Make More Money Challenge** — Integrates **RevenueCat SDK** for Mentora+ premium subscriptions
- ✅ **Conversational AI Video Challenge** — **Tavus** AI avatar integration for visual storytelling mode

### 💎 Bonus Prize Eligibility
- ⭐ **Creative Use of AI** – First emotion-aware study assistant combining multiple AI services
- ⭐ **Most Beautiful UI** – Glass morphism design with emotion-responsive interface
- ⭐ **Sharpest Problem Fit** – Addresses mental health crisis in education through empathetic AI
- ⭐ **We Didn't Know We Needed This** – Pioneering emotion-learning connection in EdTech
- ⭐ **Future Unicorn** – Scalable platform with clear monetization and growth strategy
- ⭐ **Uniquely Useful Tool** – Serves underserved neurodivergent and accessibility-focused learners

---

## 🚀 How to Run Locally

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Tesseract OCR** (for handwritten notes feature)

### 🔧 Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/ewa-edun/Mentora.git
cd Mentora
```

### Backend Setup (Flask API)

#### 2. **Navigate to backend directory:**
```bash
cd Backed_Flask
```

#### 3. Create a virtual environment (recommended):

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 4. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

#### 5. **Set up environment variables:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
GEMINI_API_KEY=your-gemini-api-key-here
YOUTUBE_API_KEY=your-youtube-api-key-here
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
TAVUS_API_KEY=your-tavus-api-key-here
```

**Get your API Keys:**
1. **Gemini API Key**: Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **ElevenLabs API Key**: Sign up at [ElevenLabs](https://elevenlabs.io/) and get your API key
3. **Tavus API Key**: Go to [Tavus](https://platform.tavus.io/) and get your API Key
4. **Youtube API Key**: Go to google console and get the youtube data v3 api key.

**Install Tesseract OCR (for handwritten notes):**

*macOS:*
```bash
brew install tesseract
```

*Ubuntu/Debian:*
```bash
sudo apt-get update
sudo apt-get install tesseract-ocr
```

*Windows:*
- Download from [GitHub Releases](https://github.com/UB-Mannheim/tesseract/wiki)
- Add Tesseract to your PATH

**Start the Flask backend:**
```bash
python app.py
```

You should see:
```
🚀 Starting Mentora Flask Backend...
📡 API will be available at: http://127.0.0.1:5000
🔗 Health check: http://127.0.0.1:5000/api/health
```

### Frontend Setup (React App)

#### 1. **Open a new terminal and navigate to the frontend folder:**
```bash
cd frontend
```

#### 2. **Install Node.js dependencies:**
```bash
npm install
```

#### 3. **Install additional dependencies:**
```bash
npm install firebase react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

#### 4. **Set up Firebase (Authentication & Database):**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password and Google)
4. Enable Firestore Database
5. Get your Firebase config

#### 5. **Create environment file:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Firebase config
VITE_API_BASE_URL=http://127.0.0.1:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### 6. **Start the React development server:**
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 🎯 Testing Your Setup

#### 1. Test Backend API
Open your browser and visit:
- **Health Check:** http://127.0.0.1:5000/api/health
- **Welcome:** http://127.0.0.1:5000/

You should see JSON responses confirming the API is running.

#### 2. Test Frontend
Open your browser and visit: http://localhost:5173/

You should see the Mentora landing page with glass morphism design.

### 🔧 Troubleshooting

#### Common Issues & Solutions

**❌ "Failed to fetch" errors:**
- Ensure backend is running on http://127.0.0.1:5000
- Check that CORS is enabled in Flask
- Verify your `.env` file has the correct API_BASE_URL

**❌ Gemini API errors:**
- Verify your GEMINI_API_KEY is correct in `backend/.env`
- Check your API quota at [Google AI Studio](https://makersuite.google.com/)
- Ensure you have billing enabled if required

**❌ Firebase authentication issues:**
- Double-check all Firebase config values in `.env`
- Ensure Authentication is enabled in Firebase Console
- Verify your domain is added to authorized domains

**❌ OCR not working:**
- Install Tesseract OCR for your operating system
- On Windows, ensure Tesseract is in your PATH
- Test with: `tesseract --version`

**❌ Voice features not working:**
- Use HTTPS or localhost (required for microphone access)
- Check browser permissions for microphone
- Ensure you're using a supported browser (Chrome, Firefox, Safari)

**❌ ElevenLabs voice synthesis issues:**
- Verify your ELEVENLABS_API_KEY in backend `.env`
- Check your ElevenLabs account credits and usage limits
- Test API connection with provided health check endpoint

#### Port Conflicts

If ports 5000 or 5173 are already in use:

**Backend (Flask):**
```bash
# Run on different port
python app.py --port 5001
```

**Frontend (Vite):**
```bash
# Run on different port
npm run dev -- --port 3000
```

Update your `.env` file accordingly:
```bash
VITE_API_BASE_URL=http://127.0.0.1:5001
```

### 🎉 You're Ready!

Once both servers are running, you can:

1. **📝 Create an account** at http://localhost:5173/signin
2. **🎙️ Test voice features** in the Voice Assistant page
3. **📚 Upload PDFs** and get AI summaries
4. **✍️ Scan handwritten notes** with OCR
5. **🧠 Generate quizzes** from your study materials
6. **💬 Chat with AI** for instant help
7. **🎭 Experience emotion detection** through voice and text analysis
8. **🧘 Get personalized break suggestions** based on your emotional state

---

## 🧪 MVP Demo Scope

The following features are functional in our MVP:

| Feature | Status | Description |
|--------|--------|-------------|
| Text-to-summary (Gemini) | ✅ | AI-powered content summarization |
| Quiz generation (Gemini) | ✅ | Dynamic quiz creation with adaptive difficulty |
| Voice-to-text Q&A (Web Speech API + Gemini) | ✅ | Natural voice conversations with AI tutor |
| Emotion detection from voice/text | ✅ | Real-time mood analysis using custom NLP |
| Adaptive break suggestions | ✅ | Personalized wellness activities based on emotion |
| Text-to-speech replies (ElevenLabs) | ✅ | Emotion-responsive voice synthesis |
| OCR to summary (Tesseract + Gemini) | ✅ | Handwritten note recognition and summarization |
| React-based UI with emotion-responsive design | ✅ | Glass morphism interface that adapts to user mood |
| Firebase user authentication | ✅ | Secure login with Google OAuth |
| YouTube video summarization | ✅ | Extract key insights from educational videos |
| Local storage of session memory | ✅ | Persistent user preferences and study history |

---

## 🛡️ Responsible AI & Ethics

We've taken steps to ensure:

- **Privacy Protection**: Voice data is not stored after analysis; only emotional insights are saved
- **Age-Appropriate Content**: AI-generated stories and quizzes are filtered for educational appropriateness  
- **Bias Mitigation**: Prompt tuning and fairness filters to ensure inclusive, unbiased responses
- **Transparency**: Clear communication about how emotion detection works and what data is collected
- **User Control**: Always provide alternatives to voice input and allow users to opt out of emotion detection
- **Crisis Prevention**: Built-in safeguards to detect severe emotional distress and provide appropriate resources

---

## 👩🏽‍💻 Team Mentora

| Name | Role | Responsibilities |
|------|------|------------------|
| **Ewa** | Full Stack Lead | Flask backend, Firebase integration, database design, AI service orchestration, ElevenLabs + Tavus + Youtube + Whisper implementation, deployment architecture, voice interface logic, and assisted with Frontend |
| **Gurmeet** | Backend Developer | Flask APIs, AI endpoints, emotion detection algorithms, RevenueCat & Entri integration |
| **Naghul** | Frontend Developer | React components, Tailwind CSS styling, responsive design, user experience optimization |
| **Sandesh** | UI/UX Designer | Figma design system, emotion-responsive interface design, visual branding, accessibility considerations, storytelling visuals |

---

## 💭 What's Next for Mentora?

### 🚀 **Immediate Roadmap (Next 3 Months):**

**Complete Hackathon Integrations:**
- **ElevenLabs Voice Enhancement**: Fully implement emotion-responsive voice synthesis with multiple personality voices
- **RevenueCat Premium Launch**: Deploy Mentora+ subscription with advanced AI tutoring and unlimited conversations
- **Tavus Video Integration**: Add AI video avatars for visual storytelling and enhanced user engagement
- **Production Optimization**: Scale infrastructure for increased user load and optimize API performance

**Advanced Emotion Intelligence:**
- **Multi-Modal Detection**: Combine voice tone analysis, text sentiment, and usage patterns for 95%+ emotion accuracy
- **Predictive Wellness**: Machine learning models that predict when students will need emotional support
- **Personalized Wellness Plans**: Create custom daily wellness routines based on individual emotional profiles
- **Crisis Detection**: Implement safeguards to detect severe emotional distress and connect users with resources

### 📈 **Medium-Term Goals (6-12 Months):**

**Educational Institution Partnerships:**
- **University Pilot Programs**: Launch with 5-10 universities as official student support tool
- **K-12 Integration**: Develop age-appropriate versions for middle and high school students
- **Special Education Support**: Enhanced features for students with ADHD, dyslexia, and autism spectrum disorders
- **Teacher Analytics Dashboard**: Provide educators insights into student emotional and academic patterns

**Advanced AI Capabilities:**
- **Personalized Learning Paths**: AI-generated custom curricula based on learning style and emotional patterns
- **Cross-Subject Integration**: Connect learning across different subjects to improve retention and understanding
- **Advanced Content Generation**: Create personalized practice problems, explanations, and study materials
- **Long-Term Memory**: Remember user preferences, struggles, and successes across months and years

### 🌍 **Long-Term Vision (1-3 Years):**

**Global Educational Impact:**
- **International Expansion**: Localize for 20+ countries with culturally adapted wellness practices
- **Research Leadership**: Publish peer-reviewed studies on emotion-learning connections
- **Policy Influence**: Work with education policymakers to integrate emotional wellness into curriculum standards
- **Accessibility Standards**: Become the gold standard for accessible, inclusive educational technology

**Technology Innovation:**
- **AR/VR Learning**: Immersive study environments that adapt to emotional state
- **IoT Integration**: Connect with wearable devices for real-time biometric emotion detection
- **Advanced AI**: Implement GPT-4+ level conversational AI with even more natural interactions
- **Open Source**: Release emotion detection tools for broader educational benefit

---

## 🔗 Links & Resources

🌐 **Live Demo**: [https://mentora.study](https://mentora.study)  
📱 **Mobile App**: Coming soon with React Native  
🎥 **Demo Video**: [Watch on YouTube](https://youtube.com/watch?v=mentora-demo)  
🚀 **Devpost**: [https://devpost.com/software/mentora-7kfy14](https://devpost.com/software/mentora-7kfy14)  
📊 **Presentation**: [View Pitch Deck](https://slides.com/mentora-pitch)  
📝 **Documentation**: [Full Technical Docs](https://docs.mentora.study)  

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Bolt.new Hackathon** for the incredible platform and opportunity
- **Google AI** for Gemini API access and documentation
- **ElevenLabs** for revolutionary voice synthesis technology
- **Firebase** for seamless authentication and database services
- **Our Beta Testers** for invaluable feedback and feature suggestions

---

## 🌟 Star This Repo!

If Mentora helped you learn better or inspired your own AI project, please ⭐ star this repository!

---

*🧠 Built With Passion @ Bolt.new Hackathon 🚀* 
*Ewa • Naghul • Gurmeet • Sandesh*

*"The future of learning is emotional, personal, and voice-first."*