import React, { useState } from "react";
import { updateUser } from "../storage";
import "./ActivityLevelPage.css";

const ActivityLevelPage = ({ user, onNext, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const activityLevels = [
    {
      id: "mostly_sitting",
      title: "Mostly Sitting",
      description: "Seated work, low movement.",
      icon: "🪑",
      color: "#fef3c7", // amber-100
      borderColor: "#f59e0b", // amber-500
    },
    {
      id: "often_standing",
      title: "Often Standing",
      description: "Standing work, occasional walking.",
      icon: "🚶‍♂️",
      color: "#dbeafe", // blue-100
      borderColor: "#3b82f6", // blue-500
    },
    {
      id: "regularly_walking",
      title: "Regularly Walking",
      description: "Frequent walking, steady activity.",
      icon: "🚶‍♀️",
      color: "#dcfce7", // green-100
      borderColor: "#22c55e", // green-500
    },
    {
      id: "physically_intense",
      title: "Physically Intense Work",
      description: "Heavy labor, high exertion.",
      icon: "💪",
      color: "#fecaca", // red-100
      borderColor: "#ef4444", // red-500
    },
  ];

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
  };

  const handleNext = () => {
    if (selectedLevel) {
      // Update user profile with activity level
      const updatedUser = {
        ...user,
        activityLevel: selectedLevel,
      };
      
      updateUser(updatedUser);
      onNext(updatedUser);
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <div className="activity-level-page">
      <div className="activity-level-container">
        {/* Header */}
        <div className="activity-header">
          <h1 className="activity-title">How active are you?</h1>
          <p className="activity-subtitle">
            Based on your lifestyle, we can assess your daily calorie requirements.
          </p>
        </div>

        {/* Activity Level Cards */}
        <div className="activity-cards">
          {activityLevels.map((level) => (
            <div
              key={level.id}
              className={`activity-card ${
                selectedLevel === level.id ? "selected" : ""
              }`}
              onClick={() => handleLevelSelect(level.id)}
              style={{
                "--card-color": level.color,
                "--border-color": level.borderColor,
              }}
            >
              <div className="card-icon">{level.icon}</div>
              <div className="card-content">
                <h3 className="card-title">{level.title}</h3>
                <p className="card-description">{level.description}</p>
              </div>
              <div className="card-selection-indicator">
                {selectedLevel === level.id && (
                  <div className="selection-check">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="activity-actions">
          <button
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!selectedLevel}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLevelPage;
