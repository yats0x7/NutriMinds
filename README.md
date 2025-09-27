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

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/foodlens.git
cd foodlens
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run locally
```bash
npm run dev
```

App runs at **`http://localhost:5173`** (default Vite port).

---

## 🎮 Demo Script (Hackathon-ready)

1. Open app → show animated landing page.  
2. Click **Get Healthy!** → login modal → fill info.  
3. Dashboard loads with user info (XP = 0).  
4. Type `Samosa` → select → log → XP +10 → animated progress bar.  
5. Upload a **salad photo** (if AI proxy enabled) → accept suggestion → log.  
6. Show streak increment or badge unlock.  
7. Open **Profile menu** → change daily calories → reload page → persistence shown.  
8. Show **Reset Data** action → confirm → logs cleared, XP reset.  

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

## 📖 Documentation

### 🔧 Setup Guide
1. Install Node.js (>= 18).
2. Clone repository and install dependencies with `npm install`.
3. Run dev server using `npm run dev`.
4. Access app locally at `http://localhost:5173`.
5. To reset demo: clear `localStorage` keys `foodLens:user`, `foodLens:logs`, `foodLens:datasetVersion`.

### 🏗 Architecture
- **Landing Page** → animated hero screen with CTA.
- **Login Modal** → collects user info and saves to `localStorage`.
- **Dashboard** → core UI with logging, XP, charts, and badges.
- **Profile Menu** → manage user data, reset, or logout.
- **Storage Layer** → wrapper functions in `storage.js` for persistence.
- **Dataset** → `foods.json` is the primary nutrition data source.

### 🛠 Tools Used
- **React + Vite** for fast SPA development.
- **Tailwind CSS / custom CSS** for modern styling.
- **Recharts or Canvas API** for lightweight charts.
- **LocalStorage API** for persistence.
- **Optional Node/Express proxy** for AI/ML integration.

### 🤖 AI/ML Approach
- **Offline-first:** The app uses a curated `foods.json` for 50–80 dishes.
- **Typed Input Matching:** Local fuzzy search finds closest dishes.
- **Optional Vision AI:** If enabled, a proxy server calls a model (OpenAI/Gemini) to detect dishes from images. Predictions merged into suggestions modal.
- **Fallback Logic:** If AI confidence is low or offline, fallback to typed dataset suggestions.
- **Gamification Metrics:** XP derived from `healthScore` (0–100) via formula `XP = healthScore ÷ 2`.

---

## ❤️ Credits & Authors

Built with 🍎 **React + Vite**  
Designed for health, wellness, and **fun gamification** ✨

### 👩‍💻 Authors
- **Author 1:** Tarunya Ksh
- **Author 2:** [Add Name]
- **Author 3:** [Add Name]
- **Author 4:** [Add Name]

