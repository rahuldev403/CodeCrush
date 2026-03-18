# CodeCrush

CodeCrush is a full-stack dating app for developers with swipe-style discovery, real-time chat, and AI-powered compatibility.

## Landing Page

![CodeCrush landing page](frontend/public/image.png)

## Highlights

- Developer-focused profiles and onboarding
- Match flow with requests, accepts, and rejects
- Real-time chat via Socket.io
- AI compatibility scoring (OpenAI)
- JWT auth with secure cookies

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Socket.io client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io
- Integrations: Cloudinary, OpenAI

## Quick Start

1. Install dependencies:

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. Create `backend/.env`:

   ```env
   PORT=8000
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Run the app:

   ```bash
   cd backend && npm run dev
   cd ../frontend && npm run dev
   ```

## Scripts

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=8000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OpenAI (for AI compatibility scoring)
OPENAI_API_KEY=your_openai_api_key
```

#### Frontend

No environment variables required. API URL is configured in `src/api/client.js`.

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   Server runs on `http://localhost:8000`

2. **Start the frontend dev server**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`

3. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/user/feed` - Get swipeable user feed
- `PUT /api/user/update` - Update user profile
- `POST /api/user/swipe` - Swipe left/right on a user
- `GET /api/user/matches` - Get all matches
- `GET /api/user/requests` - Get connection requests
- `POST /api/user/respond` - Accept/reject connection request

### Messages

- `GET /api/messages/:matchId` - Get chat messages
- `POST /api/messages/:matchId` - Send message
- `DELETE /api/messages/:messageId` - Delete message

## 🔌 Socket Events

### Client → Server

- `join-room` - Join chat room for a match
- `leave-room` - Leave chat room
- `send-message` - Send chat message
- `delete-message` - Delete sent message

### Server → Client

- `receive-message` - New message received
- `message-deleted` - Message was deleted
- `connection-request` - New connection request
- `connection-accepted` - Connection was accepted
- `connection-rejected` - Connection was rejected
- `compatibility-ready` - AI compatibility score ready
- `compatibility-error` - Error calculating compatibility

## 🎨 Custom Assets

All icon assets are custom PNG images with pixelated styling:

- `codecrush-text.png` - Main logo
- `feed.png`, `requests.png`, `match.png`, `user.png` - Navigation icons
- `save.png`, `sheild.png`, `key.png` - Profile action icons
- `postbox.png`, `calendar.png` - Empty state illustrations
- And more in `/frontend/public/`

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- bcrypt password hashing
- Socket.io authentication middleware
- Express rate limiting (200 requests per 15 minutes)
- CORS configuration
- Input validation with validator.js

## 🧪 Development Scripts

### Backend

```bash
npm run dev      # Start with nodemon (auto-reload)
npm run seed     # Seed database with sample users
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📝 Key Features Explained

### AI Compatibility Scoring

When two users match, the backend uses OpenAI's API to analyze their profiles (bio, interests, experience) and generate a compatibility score from 0-100 with a personalized explanation.

### Real-time Chat

Socket.io enables bidirectional communication for instant messaging. Users join room-based channels (by matchId) and messages are emitted to all participants in real-time.

### Global Loading Indicator

A custom `LoadingContext` provides app-wide loading states with customizable messages for better UX during async operations.

### Toast Notifications

Sonner library integrated with custom styling for pixelated theme. Notifications trigger on socket events like new matches, messages, and connection status updates.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

Built with 💖 by developers, for developers.

---

**Happy Matching! 💕✨**
