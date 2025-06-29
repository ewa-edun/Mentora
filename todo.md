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

1. Finish Demo Video and submit.
2. PUT DEMO VIDEO LINK ON LANDING PAGE AND YOUTUBE SUMMARIZER



0:00 – 0:15 🔥 Hook: What is Mentora? Who’s it for? Why does it matter?  
0:15 – 0:45🧠 The Problem: What’s broken in studying / learning today?  
0:45 – 1:30💡 The Solution: Show Mentora’s **magic** step-by-step
1:30 – 2:30 🎉 Features: Summarize, Quiz, Emotion Detection, Voice Q\&A, Study Plan, Mentora+ 
2:30 – 3:00🚀 Tech Stack + Final Pitch + Link to Try It 

🎬 INTRO (0:00–0:15)
“Meet Mentora — your AI-powered, voice-first study coach that actually listens.
Built for students who need focus, feedback, and emotional support — not just a chatbot.”

🧠 THE PROBLEM (0:15–0:45)
“Today’s study tools are static, overwhelming, and impersonal.
Students struggle to stay consistent, track progress, or feel supported when learning solo.
And while AI exists, most tutors don’t adapt to your mood, energy, or learning style.”

💡 THE SOLUTION (0:45–1:30)
“Mentora fixes that.
With just your voice or a quick paste of your notes, it summarizes any content, generates smart quizzes, and even lets you talk to it like a real tutor.
But what makes Mentora unique?
It senses how you're feeling — and adapts.
Feeling stressed? It offers breathing breaks. Focused? It pushes harder.
It’s like having a real mentor, not just a machine.”

🚀 LIVE DEMO / SCREEN WALKTHROUGH (1:30–2:30)
Show this in order:

- Summarize from text/PDF
- Generate a quiz + answer one
- Ask a voice question → Whisper → Gemini → ElevenLabs voice reply
- Mood detection → Suggest a break
- Story telling mode
- Dashboard and Personalized Study Plan

Narrate like:

“Here, I upload a study PDF. In seconds, Mentora summarizes it.”
“Now I tap ‘Generate Quiz’ — watch how it adapts the difficulty.”
“And now I’ll ask a question out loud — Mentora transcribes it and replies with a natural voice.”
“Feeling stressed? It suggests a calming exercise.”

💻 TECH + CLOSING (2:30–3:00)
“Mentora was built using React, Flask, Firebase, Bolt, Whisper, ElevenLabs, and Gemini.
We’re proud to use emotion-aware AI to help students stay consistent, confident, and in control.
Try it now at mentoracompanion.netlify.app
Thanks for watching — and meet your new AI study coach.”

🛠️ Tools to Use
Tool	Use
🖥️ Screen Recorder	Loom, OBS, or CleanShot
✂️ Editor	iMovie, CapCut, Canva, Davinci Resolve
🎙️ Voiceover (optional)	Your voice or clear captions (no AI needed unless you want)
🎨 Overlay	Project logo, “Demo 1: Summarize” banners, captions