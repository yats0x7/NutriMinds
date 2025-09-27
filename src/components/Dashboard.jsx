import React, { useState, useEffect } from "react";
import Header from "./Header";
import UploadInput from "./UploadInput";
import LogList from "./LogList";
import XPBar from "./XPBar";
import Charts from "./Charts";
import ProfileMenu from "./ProfileMenu";
import SuggestionsModal from "./SuggestionsModal";
import {
  getTodaysLogs,
  getTodaysStats,
  updateUser,
  addLog,
  calculateXP,
  checkForNewBadges,
  updateStreak,
} from "../storage";
import "./Dashboard.css";

const Dashboard = ({ user, onUserUpdate, onLogout, onBackToLanding }) => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    loadTodaysData();
  }, []);

  const loadTodaysData = () => {
    const todaysLogs = getTodaysLogs();
    const todaysStats = getTodaysStats();
    setLogs(todaysLogs);
    setStats(todaysStats);
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setShowSuggestions(false);
  };

  const handleLogFood = async (foodData) => {
    try {
      const xp = calculateXP(foodData.healthScore);
      const logEntry = {
        ...foodData,
        xp,
      };

      addLog(logEntry);

      // Update user XP and check for badges
      const newTotalXP = user.totalXP + xp;
      const newLevel = Math.floor(newTotalXP / 100) + 1;

      const { badges, newBadges: earnedBadges } = checkForNewBadges(
        user,
        newTotalXP
      );
      const { streak, lastHealthyDate } = updateStreak(user);

      const updatedUser = {
        ...user,
        totalXP: newTotalXP,
        currentLevel: newLevel,
        badges,
        streak,
        lastHealthyDate,
      };

      updateUser(updatedUser);
      onUserUpdate(updatedUser);

      // Show XP animation
      setShowXPAnimation(true);
      setTimeout(() => setShowXPAnimation(false), 2000);

      // Show new badges
      if (earnedBadges.length > 0) {
        setNewBadges(earnedBadges);
        setTimeout(() => setNewBadges([]), 3000);
      }

      // Reload today's data
      loadTodaysData();
    } catch (error) {
      console.error("Error logging food:", error);
    }
  };

  const handleDeleteLog = (logId) => {
    // In a real app, you'd want to recalculate XP and badges
    // For now, just reload the data
    loadTodaysData();
  };

  const handleShowSuggestions = (suggestions) => {
    setSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="dashboard">
      <Header
        user={user}
        onProfileClick={() => setShowProfileMenu(true)}
        onBackToLanding={onBackToLanding}
      />

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="dashboard-left">
            <XPBar
              user={user}
              showAnimation={showXPAnimation}
              newBadges={newBadges}
            />

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Quick Log</h3>
              </div>
              <UploadInput
                onFoodSelect={handleFoodSelect}
                onShowSuggestions={handleShowSuggestions}
              />
            </div>
          </div>

          {/* Center Column */}
          <div className="dashboard-center">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Today's Meals</h3>
                <div className="meal-count">
                  {logs.length} meal{logs.length !== 1 ? "s" : ""}
                </div>
              </div>
              <LogList logs={logs} onDeleteLog={handleDeleteLog} />
            </div>
          </div>

          {/* Right Column */}
          <div className="dashboard-right">
            <Charts logs={logs} stats={stats} user={user} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSuggestions && (
        <SuggestionsModal
          suggestions={suggestions}
          onSelect={handleLogFood}
          onClose={handleCloseSuggestions}
        />
      )}

      {showProfileMenu && (
        <ProfileMenu
          user={user}
          onUserUpdate={onUserUpdate}
          onLogout={onLogout}
          onClose={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
