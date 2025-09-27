import React, { useState, useEffect } from "react";
import "./HeightPage.css";

const HeightPage = ({ user, onNext, onBack }) => {
  const [height, setHeight] = useState(user.height || 170);
  const [unit, setUnit] = useState(user.heightUnit || "cm");
  const [feet, setFeet] = useState(user.feet || 5);
  const [inches, setInches] = useState(user.inches || 7);
  const [isValid, setIsValid] = useState(true);

  // Height ranges for different units
  const heightRanges = {
    cm: { min: 100, max: 250, step: 1 },
    ft: { min: 3, max: 8, step: 1 }
  };

  const inchRange = { min: 0, max: 11, step: 1 };

  useEffect(() => {
    // Validate height when unit changes
    if (unit === "cm") {
      if (height < heightRanges.cm.min || height > heightRanges.cm.max) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } else {
      if (feet < heightRanges.ft.min || feet > heightRanges.ft.max || 
          inches < inchRange.min || inches > inchRange.max) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
  }, [height, feet, inches, unit, heightRanges, inchRange]);

  const handleHeightChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setHeight(value);
    }
  };

  const handleFeetChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setFeet(value);
    }
  };

  const handleInchesChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setInches(value);
    }
  };

  const handleUnitToggle = () => {
    const newUnit = unit === "cm" ? "ft" : "cm";
    setUnit(newUnit);
    
    // Convert height when switching units
    if (newUnit === "ft") {
      // Convert cm to feet and inches
      const totalInches = height / 2.54;
      const newFeet = Math.floor(totalInches / 12);
      const newInches = Math.round(totalInches % 12);
      setFeet(newFeet);
      setInches(newInches);
    } else {
      // Convert feet and inches to cm
      const totalInches = feet * 12 + inches;
      const newHeight = Math.round(totalInches * 2.54);
      setHeight(newHeight);
    }
  };

  const handleNext = () => {
    if (isValid) {
      const userData = { ...user, heightUnit: unit };
      
      if (unit === "cm") {
        userData.height = height;
      } else {
        userData.feet = feet;
        userData.inches = inches;
        // Also store total height in cm for BMI calculation
        userData.height = Math.round((feet * 12 + inches) * 2.54);
      }
      
      onNext(userData);
    }
  };

  const handleBack = () => {
    onBack();
  };

  const generateHeightOptions = () => {
    const options = [];
    for (let i = heightRanges.cm.min; i <= heightRanges.cm.max; i += heightRanges.cm.step) {
      options.push(i);
    }
    return options;
  };

  const generateFeetOptions = () => {
    const options = [];
    for (let i = heightRanges.ft.min; i <= heightRanges.ft.max; i += heightRanges.ft.step) {
      options.push(i);
    }
    return options;
  };

  const generateInchesOptions = () => {
    const options = [];
    for (let i = inchRange.min; i <= inchRange.max; i += inchRange.step) {
      options.push(i);
    }
    return options;
  };

  const heightOptions = generateHeightOptions();
  const feetOptions = generateFeetOptions();
  const inchesOptions = generateInchesOptions();

  return (
    <div className="height-page">
      <div className="height-container">
        {/* Header */}
        <div className="height-header">
          <h1 className="height-title">What's your height?</h1>
          <p className="height-subtitle">
            This helps us calculate your BMI and provide accurate recommendations.
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="unit-toggle-container">
          <div className="unit-toggle">
            <button
              className={`unit-btn ${unit === "cm" ? "active" : ""}`}
              onClick={() => setUnit("cm")}
            >
              Cm
            </button>
            <button
              className={`unit-btn ${unit === "ft" ? "active" : ""}`}
              onClick={() => setUnit("ft")}
            >
              Ft-In
            </button>
          </div>
        </div>

        {/* Height Picker */}
        <div className="height-picker-section">
          <div className="height-picker-container">
            {unit === "cm" ? (
              <>
                <div className="height-display">
                  <input
                    type="number"
                    value={height}
                    onChange={handleHeightChange}
                    className="height-input"
                    min={heightRanges.cm.min}
                    max={heightRanges.cm.max}
                    step={heightRanges.cm.step}
                  />
                  <div className="height-unit">cm</div>
                </div>
                
                <div className="height-scroll-container">
                  <div className="height-scroll">
                    {heightOptions.map((option) => (
                      <div
                        key={option}
                        className={`height-option ${
                          Math.abs(option - height) < heightRanges.cm.step / 2 ? "selected" : ""
                        }`}
                        onClick={() => setHeight(option)}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="height-display ft-inches">
                  <div className="ft-inches-container">
                    <input
                      type="number"
                      value={feet}
                      onChange={handleFeetChange}
                      className="height-input ft-input"
                      min={heightRanges.ft.min}
                      max={heightRanges.ft.max}
                      step={heightRanges.ft.step}
                    />
                    <div className="height-unit">ft</div>
                  </div>
                  <div className="ft-inches-container">
                    <input
                      type="number"
                      value={inches}
                      onChange={handleInchesChange}
                      className="height-input inches-input"
                      min={inchRange.min}
                      max={inchRange.max}
                      step={inchRange.step}
                    />
                    <div className="height-unit">in</div>
                  </div>
                </div>
                
                <div className="height-scroll-container ft-inches-scroll">
                  <div className="ft-inches-scroll-wrapper">
                    <div className="height-scroll">
                      {feetOptions.map((option) => (
                        <div
                          key={`ft-${option}`}
                          className={`height-option ${
                            Math.abs(option - feet) < heightRanges.ft.step / 2 ? "selected" : ""
                          }`}
                          onClick={() => setFeet(option)}
                        >
                          {option} ft
                        </div>
                      ))}
                    </div>
                    <div className="height-scroll">
                      {inchesOptions.map((option) => (
                        <div
                          key={`in-${option}`}
                          className={`height-option ${
                            Math.abs(option - inches) < inchRange.step / 2 ? "selected" : ""
                          }`}
                          onClick={() => setInches(option)}
                        >
                          {option} in
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {!isValid && (
            <div className="height-error">
              Please enter a valid height
              {unit === "cm" 
                ? ` between ${heightRanges.cm.min} and ${heightRanges.cm.max} cm`
                : ` between ${heightRanges.ft.min} and ${heightRanges.ft.max} ft`
              }
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="height-actions">
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

export default HeightPage;
