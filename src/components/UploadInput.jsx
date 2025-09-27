import React, { useState, useRef, useEffect } from "react";
import { searchFoods } from "../storage";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./UploadInput.css";

const UploadInput = ({ onFoodSelect, onShowSuggestions }) => {
  const [inputValue, setInputValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Load MobileNet model on component mount
  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setModelLoading(true);
      console.log("Loading MobileNet model...");
      
      // Load the MobileNet model
      const loadedModel = await mobilenet.load({
        version: 2,
        alpha: 1.0,
      });
      
      setModel(loadedModel);
      console.log("MobileNet model loaded successfully!");
      console.log("Model info:", {
        version: "MobileNetV2",
        inputShape: loadedModel.inputShape,
        numClasses: loadedModel.numClasses
      });
    } catch (error) {
      console.error("Error loading MobileNet model:", error);
      console.error("This might be due to network issues or browser compatibility");
    } finally {
      setModelLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 1) {
      const suggestions = searchFoods(value).slice(0, 3);
      if (suggestions.length > 0) {
        onShowSuggestions(suggestions);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (!inputValue.trim()) return;

    const suggestions = searchFoods(inputValue);
    if (suggestions.length > 0) {
      onShowSuggestions(suggestions);
    } else {
      // No suggestions found, create custom entry
      const customFood = {
        dish: inputValue.trim(),
        calories: 200, // Default values for custom entries
        protein: 10,
        fat: 8,
        carbs: 25,
        healthScore: 50,
      };
      onFoodSelect(customFood);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || isUploading) return;

    setIsUploading(true);

    try {
      // Check if model is loaded
      if (!model) {
        console.log("Model not loaded yet, waiting...");
        // Wait a bit for model to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!model) {
          throw new Error("Model failed to load");
        }
      }

      console.log("Starting AI classification...");
      
      // Create an image element from the file
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });

      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Classify the image using MobileNet
      const predictions = await model.classify(canvas);
      
      console.log("AI predictions:", predictions);
      
      // Convert predictions to our format
      const aiSuggestions = predictions.slice(0, 3).map((prediction, index) => {
        // Map confidence to health score (higher confidence = higher health score)
        const healthScore = Math.min(Math.round(prediction.probability * 100), 95);
        
        // Estimate nutritional values based on food type
        const { calories, protein, fat, carbs } = estimateNutrition(prediction.className);
        
        return {
          dish: formatFoodName(prediction.className),
          calories: calories,
          protein: protein,
          fat: fat,
          carbs: carbs,
          healthScore: healthScore,
          isAI: true,
          confidence: Math.round(prediction.probability * 100),
        };
      });

      onShowSuggestions(aiSuggestions);
      
      // Clean up
      URL.revokeObjectURL(img.src);
      
    } catch (error) {
      console.error("Error processing image with AI:", error);

      // Show fallback suggestions if AI fails
      const fallbackSuggestions = [
        {
          dish: "Mixed Salad",
          calories: 80,
          protein: 4,
          fat: 3,
          carbs: 12,
          healthScore: 95,
          isFallback: true,
        },
        {
          dish: "Sandwich",
          calories: 250,
          protein: 12,
          fat: 8,
          carbs: 30,
          healthScore: 50,
          isFallback: true,
        },
        {
          dish: "Pasta",
          calories: 280,
          protein: 10,
          fat: 6,
          carbs: 45,
          healthScore: 45,
          isFallback: true,
        },
      ];

      onShowSuggestions(fallbackSuggestions);
    } finally {
      setIsUploading(false);
      // Reset the file input to allow the same file to be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Helper function to format food names
  const formatFoodName = (className) => {
    return className
      .split(',')[0] // Take the first part before comma
      .replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to estimate nutritional values based on food type
  const estimateNutrition = (className) => {
    const foodName = className.toLowerCase();
    
    // Food-specific nutritional estimates (per 100g serving)
    if (foodName.includes('pizza')) {
      return { calories: 285, protein: 12, fat: 10, carbs: 36 };
    } else if (foodName.includes('burger') || foodName.includes('hamburger')) {
      return { calories: 354, protein: 16, fat: 17, carbs: 33 };
    } else if (foodName.includes('sandwich')) {
      return { calories: 250, protein: 12, fat: 8, carbs: 30 };
    } else if (foodName.includes('salad')) {
      return { calories: 80, protein: 4, fat: 3, carbs: 12 };
    } else if (foodName.includes('pasta') || foodName.includes('spaghetti')) {
      return { calories: 280, protein: 10, fat: 6, carbs: 45 };
    } else if (foodName.includes('rice')) {
      return { calories: 130, protein: 3, fat: 0, carbs: 28 };
    } else if (foodName.includes('chicken')) {
      return { calories: 165, protein: 31, fat: 4, carbs: 0 };
    } else if (foodName.includes('fish')) {
      return { calories: 206, protein: 22, fat: 12, carbs: 0 };
    } else if (foodName.includes('bread')) {
      return { calories: 265, protein: 9, fat: 3, carbs: 49 };
    } else if (foodName.includes('apple') || foodName.includes('fruit')) {
      return { calories: 52, protein: 0, fat: 0, carbs: 14 };
    } else if (foodName.includes('vegetable') || foodName.includes('carrot') || foodName.includes('broccoli')) {
      return { calories: 25, protein: 1, fat: 0, carbs: 6 };
    } else if (foodName.includes('cake') || foodName.includes('dessert')) {
      return { calories: 350, protein: 4, fat: 15, carbs: 50 };
    } else if (foodName.includes('soup')) {
      return { calories: 120, protein: 6, fat: 4, carbs: 15 };
    } else if (foodName.includes('steak') || foodName.includes('beef')) {
      return { calories: 250, protein: 26, fat: 15, carbs: 0 };
    } else if (foodName.includes('pork')) {
      return { calories: 242, protein: 27, fat: 14, carbs: 0 };
    } else if (foodName.includes('lamb')) {
      return { calories: 294, protein: 25, fat: 21, carbs: 0 };
    } else if (foodName.includes('cheese')) {
      return { calories: 113, protein: 7, fat: 9, carbs: 1 };
    } else if (foodName.includes('milk')) {
      return { calories: 42, protein: 3, fat: 1, carbs: 5 };
    } else if (foodName.includes('egg')) {
      return { calories: 155, protein: 13, fat: 11, carbs: 1 };
    } else if (foodName.includes('banana')) {
      return { calories: 89, protein: 1, fat: 0, carbs: 23 };
    } else if (foodName.includes('orange')) {
      return { calories: 47, protein: 1, fat: 0, carbs: 12 };
    } else if (foodName.includes('potato')) {
      return { calories: 77, protein: 2, fat: 0, carbs: 17 };
    } else if (foodName.includes('onion')) {
      return { calories: 40, protein: 1, fat: 0, carbs: 9 };
    } else if (foodName.includes('tomato')) {
      return { calories: 18, protein: 1, fat: 0, carbs: 4 };
    } else if (foodName.includes('lettuce')) {
      return { calories: 15, protein: 1, fat: 0, carbs: 3 };
    } else if (foodName.includes('cucumber')) {
      return { calories: 16, protein: 1, fat: 0, carbs: 4 };
    } else if (foodName.includes('coffee')) {
      return { calories: 2, protein: 0, fat: 0, carbs: 0 };
    } else if (foodName.includes('tea')) {
      return { calories: 1, protein: 0, fat: 0, carbs: 0 };
    } else if (foodName.includes('water')) {
      return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    } else {
      // Default values for unknown foods
      return { calories: 200, protein: 10, fat: 8, carbs: 25 };
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !isUploading) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && !isUploading) {
      handleFileUpload(files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-input">
      {/* Text Input */}
      <div className="input-group">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a food name (e.g., 'Samosa', 'Dal Chawal')"
            className="food-input"
            disabled={isUploading}
          />
          <button
            onClick={handleSearch}
            className="search-button"
            disabled={!inputValue.trim() || isUploading}
          >
            🔍
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="divider">
        <span>or</span>
      </div>

      {/* Upload Area */}
      <div
        className={`upload-area ${dragActive ? "drag-active" : ""} ${
          isUploading ? "uploading" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
          disabled={isUploading}
        />

        {modelLoading ? (
          <div className="upload-content">
            <div className="loading-spinner"></div>
            <p className="upload-text">Loading AI Model...</p>
            <p className="upload-subtext">Preparing food recognition</p>
          </div>
        ) : isUploading ? (
          <div className="upload-content">
            <div className="loading-spinner"></div>
            <p className="upload-text">Analyzing your food...</p>
            <p className="upload-subtext">AI is identifying the dish</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📸</div>
            <p className="upload-text">
              {dragActive ? "Drop your food photo here" : "Upload a food photo"}
            </p>
            <p className="upload-subtext">
              {model ? "AI-powered food recognition ready" : "Drag & drop or click to browse"}
            </p>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="help-text">
        <p>
          💡 <strong>Tip:</strong> Type the food name for instant results, or
          upload a photo for real AI-powered food recognition using TensorFlow.js!
        </p>
        {model && (
          <p style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
            🤖 AI Model: MobileNetV2 loaded and ready
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadInput;
