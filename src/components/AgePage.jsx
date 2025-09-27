import React, { useState } from "react";
import "./AgePage.css";

const AgePage = ({ user, onNext, onBack }) => {
  const [age, setAge] = useState(user.age || "");

  const handleAgeChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to reasonable age range
    if (value === "" || (Number(value) >= 1 && Number(value) <= 120)) {
      setAge(value);
    }
  };

  const handleNext = () => {
    if (age && Number(age) >= 1 && Number(age) <= 120) {
      onNext({ ...user, age: Number(age) });
    }
  };

  const handleBack = () => {
    onBack();
  };

  const isValid = age && Number(age) >= 1 && Number(age) <= 120;

  return (
    <div className="age-page">
      <div className="age-container">
        {/* Header */}
        <div className="age-header">
          <h1 className="age-title">What's your age?</h1>
          <p className="age-subtitle">
            This helps us personalize your health recommendations.
          </p>
        </div>

        {/* Age Input */}
        <div className="age-input-section">
          <div className="age-input-container">
            <input
              type="number"
              value={age}
              onChange={handleAgeChange}
              placeholder="Enter your age"
              className="age-input"
              min="1"
              max="120"
              autoFocus
            />
            <div className="age-unit">years old</div>
          </div>
          
          {age && !isValid && (
            <div className="age-error">
              Please enter a valid age between 1 and 120
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="age-actions">
          <button
            className="btn btn-secondary"
            onClick={handleBack}
          >
            Back
          </button>
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!isValid}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgePage;
