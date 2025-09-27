import React, { useState, useEffect } from "react";
import { saveUser } from "../storage";
import "./LoginModal.css";

const LoginModal = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dailyCalories: 2200,
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Focus on username input when modal opens
    const usernameInput = document.getElementById("username");
    if (usernameInput) {
      usernameInput.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.dailyCalories < 1000 || formData.dailyCalories > 5000) {
      newErrors.dailyCalories = "Daily calories must be between 1000 and 5000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate a brief delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim() || "",
        dailyCalories: parseInt(formData.dailyCalories),
        totalXP: 0,
        currentLevel: 1,
        badges: [],
        streak: 0,
        lastHealthyDate: null,
      };

      const success = saveUser(userData);

      if (success) {
        onLoginSuccess(userData);
      } else {
        setErrors({ submit: "Failed to save user data. Please try again." });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown}>
      <div className="modal-content login-modal">
        <div className="modal-header">
          <h2 className="modal-title">Welcome to FoodLens! 🥗</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`form-input ${errors.username ? "error" : ""}`}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
            {errors.username && (
              <div className="error-message">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email (Optional)
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dailyCalories" className="form-label">
              Daily Calorie Target
            </label>
            <input
              type="number"
              id="dailyCalories"
              name="dailyCalories"
              value={formData.dailyCalories}
              onChange={handleInputChange}
              className={`form-input ${errors.dailyCalories ? "error" : ""}`}
              min="1000"
              max="5000"
              step="50"
              disabled={isSubmitting}
            />
            {errors.dailyCalories && (
              <div className="error-message">{errors.dailyCalories}</div>
            )}
            <div className="form-help">
              Recommended: 2000-2500 calories for adults
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password (Optional)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter a password (optional for demo)"
              disabled={isSubmitting}
            />
            <div className="form-help">
              This is a demo app - password is optional
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">{errors.submit}</div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>Get Started! 🚀</>
              )}
            </button>
          </div>
        </form>

        <div className="login-footer">
          <p className="demo-note">
            💡 This is a demo app - your data is stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
