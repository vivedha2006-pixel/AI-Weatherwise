# AI WeatherWise API

AI WeatherWise API is a RESTful backend application built with **Node.js, Express.js, MongoDB, and Mongoose**. It features secure JWT authentication with password hashing (bcrypt), custom favorite locations tracking, and Generative AI integrations (Google Gemini) to deliver intelligent weather summaries and personalized recommendations based on real-time metrics.

## Features
- **User Authentication**: Secure signup, login, and profile lookup endpoints using bcrypt password hashing and JWT token authorization.
- **Favorite Locations Management**: Users can manage their list of favorite locations (add, get, update, and delete locations).
- **Current Weather Retrieval**: Fetches temperature, humidity, wind speed, and weather condition from OpenWeatherMap.
- **AI Weather Insights**: Leverage the Google Gemini API to dynamically generate context-aware weather summaries and recommendations (e.g. hydration, clothing, activities).
- **Resilient Fallback Mode**: If you don't have OpenWeatherMap or Gemini API keys configured, the application automatically triggers local, deterministic rule-based mock generators so the API remains fully functional and testable out-of-the-box.

---

## Technology Stack
- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database Wrapper**: Mongoose ODM
- **Database**: MongoDB Atlas or Local MongoDB
- **Security**: JWT (jsonwebtoken), bcryptjs
- **AI Integration**: `@google/generative-ai` (Google Gemini API)

---

## Project Structure (MVC)
```
src/
├── config/
│   └── db.js               # MongoDB connection setup
├── models/
│   ├── User.js             # User Schema (name, email, password)
│   └── Location.js         # Location Schema (city, country, user, createdAt)
├── middleware/
│   └── authMiddleware.js   # JWT Auth Guard middleware
├── controllers/
│   ├── authController.js   # Handlers for auth endpoints
│   ├── locationController.js # Handlers for favorites CRUD
│   ├── weatherController.js # Fetch weather data
│   └── aiController.js     # Orchestrate Gemini AI generations
├── routes/
│   ├── authRoutes.js
│   ├── locationRoutes.js
│   ├── weatherRoutes.js
│   └── aiRoutes.js
├── services/
│   ├── weatherService.js   # Fetch API query + mock fallback logic
│   └── aiService.js        # Gemini SDK client + local fallback logic
├── app.js                  # App middlewares and routes setup
└── server.js               # Entry point - starts server & DB
```

---

## Quick Start Guide

### 1. Prerequisites
Make sure you have **Node.js (v18+)** and **npm** installed on your system.

### 2. Install Dependencies
Run the following command in the project root:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/weatherwise
JWT_SECRET=your_super_secret_jwt_key_12345!
OPENWEATHER_API_KEY=your_openweathermap_api_key
GEMINI_API_KEY=your_gemini_api_key
```
> **Note on API Keys**: If you leave the `OPENWEATHER_API_KEY` and `GEMINI_API_KEY` with placeholder values, the app will gracefully fall back to returning stable, generated mock response objects so that you can verify and test all endpoints immediately.

### 4. Run the Server
For development mode with hot reloading (built-in file watcher):
```bash
npm run dev
```
For production start:
```bash
npm start
```
The server will start listening on `http://localhost:5000`.

---

## API Documentation

### 1. User Authentication
| Endpoint | Method | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | `{ "name", "email", "password" }` | Register a new user and get a JWT token. |
| `/api/auth/login` | `POST` | Public | `{ "email", "password" }` | Log in and get a JWT token. |
| `/api/auth/profile` | `GET` | Private (JWT) | *None* | Get logged-in user profile details. |

### 2. Location Management (Private / JWT required)
| Endpoint | Method | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/locations` | `POST` | Private | `{ "city", "country" }` | Save a new favorite city. |
| `/api/locations` | `GET` | Private | *None* | Retrieve all saved favorite cities for the user. |
| `/api/locations/:id` | `PUT` | Private | `{ "city", "country" }` | Update a favorite city by ID. |
| `/api/locations/:id` | `DELETE` | Private | *None* | Delete a favorite city by ID. |

### 3. Weather Fetching
| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/weather/:city` | `GET` | Public | Returns current weather metrics (temperature, humidity, wind speed, condition) for a city. |

### 4. AI Weather Insights (Private / JWT required)
| Endpoint | Method | Access | Request Body | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/ai/weather-summary` | `POST` | Private | `{ "city", "temperature", "humidity", "condition" }` | Generates a natural language weather summary. |
| `/api/ai/weather-recommendation` | `POST` | Private | `{ "temperature", "condition" }` | Generates personalized suggestions (clothing, activities). |

---

## API Testing using Postman
To test all endpoints:
1. Import the `postman_collection.json` file located in the project root into your Postman application.
2. The collection has pre-saved example payloads for registration, login, profile queries, location management, weather search, and AI queries.
3. The registration and login endpoints are set up with test scripts that capture the JWT token and save it to the collection variable `token` automatically. This allows you to call all subsequent private endpoints without manually copying the token.
