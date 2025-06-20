# 🎙️ Mentora – The Emotion-Aware, Voice-First AI Study & Wellness Assistant

> Built for the Bolt.new Hackathon  
> Team Members: Ewa, Naghul, Gurmeet, Sandesh
> Tech Stack: React, Flask, Firebase, Gemini, Whisper, ElevenLabs, Emotion Recognition API

> **“Learn smarter, not harder.”**  
Mentora is a voice-first AI study coach that adapts to your learning style, emotional state, and study goals. It speaks like a tutor, listens like a friend, and remembers like a mentor.
Built for students, neurodivergent learners, and self-learners who crave an intuitive and motivating learning experience.



## 🧠 What is Mentora?

**Mentora** is a voice-first, emotion-aware AI assistant that helps students **study smarter, feel better**, and stay on track. It’s not just a chatbot — it’s a tutor, a wellness coach, a storyteller, and a friend.

In one voice-driven app, Mentora lets you:
- Learn from AI-generated summaries and quizzes
- Get **emotional support** through adaptive breaks
- Enjoy interactive storytelling and voice conversations
- Speak, scan, or upload your content and start learning
- Let your **mood** and progress shape the experience

---

## 🔥 Why Mentora?

Modern study tools are often:
- Text-heavy, generic, and impersonal
- Don’t care how you're *feeling*
- Hard to navigate without screens

We built **Mentora** to fix that.  
It's built to **listen**, **understand**, and **adapt** — all through **natural voice** and **emotion-aware interaction**.

---

## 🌟 Core Features (MVP)

| Feature | Description |
|--------|-------------|
| 🎙️ **Voice-to-AI Chat** | Users ask academic questions by speaking, get dynamic spoken answers (Gemini + ElevenLabs) |
| ✍️ **Smart Summaries** | Paste notes or upload a PDF/screenshot to get clean summaries with AI |
| 📚 **Quiz Generator** | Mentora creates flashcards or quizzes based on learning material (auto-difficulty scaling) |
| ✍️ **OCR Reader**  | Scan handwritten or printed notes and turn them into study-ready content  |
| 🧑‍🏫 **Storytelling Mode** | Engaging mode for kids or casual learners: AI generates stories using your study topic |
| 🎭 **Mood-Adaptive Break Coach** | Mentora detects your mood (via voice cues) and recommends meditations, stretches, or jokes |
| 🧠 **Memory Mode** | Remembers what you’ve learned, what topics you struggled with, and tailors next sessions |
| 💬 **Emotion-Sensitive Voice** | Uses ElevenLabs voices that change tone based on learner state (e.g., calm vs. excited) |
| 🗓️ **Smart Reminders** | Suggests when to break, revise, or slow down  |
| 🪪 **Custom Domain** | Published with IONOS domain via Entri |
| 💰 **Mentora+ Monetization** | Premium plan via RevenueCat Paywall Builder offering bonus tools & voice packs |
| 🌐 **Deployed App** | Netlify for frontend, Render backend, with Firebase integration |

---


## ⚙️ Tech Stack

### 🔮 AI & Voice
- **Google Gemini v1.0** – Content understanding, Q&A, quiz generation
- **ElevenLabs API** – Realistic AI-generated voices with emotional tone switching
- **Whisper (OpenAI)** – Speech-to-text for user voice input
- **Tavus (optional)** – Video avatar for visual storytelling

### 🧱 Architecture
- **Frontend**: React + Tailwind CSS, deployed on Netlify
- **Backend**: Flask, deployed on Render
- **DataBase**: Firebase Firestore (user progress & summaries)
- **Storage**: Supabase Buckets (for file/audio uploads)
- **Auth**: Firebase Authentication
- **Mobile Paywall**: RevenueCat SDK + Paywall Builder
- **Domain Hosting**: Entri + IONOS
- **Build Tool**: Bolt.new

---

## 🧪 MVP Demo Scope

The following features are functional in our MVP:

| Feature | Status |
|--------|--------|
| Text-to-summary (Gemini) ✅ | ✅ |
| Quiz generation (Gemini) | ✅ |
| Voice-to-text Q&A (Whisper + Gemini) | ✅ |
| Emotion detection from voice | ✅ |
| Adaptive break suggestions (based on emotion) | ✅ |
| Text-to-speech replies (ElevenLabs) | ✅ |
| OCR to summary (Tesseract + Gemini) | ✅ |
| React-based UI with mode switching | ✅ |
| Firebase user authentication | ✅ |
| Local storage of session memory | ✅ |

---

## 🏆 Hackathon Eligibility Highlights

Mentora is submitted to the **Bolt.new Hackathon** and qualifies for the following prizes:

### 🎯 Challenge Prizes
- ✅ **Voice AI Challenge** — Uses **ElevenLabs** for real-time AI voice interactions
- ✅ **Deploy Challenge** — Deployed on **Netlify** (frontend) and **Render** (backend)
- ✅ **Custom Domain Challenge** — Hosted on custom IONOS domain via **Entri**
- ✅ **Make More Money Challenge** — Integrates **RevenueCat SDK** for subscriptions
- ✅ **Conversational AI Video Challenge** — Optional **Tavus** AI avatar in storytelling mode

### 💎 Bonus Prize Eligibility
- ⭐ Creative Use of AI
- ⭐ Most Beautiful UI
- ⭐ Sharpest Problem Fit
- ⭐ We Didn’t Know We Needed This
- ⭐ Future Unicorn
- ⭐ Uniquely Useful Tool
- ⭐ Top Build-in-Public Journey

---
### Make Mentora More Valuable Competitive
1. Leverage RevenueCat for Monetization & Make More Money Challenge
  - Integrate RevenueCat mobile SDK + Paywall Builder directly into Mentora.
  - Offer tiered subscription plans:
  - Free tier: Basic tutoring + limited wellness breaks.
  - Premium tier: Full voice cloning, personalized coaching, unlimited quizzes, and teacher-parent companion mode.
  - Use RevenueCat analytics to track subscriber behavior and optimize your paywall experience.

2. Use Entri for a Custom Domain
  - Deploy your Bolt app and claim a custom domain (e.g., mentora.study or mentora.app) via Entri.
  - Custom domains increase professionalism and user trust, important for education/wellness apps.

3. Add Voice AI with ElevenLabs
  - Enhance Mentora’s voice interactivity by fully implementing ElevenLabs’ voice cloning and TTS capabilities.
  - Allow users to choose or clone a voice for personalized tutoring or bedtime stories.
  - Make the AI tutor feel more human-like, increasing engagement.

4. Add Conversational AI Video with Tavus
  - Integrate Tavus AI-generated video agents to:
  - Give personalized study tips via video
  - Record motivational messages or wellness check-ins
  - This can be a unique feature that merges video + voice AI, setting you apart.

5. Deploy via Netlify and Join the Deploy Challenge
  - Host your React frontend on Netlify with continuous deployment.
  - Use Netlify’s built-in analytics to monitor traffic and optimize UX.
  - Combine this with Bolt’s backend and deploy your full stack app seamlessly.

6. Explore Blockchain for Future-Proof Features (Algorand Challenge),
  - Use Algorand’s blockchain to:
  - Issue verifiable certificates for course completion.
  - Store immutable user progress or mood data privately and securely.

 RevenueCat: For managing subscriptions and payments smoothly.
 ElevenLabs: For natural, expressive voice interaction.
 Tavus: For AI video agents enhancing user connection.
 Algorand/IPFS: For secure, decentralized data or payments.
 Pica & Dappier: Use Pica to rapidly prototype UI and Dappier to add AI copilot features like semantic search or smart help inside your app.
 River: Build a community platform for Mentora users to share tips and host study groups/events.
 Sentry: Monitor errors and optimize performance during and after the hackathon.

---

## 🛡️ Responsible AI

We’ve taken steps to ensure:

- Age-appropriate story and quiz generation
- Voice data is not stored after analysis
- Bias mitigation via prompt tuning and fairness filters

---

## 💭 What's Next?

📈 Personalized learning paths based on long-term performance
🧑‍🏫 Teacher and classroom integration
🧒 Fully gamified storytelling assistant for kids
📱 Publish as a mobile app using React Native
🔥 Mentora+ : 
      - More voice types
      - Custom memory folder names
      - Emo-aware journaling
      - Soundscapes / focus music integration
      - Add a button that says “Upgrade to Mentora+” that opens a dummy modal using RevenueCat.

---

## 👩🏽‍💻 Team Mentora

| Name | Role | Responsibilities |
|------|------|------------------|
| **Ewa** | Full Stack Dev | Flask, Firebase, AI integration, ElevenLabs + Whisper integration, deployment |
| **Gurmeet** | Backend Dev | Flask APIs, AI endpoints, RevenueCat & Entri integration |
| **Naghul** | Frontend Dev | React, Tailwind css styling, Component logic |
| **Sandesh** | UI/UX & Design | Figma, UI design system, storytelling visuals, branding |

---

## 📸 Screenshots / Demo

_Add Figma previews, screenshots, or demo links here._

---

## ✨ Devpost Submission

> 🔗 LINK TO DEVPOST PROJECT PAGE
https://devpost.com/software/mentora-7kfy14

---

## 🧪 Try It Out

🌐 **Live App**: [https://mentora.ai](https://mentora.ai)  
📱 **Mobile (Mentora+)**: Coming soon (RevenueCat SDK)  
🧪 **Demo Video**: _[TBD]_  
---

🧠 Built With Passion @ Bolt.new Hackathon 🚀
