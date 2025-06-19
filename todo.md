## Installs:
npm install
npm install firebase
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
npm install axios form-data
pip install google-generativeai
npm install dotenv

## 🔄 Overall Timeline
| Week       | Focus                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------- |
| **Week 1** | Core UI design, backend setup, Gemini/Whisper/TTS base integrations                          |
| **Week 2** | Emotional intelligence logic, voice interactivity, session memory, visual mood & Mentora+ UI |
| **Week 3** | Polish emotional UX, Mentora+ polish, storytelling, final demo, deploy & submit              |

---

## 🗓️ Week-by-Week Breakdown

### ✅ **Week 2: Emotional Logic + Interactivity (Days 8–14)**

**Ewa**

* [ ] Finalize Gemini integration: summary, quiz, Q\&A
* [ ] Integrate ElevenLabs for voice replies
* [ ] Add session memory summary (daily recap API + frontend)
* [ ] Start basic mood-based response branching (happy/sad/confused)
* [ ] Add memory-reflection: “What did I learn today?” button
* [ ] Connect frontend to `/ask`, `/tts`, `/summarize`, `/generate-quiz`

**Gurmeet**

* [ ] Emotion classification logic (keywords + tone simulation)
* [ ] Break recommendation logic based on emotion state
* [ ] Log mood + session summaries to Firestore
* [ ] Dummy “Mentora+” auth flow — identify free vs premium

**Naghul**

* [ ] Mic capture → Whisper → backend round trip
* [ ] Mood orb component (visual feedback: calm, anxious, happy)
* [ ] Add “Mentora+” modal with locked features (voice pack, memory, ambient sounds)
* [ ] Add button for “What did I learn today?” (fetch daily summary)

**Sandesh**

* [ ] Break mode UI with mood options or “auto-detect” toggle
* [ ] Visualize emotion states via color-coded mood ring/orb
* [ ] Mentora+ screen design — hint at upsell via blurred features
* [ ] Affirmation designs (text + visual style suggestions)
* [ ] Add audio/visual mascot concept for “coach feel”

---

### ✅ **Week 3: Polish, Storytelling, Submission (Days 15–21)**

**Ewa**

* [ ] Finalize emotional branching logic and QA
* [ ] Fine-tune Gemini prompts for tone + friendliness
* [ ] Polish demo scripts (emotion recognition, Mentora+, memory recall)
* [ ] Record demo screen + voice + “coaching moment” sequence

**Gurmeet**

* [ ] Clean up Flask code, modularize helpers
* [ ] Add retry logic + rate limit guards
* [ ] Compress audio for better TTS loop latency
* [ ] Save per-session metadata for future reflection

**Naghul**

* [ ] Polish responsive layout + UX polish
* [ ] Improve loading spinners, typing indicators, and TTS playback
* [ ] Add “session recap” screen or section (if time allows)
* [ ] Integrate story-mode if ready (e.g. interactive visual coaching scene)

**Sandesh**

* [ ] Final Devpost visuals: logo, banners, illustrations
* [ ] Storytelling animations (GIFs or SVGs if possible)
* [ ] Devpost pitch text + story
* [ ] Prepare final 1-min + 3-min pitch scripts for Ewa
* [ ] Add Mentora origin story to landing page

---

## 🏁 Final Deliverables Checklist (Updated)

| Deliverable                      | Owner            | Status |
| -------------------------------- | ---------------- | ------ |
| MVP Web App (Study + Break Mode) | Everyone         | ⬜      |
| Voice & Mood Logic               | Ewa + Gurmeet    | ⬜      |
| Daily Memory + Recap Button      | Ewa + Naghul     | ⬜      |
| Mentora+ Locked UI               | Naghul + Sandesh | ⬜      |
| Demo Video 🎥                   | Ewa + Sandesh    | ⬜      |
| GitHub Repo                      | Gurmeet          | ⬜      |
| Devpost Description & Deployment | Ewa              | ⬜      |
| Screenshots + Visuals            | Sandesh          | ⬜      |
| Submission Testing 🔁           | Naghul           | ⬜      |


Start building your app on or after May 30 for it to be considered NEW. Your app can be built completely with Bolt.new or significantly started or built on Bolt.new. Just be sure the publicly deployed version includes a badge that highlights that it is built with Bolt.new ([see guidance here](https://worldslargesthackathon.devpost.com/details/badgeguidelines)).

What to Submit
Include a video (about 3 minutes) that demonstrates your submission. Videos must be uploaded to YouTube, Vimeo, or Facebook Video and made public.
Provide a URL to a publicly available version of the project that is fully functional as described for review and judging. 
Confirm usage of Bolt.new to build the project and show the ‘Built with Bolt.new’ badge on your public project.
Provide the email used to build the project on Bolt.new. This email must be associated with the usage of Bolt.new to built the submitted project.

🎯 Core Features Still Missing
1. Backend API Development
Flask/FastAPI server with endpoints for:
PDF text extraction and summarization
Voice-to-text processing (Whisper integration)
Text-to-speech generation (ElevenLabs)
Emotion detection from voice
Quiz generation from content
OCR for handwritten notes

2. AI Service Integrations
Google Gemini API integration for:
Content summarization
Quiz generation
Q&A responses
ElevenLabs API for voice synthesis
OpenAI Whisper for speech-to-text
Emotion detection API integration

5. State Management
User session management
Study progress tracking
Voice recording state
Real-time data updates

6. Voice Features
Microphone access and recording
Real-time voice processing
Voice command recognition
Audio playback controls

🎨 UI/UX Enhancements
7. Interactive Features
Drag & drop file uploads
Progress indicators
Loading states
Error handling
Responsive design improvements

8. Dashboard Functionality
Study statistics
Progress charts
Session history
Achievement system


💰 Monetization Features
11. RevenueCat Integration
Subscription management
Paywall implementation
Premium feature gating
Payment processing

12. Premium Features
Advanced voice personalities
Unlimited AI conversations
Custom study plans
Priority support

📱 Additional Features
13. Mobile Optimization
Touch-friendly interfaces
Mobile voice recording
Offline capabilities
Push notifications

14. Analytics & Monitoring
User behavior tracking
Performance monitoring
A/B testing setup
Usage analytics

🎯 Recommended Next Steps Priority:
Start with backend API - This is your foundation
Implement core components - PDF upload, voice recording
Connect AI services - Gemini, ElevenLabs, Whisper
Complete Firebase integration - Auth and data persistence
Build remaining UI components - Study and break modes
Add voice features - Recording and playback
Deploy and test - Get it live for testing
Add premium features - RevenueCat integration