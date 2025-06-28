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

1. PUT DEMO VIDEO LINK ON LANDING PAGE AND YOUTUBE SUMMARIZER
2. Add two files as backup demo data: /demo/avatar-video.mp4 (our demo video)
3. Fix the elevenlabs, tavus and tanscribe audion issue
4. Get Custom Domain via Entri integration.
5. Finish Demo Video and submit.
6. let the emotion wellness charts be scrollable on mobile view just like heatmap. let every chart be scrollable actually. Also let learning streak upgrade, it keeps showing 0.

7. Integerate with RevenueCat for subscription. 



## ✅ Final Smart Add-Ons to Mentora

### 1. 🧠 **Memory & Habit Agent (Recap of Past Sessions)**

> "Mentora, what did I learn this week?"

You'll:

* Use **Firestore** to fetch past sessions
* Use **Bolt + Gemini** to summarize learning history
* Display this in a “Memory Recap” screen or voice reply


#### ✅ **Memory Agent**

* [ ] Create `recapAgent` on Bolt
* [ ] API route `/memory/recap` → fetch Firestore past week data
* [ ] Send to Gemini via Bolt and return:

  > “You reviewed Algebra, answered 6 quizzes, and felt calm 4 times. Good job!”

---
### 2. 🎓 **Study Plan Generator (AI Agent for 5-Day Topic Plans)**

> "Mentora, help me learn Python in 5 days."

You’ll:

* Let user type or speak a topic (e.g., "React", "Neural networks")
* Bolt triggers Gemini with a prompt:
  `"Break this topic into a 5-day personalized learning plan"`
* Return formatted plan (can be cards or daily tasks)

#### ✅ **Study Plan Generator**

* [ ] Add topic input → `/studyplan?topic=React`
* [ ] Bolt + Gemini prompt:
  `"Give me a 5-day study plan for [topic] with 1 main lesson, 1 resource, and 1 quiz prompt per day."`
* [ ] Return as a scrollable card UI

---

### 3. 🏆 **Gamified Achievement Engine (Study Streaks + XP)**

> "🔥 You've completed 3 sessions in a row. You earned a Focus Badge!"

You’ll:

* Track daily study sessions (Firestore log)
* Update `streakCount` or `quizAccuracy`
* Use Bolt to check logic and trigger UI badges or confetti 🎉

#### ✅ **Gamified Engine (optional stretch goal today)**

* [ ] Bolt logic route `/badge-check`
* [ ] On session end, POST `userId + sessionData` → calculate:

  * Consecutive days
  * Accuracy ≥ 80%
* [ ] Return badge earned
* [ ] Trigger confetti or “badge unlocked” pop-up in UI
