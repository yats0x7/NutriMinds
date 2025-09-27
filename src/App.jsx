import React, { useState, useEffect } from "react";
import Landing from "./components/Landing";
import LoginModal from "./components/LoginModal";
import Dashboard from "./components/Dashboard";
import { getUser } from "./storage";
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
      setCurrentView("dashboard");
    }
  }, []);

  const handleGetHealthyClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("landing");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
  };

  return (
    <div className="App">
      {currentView === "landing" && (
        <Landing onGetHealthy={handleGetHealthyClick} />
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
