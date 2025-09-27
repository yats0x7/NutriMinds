# FoodLens AI Vision Proxy

This is an optional proxy server that provides AI-powered food detection for the FoodLens app using Google's Gemini API.

## Features

- 🍽️ **Food Detection**: Uses Google Gemini AI to identify food items in uploaded images
- 🔒 **API Key Protection**: Keeps your API keys secure on the server side
- 📱 **CORS Enabled**: Works with the React frontend
- 🛡️ **Error Handling**: Graceful fallbacks when AI service is unavailable
- 📊 **File Size Limits**: Prevents abuse with 5MB upload limit

## Setup

### 1. Install Dependencies

```bash
cd proxy
npm install
```

### 2. Set Environment Variables

Create a `.env` file in the proxy directory:

```bash
# Optional: Set your own Gemini API key
GEMINI_API_KEY=your_api_key_here

# Optional: Set custom port (default: 3001)
PORT=3001
```

**Note**: The server includes a demo API key, but for production use, you should:

1. Get your own API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Set the `GEMINI_API_KEY` environment variable
3. Never commit API keys to version control

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /health
```

Returns server status and configuration.

### Food Detection

```
POST /api/detect-food
Content-Type: multipart/form-data
Body: image file
```

**Response:**

```json
{
  "success": true,
  "suggestions": [
    {
      "name": "Samosa",
      "confidence": 0.95,
      "description": "Fried pastry with spiced filling"
    }
  ],
  "message": "Food detected successfully"
}
```

## Integration with FoodLens

The FoodLens app automatically detects if the proxy is running and enables AI features. To connect:

1. Start the proxy server
2. Start the FoodLens app (`npm run dev`)
3. Upload a food photo in the app
4. AI suggestions will appear alongside local database matches

## Troubleshooting

### Common Issues

**"AI processing failed"**

- Check if the API key is valid
- Ensure the image file is under 5MB
- Check server logs for detailed error messages

**"CORS error"**

- Make sure the proxy server is running
- Check that the frontend is making requests to the correct port

**"No suggestions returned"**

- The AI might not recognize the food item
- Try uploading a clearer image
- Check if the image contains visible food

### Logs

The server logs all requests and errors to the console. Check the terminal where you started the server for debugging information.

## Security Notes

- The proxy server should only be used in development or behind proper authentication
- Never expose API keys in client-side code
- Consider rate limiting for production use
- Validate and sanitize all inputs

## Development

To modify the AI prompt or add new features:

1. Edit `server.js`
2. Modify the prompt in the `/api/detect-food` endpoint
3. Restart the server with `npm run dev`

## Production Deployment

For production deployment:

1. Set up proper environment variables
2. Use a process manager like PM2
3. Set up reverse proxy (nginx)
4. Enable HTTPS
5. Implement rate limiting
6. Add proper logging and monitoring

---

**Note**: This proxy is optional. The FoodLens app works perfectly without it using the local food database and manual input.
