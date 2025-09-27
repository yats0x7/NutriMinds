import React from "react";
import "./SuggestionsModal.css";

const SuggestionsModal = ({ suggestions, onSelect, onClose }) => {
  const handleSelect = (food) => {
    onSelect(food);
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

  return (
    <div className="modal-overlay suggestions-modal">
      <div className="modal-content suggestions-content">
        <div className="modal-header">
          <h2 className="modal-title">Select Your Food</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close suggestions"
          >
            ×
          </button>
        </div>

        <div className="suggestions-list">
          {suggestions.map((food, index) => (
            <div
              key={index}
              className={`suggestion-item ${food.isAI ? "ai-suggestion" : ""}`}
              onClick={() => handleSelect(food)}
            >
              <div className="suggestion-main">
                <div className="food-name">
                  {food.dish}
                  {food.isAI && <span className="ai-badge">AI {food.confidence}%</span>}
                  {food.isFallback && <span className="fallback-badge">Fallback</span>}
                </div>
                <div className="food-calories">{food.calories} cal</div>
              </div>

              <div className="food-nutrition">
                <div className="nutrition-item">
                  <span className="nutrition-label">Protein:</span>
                  <span className="nutrition-value">{food.protein}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Carbs:</span>
                  <span className="nutrition-value">{food.carbs}g</span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">Fat:</span>
                  <span className="nutrition-value">{food.fat}g</span>
                </div>
              </div>

              <div className="health-score">
                <div
                  className="health-score-badge"
                  style={{
                    backgroundColor: getHealthScoreColor(food.healthScore),
                  }}
                >
                  {food.healthScore}
                </div>
                <div className="health-score-label">
                  {getHealthScoreLabel(food.healthScore)}
                </div>
              </div>

              <div className="select-indicator">
                <span className="select-arrow">→</span>
              </div>
            </div>
          ))}
        </div>

        <div className="suggestions-footer">
          <p className="suggestion-note">
            💡 Tap on any food to log it and earn XP!
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsModal;
