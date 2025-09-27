import React, { useState, useEffect } from "react";
import "./WeightPage.css";

const WeightPage = ({ user, onNext, onBack }) => {
  const [weight, setWeight] = useState(user.weight || 70);
  const [unit, setUnit] = useState(user.weightUnit || "kg");
  const [isValid, setIsValid] = useState(true);

  // Weight ranges for different units
  const weightRanges = {
    kg: { min: 20, max: 300, step: 0.5 },
    lb: { min: 44, max: 660, step: 1 }
  };

  const currentRange = weightRanges[unit];

  useEffect(() => {
    // Validate weight when unit changes
    if (weight < currentRange.min || weight > currentRange.max) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [weight, unit, currentRange]);

  const handleWeightChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setWeight(value);
    }
  };

  const handleUnitToggle = () => {
    const newUnit = unit === "kg" ? "lb" : "kg";
    setUnit(newUnit);
    
    // Convert weight when switching units
    if (newUnit === "lb") {
      setWeight(Math.round(weight * 2.20462 * 2) / 2); // Round to nearest 0.5
    } else {
      setWeight(Math.round(weight / 2.20462 * 10) / 10); // Round to nearest 0.1
    }
  };

  const handleNext = () => {
    if (isValid) {
      onNext({ ...user, weight, weightUnit: unit });
    }
  };

  const handleBack = () => {
    onBack();
  };

  const generateWeightOptions = () => {
    const options = [];
    for (let i = currentRange.min; i <= currentRange.max; i += currentRange.step) {
      options.push(i);
    }
    return options;
  };

  const weightOptions = generateWeightOptions();

  return (
    <div className="weight-page">
      <div className="weight-container">
        {/* Header */}
        <div className="weight-header">
          <h1 className="weight-title">What's your current weight?</h1>
          <p className="weight-subtitle">
            This helps us calculate your BMI and calorie needs.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="unit-toggle-container">
          <div className="unit-toggle">
            <button
              className={`unit-btn ${unit === "kg" ? "active" : ""}`}
              onClick={() => setUnit("kg")}
            >
              Kg
            </button>
            <button
              className={`unit-btn ${unit === "lb" ? "active" : ""}`}
              onClick={() => setUnit("lb")}
            >
              Lb
            </button>
          </div>
        </div>

        {/* Weight Picker */}
        <div className="weight-picker-section">
          <div className="weight-picker-container">
            <div className="weight-display">
              <input
                type="number"
                value={weight}
                onChange={handleWeightChange}
                className="weight-input"
                min={currentRange.min}
                max={currentRange.max}
                step={currentRange.step}
              />
              <div className="weight-unit">{unit}</div>
            </div>
            
            <div className="weight-scroll-container">
              <div className="weight-scroll">
                {weightOptions.map((option) => (
                  <div
                    key={option}
                    className={`weight-option ${
                      Math.abs(option - weight) < currentRange.step / 2 ? "selected" : ""
                    }`}
                    onClick={() => setWeight(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {!isValid && (
            <div className="weight-error">
              Please enter a valid weight between {currentRange.min} and {currentRange.max} {unit}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="weight-actions">
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

export default WeightPage;
