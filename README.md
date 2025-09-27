# 🥗 FoodLens — Track, Play, and Stay Healthy (React-only)

**FoodLens** is a gamified nutrition & wellness tracker built as a **React single-page app**.  
It combines **fun animations, local dataset-driven logging, XP gamification, and badges** —
all while working **completely offline** with `localStorage`.

> 🚀 Built for hackathons & demos: no backend required!

---

## ✨ Features

### 🌟 Landing Page

- Full-screen **animated hero** with food & wellness theme.
- Smooth **CSS/SVG animations** (parallax, gradients, floating icons).
- Bold **“Get Healthy!”** call-to-action.

### 🔐 Login & Profile

- **Login modal** (no new page).
- Collects: `username`, `email`, `dailyCalorieTarget`, `password (optional)`.
- Data saved in `localStorage` → `foodLens:user`.
- **Profile menu**: edit info, reset data, or logout.

### 📊 Dashboard

- **Quick Log**: upload photo OR type dish name (works offline).
- **Suggestions modal**: top-3 matches from local dataset (optional AI proxy).
- **Today’s Log**: meals list with time, nutrition, XP earned.
- **XP & Levels**: animated XP bar, levels every 100 XP.
- **Charts**: daily macros pie + weekly calories/XP chart.
- **Badges panel**: milestone XP & streak achievements.

### 🎮 Gamification

- XP = `healthScore ÷ 2` (rounded).
- Levels every 100 XP.
- Streak: +1 day if at least one meal has `healthScore ≥ 60`.
- Badges for XP milestones & 7-day streaks.
- Fun **micro-animations** (+XP popups, smooth progress bar).

### 📂 Local Dataset

- `foods.json` with 50–80 common Indian & fast-food dishes.
- Users can add **custom dishes** (saved locally).
- Offline-first design ensures demo works without internet.

### ⚡ Optional AI Vision

- Hook to `/api/detect-food` (proxy server) for AI suggestions.
- Predictions shown alongside local dataset matches.
- Always falls back to typed input if offline.

---

## 🛠 Tech Stack

- ⚛️ **React + Vite** (SPA, no backend).
- 🎨 **CSS & SVG animations** (lightweight, polished).
- 📦 `localStorage` for persistence.
- 📊 Lightweight chart lib / canvas for macros & weekly trends.
- 🧩 Modular React components:
  - `Landing.jsx`, `LoginModal.jsx`, `Dashboard.jsx`,  
    `UploadInput.jsx`, `SuggestionsModal.jsx`, `XPBar.jsx`,  
    `Charts.jsx`, `ProfileMenu.jsx`, `LogList.jsx`.

---

## 📂 LocalStorage Schema

```json
foodLens:user
{
  "username": "Alice",
  "email": "alice@example.com",
  "dailyCalories": 2200,
  "totalXP": 0,
  "currentLevel": 1,
  "badges": [],
  "streak": 0,
  "lastHealthyDate": null
}

foodLens:logs
[
  {
    "id": "uuid",
    "dish": "Samosa",
    "calories": 260,
    "protein": 4,
    "fat": 15,
    "carbs": 30,
    "healthScore": 20,
    "xp": 10,
    "timestamp": "2025-09-27T12:00:00.000Z"
  }
]

foodLens:datasetVersion
1
```

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run the app

```bash
npm run dev
```

App runs at **`http://localhost:5173`** (default Vite port).

### 3️⃣ Optional: AI Vision Proxy

For AI-powered food detection from images:

```bash
cd proxy
npm install
npm start
```

Proxy runs at **`http://localhost:3001`** (optional).

---

## 🎮 Demo Script (Hackathon-ready)

📖 **Full demo guide**: See [`demo.md`](demo.md) for detailed presentation script.

### Quick Demo Flow (5 minutes)

1. **Landing**: Show animated hero page → click "Get Healthy!"
2. **Login**: Fill username, email, daily calories → submit
3. **Dashboard**: Show XP bar, empty logs, charts
4. **Text Input**: Type "Samosa" → select from suggestions → watch XP increase
5. **Image Upload**: Upload food photo → AI suggestions (if proxy running) → log
6. **Gamification**: Show XP bar, badges, streak counter
7. **Profile**: Edit settings, view stats, reset data options
8. **Charts**: Show macros pie chart, weekly overview, daily progress

### Key Features to Highlight

- ✨ **Smooth animations** and micro-interactions
- 🎮 **Gamification** (XP, levels, badges, streaks)
- 📱 **Responsive design** (try resizing browser)
- 🔄 **Offline-first** (works without internet)
- 🤖 **AI integration** (optional image detection)
- 💾 **localStorage persistence** (data survives page reload)

---

## 📦 Project Structure

```
src/
 ├── assets/         # icons, animations, images
 ├── components/     # modular UI (Landing, LoginModal, XPBar, Charts...)
 ├── data/foods.json # local nutrition dataset
 ├── storage.js      # localStorage helpers
 ├── App.jsx         # SPA router / view switching
 └── main.jsx        # React entry
```

---

## 🔧 Optional AI Vision Proxy

- Not required for core app.
- If enabled: create `/proxy` folder with a small Express server.
- Exposes `/api/detect-food` → forwards to AI Vision API (OpenAI/Gemini).
- Configure `PROXY_URL` in `.env`.

📖 See [`proxy/README.md`](proxy/README.md) for setup.

---

## 🏅 Badges & Levels

- **XP milestones**: 50, 200, 500.
- **Streak badge**: 7-day streak of healthy meals.
- **Level formula**: `floor(totalXP / 100) + 1`.

🎉 Micro-animations highlight new XP, badges, and streaks!

---

## 📖 Notes

- App works **fully offline** using `foods.json` and `localStorage`.
- Clear/reset localStorage anytime for fresh demo.
- Edit `foods.json` to expand dataset.

---

## ❤️ Credits

Built with 🍎 **React + Vite**  
Designed for health, wellness, and **fun gamification** ✨
