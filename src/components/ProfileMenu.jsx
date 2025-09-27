import React, { useState } from "react";
import { updateUser, resetUserData, resetAllData } from "../storage";
import "./ProfileMenu.css";

const ProfileMenu = ({ user, onUserUpdate, onLogout, onClose }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user.username,
    email: user.email,
    dailyCalories: user.dailyCalories,
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...editData,
      dailyCalories: parseInt(editData.dailyCalories),
    };

    updateUser(updatedUser);
    onUserUpdate(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      username: user.username,
      email: user.email,
      dailyCalories: user.dailyCalories,
    });
    setIsEditing(false);
  };

  const handleResetData = () => {
    resetUserData();
    const resetUser = {
      ...user,
      totalXP: 0,
      currentLevel: 1,
      badges: [],
      streak: 0,
      lastHealthyDate: null,
    };
    onUserUpdate(resetUser);
    setShowResetConfirm(false);
  };

  const handleResetAll = () => {
    resetAllData();
    onLogout();
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="modal-overlay profile-modal">
      <div className="modal-content profile-content">
        <div className="modal-header">
          <h2 className="modal-title">Profile Settings</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close profile menu"
          >
            ×
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`tab-button ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            Stats
          </button>
          <button
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>

        <div className="profile-content-area">
          {activeTab === "profile" && (
            <div className="profile-tab">
              <div className="profile-header">
                <div className="profile-avatar">
                  {getInitials(user.username)}
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">{user.username}</h3>
                  <p className="profile-email">
                    {user.email || "No email provided"}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={editData.username}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Daily Calorie Target</label>
                    <input
                      type="number"
                      name="dailyCalories"
                      value={editData.dailyCalories}
                      onChange={handleEditChange}
                      className="form-input"
                      min="1000"
                      max="5000"
                    />
                  </div>
                  <div className="form-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Username:</span>
                    <span className="detail-value">{user.username}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {user.email || "Not provided"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Daily Target:</span>
                    <span className="detail-value">
                      {user.dailyCalories} calories
                    </span>
                  </div>
                  <button
                    className="btn btn-primary edit-button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="stats-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">⭐</div>
                  <div className="stat-value">{user.totalXP}</div>
                  <div className="stat-label">Total XP</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-value">{user.currentLevel}</div>
                  <div className="stat-label">Level</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔥</div>
                  <div className="stat-value">{user.streak}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🏅</div>
                  <div className="stat-value">{user.badges.length}</div>
                  <div className="stat-label">Badges</div>
                </div>
              </div>

              {user.badges.length > 0 && (
                <div className="badges-section">
                  <h4 className="section-title">Your Badges</h4>
                  <div className="badges-list">
                    {user.badges.map((badge, index) => (
                      <div key={index} className="badge-item">
                        <div className="badge-icon">
                          {badge === "first_50" && "🥉"}
                          {badge === "xp_200" && "🥈"}
                          {badge === "xp_500" && "🥇"}
                          {badge === "streak_7" && "🔥"}
                        </div>
                        <div className="badge-name">
                          {badge === "first_50" && "First Steps"}
                          {badge === "xp_200" && "XP Master"}
                          {badge === "xp_500" && "XP Legend"}
                          {badge === "streak_7" && "Streak King"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings-tab">
              <div className="settings-section">
                <h4 className="section-title">Data Management</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Reset Progress</div>
                    <div className="setting-description">
                      Clear all meal logs and reset XP, but keep your profile
                    </div>
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => setShowResetConfirm(true)}
                  >
                    Reset Data
                  </button>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Complete Reset</div>
                    <div className="setting-description">
                      Clear everything and return to landing page
                    </div>
                  </div>
                  <button className="btn btn-danger" onClick={handleResetAll}>
                    Reset All
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h4 className="section-title">Account</h4>
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-name">Sign Out</div>
                    <div className="setting-description">
                      Return to landing page (data will be saved)
                    </div>
                  </div>
                  <button className="btn btn-secondary" onClick={onLogout}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="confirm-modal">
            <div className="confirm-content">
              <h3 className="confirm-title">Reset Progress?</h3>
              <p className="confirm-message">
                This will clear all your meal logs and reset your XP, level, and
                badges. Your profile information will be kept.
              </p>
              <div className="confirm-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleResetData}>
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMenu;
