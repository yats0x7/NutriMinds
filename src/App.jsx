import React, { useState, useEffect } from "react";
import Landing from "./components/Landing";
import LoginModal from "./components/LoginModal";
import ActivityLevelPage from "./components/ActivityLevelPage";
import AgePage from "./components/AgePage";
import WeightPage from "./components/WeightPage";
import HeightPage from "./components/HeightPage";
import Dashboard from "./components/Dashboard";
import { getUser, updateUserBMI } from "./storage";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = getUser();
    if (savedUser.username) {
      setUser(savedUser);
      // Check onboarding completion
      if (savedUser.bmi) {
        // User has completed full onboarding
        setCurrentView("dashboard");
      } else if (savedUser.height) {
        // User needs to complete BMI calculation
        setCurrentView("height");
      } else if (savedUser.weight) {
        // User needs to enter height
        setCurrentView("weight");
      } else if (savedUser.age) {
        // User needs to enter weight
        setCurrentView("age");
      } else if (savedUser.activityLevel) {
        // User needs to enter age
        setCurrentView("activity-level");
      } else {
        // User needs to complete activity level
        setCurrentView("activity-level");
      }
    }
  }, []);

  const handleGetHealthyClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    setCurrentView("activity-level");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("landing");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  const handleActivityLevelNext = (updatedUser) => {
    setUser(updatedUser);
    setCurrentView("age");
  };

  const handleActivityLevelBack = () => {
    setCurrentView("landing");
  };

  const handleAgeNext = (updatedUser) => {
    setUser(updatedUser);
    setCurrentView("weight");
  };

  const handleAgeBack = () => {
    setCurrentView("activity-level");
  };

  const handleWeightNext = (updatedUser) => {
    setUser(updatedUser);
    setCurrentView("height");
  };

  const handleWeightBack = () => {
    setCurrentView("age");
  };

  const handleHeightNext = (updatedUser) => {
    // Calculate BMI and update user
    const userWithBMI = updateUserBMI(updatedUser);
    setUser(userWithBMI);
    setCurrentView("dashboard");
  };

  const handleHeightBack = () => {
    setCurrentView("weight");
  };

  return (
    <div className="App">
      {currentView === "landing" && (
        <Landing onGetHealthy={handleGetHealthyClick} />
      )}

      {currentView === "activity-level" && user && (
        <ActivityLevelPage
          user={user}
          onNext={handleActivityLevelNext}
          onBack={handleActivityLevelBack}
        />
      )}

      {currentView === "age" && user && (
        <AgePage
          user={user}
          onNext={handleAgeNext}
          onBack={handleAgeBack}
        />
      )}

      {currentView === "weight" && user && (
        <WeightPage
          user={user}
          onNext={handleWeightNext}
          onBack={handleWeightBack}
        />
      )}

      {currentView === "height" && user && (
        <HeightPage
          user={user}
          onNext={handleHeightNext}
          onBack={handleHeightBack}
        />
      )}

      {currentView === "dashboard" && user && (
        <Dashboard
          user={user}
          onUserUpdate={setUser}
          onLogout={handleLogout}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}

export default App;
