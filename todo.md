## 🔄 Overall Timeline
| Week       | Focus                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------- |
| **Week 1** | Core UI design, backend setup, Gemini/Whisper/TTS base integrations                          |
| **Week 2** | Emotional intelligence logic, voice interactivity, session memory, visual mood & Mentora+ UI |
| **Week 3** | Polish emotional UX, Mentora+ polish, storytelling, final demo, deploy & submit              |

---

## 🗓️ Week-by-Week Breakdown

### ✅ **Week 1: Foundation Setup (Days 1–7)**


## 🗓️ Week-by-Week Breakdown

### ✅ **Week 1: Foundation Setup (Days 1–7)**

**Ewa (Full Stack + AI Integration)**

* [x] Set up Firebase Auth + Firestore
* [x] Set up Flask backend (routes for: summary, quiz, TTS, emotion)
* [x] Integrate Whisper API for voice input → text
* [x] Draft base prompt templates for Gemini (summary, quiz, Q\&A)
* [x] Plan Mentora+ feature ideas + upsell mockup

**Gurmeet (Backend Dev)**

* [x] Build and test Flask endpoints:

  * `/summarize`
  * `/generate-quiz`
  * `/ask`
  * `/detect-emotion`
  * `/tts`
* [x] Connect Gemini + Whisper
* [x] Modular structure for agents
* [x] Add CORS & secure API key handling

**Naghul (Frontend Dev)**

* [x] Scaffold React frontend with Tailwind CSS
* [x] Build basic layout: Navigation, Home, Study Mode, Break Mode
* [x] Mode toggle component (Study ↔ Break)
* [x] UI for quiz and summary forms
* [x] Implement form inputs for summary and quiz sections
* [x] Create mode toggle component (Study ↔️ Break)

**Sandesh (UI/UX + Design)**

* [x] Figma mockups for Study/Break modes
* [x] Initial mood color palette + theme
* [x] Character sketch/storytelling visuals start
* [x] Base voice avatar selector wireframe

---

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
