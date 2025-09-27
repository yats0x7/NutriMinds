// Storage utility functions for FoodLens
import foodsData from "./data/foods.json";

const STORAGE_KEYS = {
  USER: "foodLens:user",
  LOGS: "foodLens:logs",
  DATASET_VERSION: "foodLens:datasetVersion",
};

// Initialize default user data
const defaultUser = {
  username: "",
  email: "",
  dailyCalories: 2200,
  activityLevel: null,
  age: null,
  weight: null,
  weightUnit: "kg",
  height: null,
  heightUnit: "cm",
  feet: null,
  inches: null,
  bmi: null,
  bmiCategory: null,
  totalXP: 0,
  currentLevel: 1,
  badges: [],
  streak: 0,
  lastHealthyDate: null,
};

// Initialize default logs
const defaultLogs = [];

// User management
export const getUser = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : defaultUser;
  } catch (error) {
    console.error("Error getting user data:", error);
    return defaultUser;
  }
};

export const saveUser = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error("Error saving user data:", error);
    return false;
  }
};

export const updateUser = (updates) => {
  const currentUser = getUser();
  const updatedUser = { ...currentUser, ...updates };
  return saveUser(updatedUser);
};

// Logs management
export const getLogs = () => {
  try {
    const logsData = localStorage.getItem(STORAGE_KEYS.LOGS);
    return logsData ? JSON.parse(logsData) : defaultLogs;
  } catch (error) {
    console.error("Error getting logs data:", error);
    return defaultLogs;
  }
};

export const saveLogs = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    return true;
  } catch (error) {
    console.error("Error saving logs data:", error);
    return false;
  }
};

export const addLog = (logEntry) => {
  const logs = getLogs();
  const newLog = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...logEntry,
  };
  const updatedLogs = [...logs, newLog];
  saveLogs(updatedLogs);
  return newLog;
};

export const deleteLog = (logId) => {
  const logs = getLogs();
  const updatedLogs = logs.filter((log) => log.id !== logId);
  saveLogs(updatedLogs);
  return updatedLogs;
};

export const updateLog = (logId, updates) => {
  const logs = getLogs();
  const updatedLogs = logs.map((log) =>
    log.id === logId ? { ...log, ...updates } : log
  );
  saveLogs(updatedLogs);
  return updatedLogs;
};

// Get today's logs
export const getTodaysLogs = () => {
  const logs = getLogs();
  const today = new Date().toDateString();
  return logs.filter((log) => new Date(log.timestamp).toDateString() === today);
};

// Get logs for a specific date range
export const getLogsInRange = (startDate, endDate) => {
  const logs = getLogs();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return logs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return logDate >= start && logDate <= end;
  });
};

// Dataset management
export const getDatasetVersion = () => {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEYS.DATASET_VERSION) || "1");
  } catch (error) {
    console.error("Error getting dataset version:", error);
    return 1;
  }
};

export const setDatasetVersion = (version) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DATASET_VERSION, version.toString());
    return true;
  } catch (error) {
    console.error("Error setting dataset version:", error);
    return false;
  }
};

// Food search and matching
export const searchFoods = (query) => {
  if (!query || query.trim() === "") return [];

  const searchTerm = query.toLowerCase().trim();
  return foodsData
    .filter((food) => food.dish.toLowerCase().includes(searchTerm))
    .sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.dish.toLowerCase() === searchTerm;
      const bExact = b.dish.toLowerCase() === searchTerm;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Then prioritize starts with
      const aStarts = a.dish.toLowerCase().startsWith(searchTerm);
      const bStarts = b.dish.toLowerCase().startsWith(searchTerm);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });
};

export const getFoodByName = (dishName) => {
  return foodsData.find(
    (food) => food.dish.toLowerCase() === dishName.toLowerCase()
  );
};

// Gamification functions
export const calculateXP = (healthScore) => {
  return Math.round(healthScore / 2);
};

export const calculateLevel = (totalXP) => {
  return Math.floor(totalXP / 100) + 1;
};

export const checkForNewBadges = (user, newXP) => {
  const badges = [...user.badges];
  const newBadges = [];

  // XP milestone badges
  if (newXP >= 50 && !badges.includes("first_50")) {
    badges.push("first_50");
    newBadges.push("first_50");
  }
  if (newXP >= 200 && !badges.includes("xp_200")) {
    badges.push("xp_200");
    newBadges.push("xp_200");
  }
  if (newXP >= 500 && !badges.includes("xp_500")) {
    badges.push("xp_500");
    newBadges.push("xp_500");
  }

  // Streak badges
  if (user.streak >= 7 && !badges.includes("streak_7")) {
    badges.push("streak_7");
    newBadges.push("streak_7");
  }

  return { badges, newBadges };
};

export const updateStreak = (user) => {
  const today = new Date().toDateString();
  const lastHealthyDate = user.lastHealthyDate
    ? new Date(user.lastHealthyDate).toDateString()
    : null;
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  let newStreak = user.streak;
  let newLastHealthyDate = user.lastHealthyDate;

  // Check if today has any healthy meals
  const todaysLogs = getTodaysLogs();
  const hasHealthyMealToday = todaysLogs.some((log) => log.healthScore >= 60);

  if (hasHealthyMealToday) {
    if (lastHealthyDate === yesterday || lastHealthyDate === today) {
      // Continue streak
      newStreak = user.streak + (lastHealthyDate === yesterday ? 1 : 0);
    } else if (lastHealthyDate !== today) {
      // Start new streak
      newStreak = 1;
    }
    newLastHealthyDate = today;
  } else if (lastHealthyDate !== today) {
    // No healthy meal today, reset streak if it wasn't already reset
    if (lastHealthyDate && lastHealthyDate !== yesterday) {
      newStreak = 0;
    }
  }

  return { streak: newStreak, lastHealthyDate: newLastHealthyDate };
};

// BMI calculation functions
export const calculateBMI = (weight, height, weightUnit = "kg", heightUnit = "cm") => {
  // Convert weight to kg if needed
  let weightInKg = weight;
  if (weightUnit === "lb") {
    weightInKg = weight / 2.20462;
  }

  // Convert height to meters if needed
  let heightInM = height;
  if (heightUnit === "cm") {
    heightInM = height / 100;
  } else if (heightUnit === "ft") {
    // height is already in meters if coming from ft-inches conversion
    heightInM = height / 100;
  }

  // Calculate BMI: weight(kg) / height(m)^2
  const bmi = weightInKg / (heightInM * heightInM);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export const updateUserBMI = (user) => {
  if (user.weight && user.height) {
    const bmi = calculateBMI(user.weight, user.height, user.weightUnit, user.heightUnit);
    const bmiCategory = getBMICategory(bmi);
    
    return {
      ...user,
      bmi,
      bmiCategory
    };
  }
  return user;
};

// Reset functions
export const resetUserData = () => {
  const currentUser = getUser();
  const resetUser = {
    ...defaultUser,
    username: currentUser.username,
    email: currentUser.email,
    dailyCalories: currentUser.dailyCalories,
    activityLevel: currentUser.activityLevel,
    age: currentUser.age,
    weight: currentUser.weight,
    weightUnit: currentUser.weightUnit,
    height: currentUser.height,
    heightUnit: currentUser.heightUnit,
    feet: currentUser.feet,
    inches: currentUser.inches,
    bmi: currentUser.bmi,
    bmiCategory: currentUser.bmiCategory,
  };
  saveUser(resetUser);
  return resetUser;
};

export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.DATASET_VERSION);
  return true;
};

// Statistics helpers
export const getTodaysStats = () => {
  const todaysLogs = getTodaysLogs();
  const stats = {
    totalCalories: 0,
    totalProtein: 0,
    totalFat: 0,
    totalCarbs: 0,
    totalXP: 0,
    mealCount: todaysLogs.length,
    averageHealthScore: 0,
  };

  if (todaysLogs.length > 0) {
    todaysLogs.forEach((log) => {
      stats.totalCalories += log.calories || 0;
      stats.totalProtein += log.protein || 0;
      stats.totalFat += log.fat || 0;
      stats.totalCarbs += log.carbs || 0;
      stats.totalXP += log.xp || 0;
    });

    stats.averageHealthScore =
      todaysLogs.reduce((sum, log) => sum + (log.healthScore || 0), 0) /
      todaysLogs.length;
  }

  return stats;
};

export const getWeeklyStats = () => {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyLogs = getLogsInRange(startDate, endDate);

  const stats = {
    totalCalories: 0,
    totalXP: 0,
    daysWithLogs: new Set(),
    averageHealthScore: 0,
  };

  if (weeklyLogs.length > 0) {
    weeklyLogs.forEach((log) => {
      stats.totalCalories += log.calories || 0;
      stats.totalXP += log.xp || 0;
      stats.daysWithLogs.add(new Date(log.timestamp).toDateString());
    });

    stats.averageHealthScore =
      weeklyLogs.reduce((sum, log) => sum + (log.healthScore || 0), 0) /
      weeklyLogs.length;
    stats.daysWithLogs = stats.daysWithLogs.size;
  }

  return stats;
};

export default {
  getUser,
  saveUser,
  updateUser,
  getLogs,
  saveLogs,
  addLog,
  deleteLog,
  updateLog,
  getTodaysLogs,
  getLogsInRange,
  getDatasetVersion,
  setDatasetVersion,
  searchFoods,
  getFoodByName,
  calculateXP,
  calculateLevel,
  checkForNewBadges,
  updateStreak,
  resetUserData,
  resetAllData,
  getTodaysStats,
  getWeeklyStats,
};
