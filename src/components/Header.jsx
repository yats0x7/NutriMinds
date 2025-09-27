import React from "react";
import "./Header.css";

const Header = ({ user, onProfileClick, onBackToLanding }) => {

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button
            className="back-button"
            onClick={onBackToLanding}
            title="Back to landing page"
          >
            ←
          </button>
          <div className="logo">
            <span className="logo-icon">🥗</span>
            <span className="logo-text">FoodLens</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="welcome-text">
              Welcome back, <strong>{user.username}</strong>!
            </span>
          </div>


          <button
            className="profile-button"
            onClick={onProfileClick}
            title="Profile menu"
          >
            <div className="user-avatar">{getInitials(user.username)}</div>
            <span className="profile-text">Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
