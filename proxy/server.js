const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Initialize Google AI
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || "AIzaSyAHfiukvkqZpV88kemfjhh9p5BWk5Qyz5A"
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "FoodLens AI Proxy is running" });
});

// Text classification endpoint
app.post("/api/classify-text", async (req, res) => {
  try {
    const { text, prompt } = req.body;
    
    if (!text) {
      return res.status(400).json({
        error: "No text provided",
        classification: null,
      });
    }

    // Initialize the model for text classification
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create the classification prompt
    const classificationPrompt = prompt || `
    Classify the following text and provide a JSON response with:
    {
      "category": "food-related category",
      "confidence": 0.95,
      "description": "brief description of the classification"
    }
    
    Text to classify: "${text}"
    `;

    // Generate content
    const result = await model.generateContent(classificationPrompt);
    const response = await result.response;
    const responseText = response.text();

    // Try to parse the JSON response
    let classification = null;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        classification = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Error parsing text classification response:", parseError);
      classification = {
        category: "Unknown",
        confidence: 0.5,
        description: responseText.substring(0, 100) + "...",
      };
    }

    res.json({
      success: true,
      classification: classification,
      rawResponse: responseText,
      message: "Text classified successfully",
    });
  } catch (error) {
    console.error("Error in text classification:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });

    res.json({
      success: false,
      classification: null,
      error: "Text classification failed",
      message: "AI service temporarily unavailable",
      details: error.message
    });
  }
});

// Food detection endpoint
app.post("/api/detect-food", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No image file provided",
        suggestions: [],
      });
    }

    // Get the image buffer
    const imageBuffer = req.file.buffer;
    const imageBase64 = imageBuffer.toString("base64");

    // Initialize the model for image classification
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create the prompt for food detection
    const prompt = `
    Analyze this food image and identify the dish. Return your response as a JSON array of objects with the following format:
    [
      {
        "name": "dish name",
        "confidence": 0.95,
        "description": "brief description of the food"
      }
    ]
    
    Focus on identifying Indian and international dishes. Return up to 3 suggestions ordered by confidence.
    If you cannot identify the food clearly, return an empty array.
    `;

    // Generate content
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let suggestions = [];
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw response:", text);

      // Fallback: try to extract dish names from the text
      const dishNames = text.match(
        /(?:dish|food|name)[\s:]*["']?([^"'\n,]+)["']?/gi
      );
      if (dishNames && dishNames.length > 0) {
        suggestions = dishNames.slice(0, 3).map((name, index) => ({
          name: name
            .replace(/(?:dish|food|name)[\s:]*["']?/gi, "")
            .replace(/["']/g, "")
            .trim(),
          confidence: 0.8 - index * 0.1,
          description: `AI detected food item ${index + 1}`,
        }));
      }
    }

    // Ensure suggestions is an array
    if (!Array.isArray(suggestions)) {
      suggestions = [];
    }

    // Limit to 3 suggestions and ensure proper format
    suggestions = suggestions.slice(0, 3).map((suggestion) => ({
      name: suggestion.name || suggestion.dish || "Unknown Food",
      confidence: Math.min(Math.max(suggestion.confidence || 0.5, 0), 1),
      description: suggestion.description || "AI detected food item",
    }));

    res.json({
      success: true,
      suggestions: suggestions,
      message:
        suggestions.length > 0
          ? "Food detected successfully"
          : "No food items detected",
    });
  } catch (error) {
    console.error("Error in food detection:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });

    // Return fallback suggestions for common foods
    const fallbackSuggestions = [
      {
        name: "Mixed Salad",
        confidence: 0.6,
        description: "AI fallback suggestion",
      },
      {
        name: "Sandwich",
        confidence: 0.5,
        description: "AI fallback suggestion",
      },
      {
        name: "Pasta",
        confidence: 0.4,
        description: "AI fallback suggestion",
      },
    ];

    res.json({
      success: false,
      suggestions: fallbackSuggestions,
      error: "AI processing failed, showing fallback suggestions",
      message: "AI service temporarily unavailable",
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File too large",
        message: "Please upload an image smaller than 5MB",
      });
    }
  }

  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong on the server",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: "The requested endpoint does not exist",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍽️  FoodLens AI Proxy running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Food detection: http://localhost:${PORT}/api/detect-food`);
  console.log(
    `🔑 Using API key: ${process.env.GEMINI_API_KEY ? "Set" : "Default (demo)"}`
  );
});

module.exports = app;
