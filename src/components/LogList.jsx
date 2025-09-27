import React from "react";
import { deleteLog } from "../storage";
import "./LogList.css";

const LogList = ({ logs, onDeleteLog }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return "#48bb78";
    if (score >= 60) return "#ed8936";
    if (score >= 40) return "#ecc94b";
    return "#f56565";
  };

  const getHealthScoreLabel = (score) => {
    if (score >= 80) return "Very Healthy";
    if (score >= 60) return "Healthy";
    if (score >= 40) return "Moderate";
    return "Less Healthy";
  };

  const handleDelete = (logId) => {
    if (window.confirm("Are you sure you want to delete this meal log?")) {
      deleteLog(logId);
      onDeleteLog(logId);
    }
  };

  if (logs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🍽️</div>
        <div className="empty-state-title">No meals logged today</div>
        <div className="empty-state-description">
          Start by typing a food name or uploading a photo above!
        </div>
      </div>
    );
  }

  return (
    <div className="log-list">
      {logs.map((log) => (
        <div key={log.id} className="log-item">
          <div className="log-main">
            <div className="log-header">
              <div className="log-dish">{log.dish}</div>
              <div className="log-time">{formatTime(log.timestamp)}</div>
            </div>

            <div className="log-nutrition">
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-value">{log.calories}</span>
                  <span className="nutrition-label">cal</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{log.protein}g</span>
                  <span className="nutrition-label">protein</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{log.carbs}g</span>
                  <span className="nutrition-label">carbs</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-value">{log.fat}g</span>
                  <span className="nutrition-label">fat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="log-side">
            <div className="log-health">
              <div
                className="health-score"
                style={{
                  backgroundColor: getHealthScoreColor(log.healthScore),
                }}
              >
                {log.healthScore}
              </div>
              <div className="health-label">
                {getHealthScoreLabel(log.healthScore)}
              </div>
            </div>

            <div className="log-xp">
              <div className="xp-value">+{log.xp}</div>
              <div className="xp-label">XP</div>
            </div>

            <button
              className="delete-button"
              onClick={() => handleDelete(log.id)}
              title="Delete this meal"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogList;
