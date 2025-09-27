# FoodLens Demo Script

This script will help you demonstrate all the key features of FoodLens during a presentation or demo.

## Pre-Demo Setup

1. **Start the main app:**

   ```bash
   npm run dev
   ```

   App will be available at `http://localhost:5173`

2. **Optional - Start AI proxy (for image detection):**
   ```bash
   cd proxy
   npm install
   npm start
   ```
   Proxy will be available at `http://localhost:3001`

## Demo Flow (5-7 minutes)

### 1. Landing Page (30 seconds)

- **Show**: Animated full-screen landing page
- **Highlight**:
  - Smooth animations and gradients
  - "Get Healthy!" call-to-action
  - Food-themed floating icons
- **Say**: "FoodLens is a gamified nutrition tracker that makes healthy eating fun!"

### 2. User Onboarding (1 minute)

- **Click**: "Get Healthy!" button
- **Show**: Login modal opens
- **Fill out**:
  - Username: "Demo User"
  - Email: "demo@foodlens.com" (optional)
  - Daily Calories: 2200 (default)
- **Click**: "Get Started! 🚀"
- **Highlight**: Data is saved to localStorage (no backend needed)

### 3. Dashboard Overview (1 minute)

- **Show**: Dashboard loads with user info
- **Highlight**:
  - Header with user avatar and profile menu
  - XP bar showing Level 1, 0 XP
  - Quick Log section
  - Today's Meals (empty)
  - Charts section (empty data)

### 4. Food Logging - Text Input (1.5 minutes)

- **Type**: "Samosa" in the input field
- **Show**: Suggestions modal appears with top 3 matches
- **Highlight**:
  - Local database search
  - Nutrition information display
  - Health score with color coding
- **Click**: Select "Samosa" from suggestions
- **Show**:
  - Food is logged to today's meals
  - XP increases (+10 XP)
  - XP bar animates
  - Charts update with nutrition data

### 5. Food Logging - Image Upload (1.5 minutes)

- **Click**: Upload area
- **Upload**: Any food photo (salad, sandwich, etc.)
- **Show**:
  - Loading animation
  - AI suggestions appear (if proxy running)
  - AI suggestions are clearly marked with "AI" badge
- **Select**: One of the AI suggestions
- **Show**:
  - Food logged with AI-detected name
  - XP and charts update
  - Streak may increase if health score ≥ 60

### 6. Gamification Features (1 minute)

- **Show**:
  - XP bar with current progress
  - Level progression (every 100 XP)
  - Badges earned (if any)
  - Streak counter (if applicable)
- **Click**: Profile menu (top-right)
- **Show**:
  - User stats and badges
  - Edit profile options
  - Reset data options

### 7. Charts and Analytics (1 minute)

- **Show**:
  - Today's macros pie chart
  - 7-day overview bar chart
  - Daily calorie target progress
- **Highlight**:
  - Visual representation of nutrition
  - Progress tracking
  - Goal achievement

### 8. Profile Management (30 seconds)

- **Click**: Profile menu
- **Show**:
  - Edit profile information
  - View earned badges
  - Reset data options
- **Demo**: Change daily calorie target
- **Show**: Changes persist after page reload

## Key Talking Points

### Technical Highlights

- **Pure React SPA**: No backend required
- **localStorage**: All data persisted locally
- **Offline-first**: Works without internet
- **AI Integration**: Optional image detection
- **Responsive Design**: Works on all devices

### User Experience

- **Gamification**: XP, levels, badges, streaks
- **Visual Feedback**: Animations, progress bars, color coding
- **Easy Logging**: Text input + image upload
- **Smart Suggestions**: Local database + AI detection
- **Progress Tracking**: Charts and statistics

### Demo Tips

- **Keep it fast**: Don't spend too much time on any one feature
- **Show animations**: Let XP bars and transitions complete
- **Explain the "why"**: Why gamification works for health apps
- **Highlight offline capability**: Turn off internet to show it still works
- **Show responsiveness**: Resize browser window

## Troubleshooting

**If AI proxy isn't working:**

- Show fallback suggestions
- Explain that the app works fully offline
- Mention that AI is an optional enhancement

**If localStorage is empty:**

- Clear browser data and start fresh
- Or use the reset data option in profile

**If animations seem slow:**

- Check browser performance
- Mention that animations can be disabled for accessibility

## Post-Demo Q&A

### Common Questions

- **"How does it work offline?"** - All data stored in localStorage
- **"Can I add my own foods?"** - Yes, custom entries are supported
- **"Is the AI accurate?"** - It's a demo with fallbacks, production would need better training
- **"How do you calculate health scores?"** - Based on nutrition density and balance
- **"Can I export my data?"** - Not in this demo, but would be easy to add

### Technical Questions

- **"What's the tech stack?"** - React + Vite + localStorage + optional AI proxy
- **"How do you handle state?"** - React hooks + localStorage persistence
- **"Is it scalable?"** - For demo purposes, production would need a backend
- **"How do you ensure data privacy?"** - All data stays in user's browser

---

**Remember**: This is a demo app designed to showcase concepts. In production, you'd want proper backend, user authentication, data export, and more robust AI integration.
