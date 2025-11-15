# Auction Application - Complete Project Documentation

A full-stack MERN (MongoDB, Express, React, Node.js) application for creating and bidding on auctions with JWT authentication.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Frontend Routes](#frontend-routes)
- [Database Models](#database-models)
- [Complete User Flows](#complete-user-flows)
- [Authentication Flow](#authentication-flow)
- [Auction Flow](#auction-flow)

---

## ✨ Features

### Authentication
- User registration with email and password
- User login with JWT token authentication
- Protected routes for authenticated users
- Session persistence with localStorage

### Auction Management
- Create auctions with title, description, starting price, and end time
- View all active auctions
- View detailed auction information
- Real-time bid updates (auto-refresh every 5 seconds)
- Bidding history display
- Prevent owners from bidding on their own auctions
- Automatic auction status management (active/ended)

---

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

---

## 📁 Project Structure

```
auth2/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Auction.js           # Auction model
│   │   └── Bid.js              # Bid model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   └── auctions.js         # Auction routes
│   └── server.js               # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   └── NotFound.jsx   # 404 page
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Home page
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx   # Registration page
│   │   │   ├── Auctions.jsx    # Auctions list page
│   │   │   ├── CreateAuction.jsx # Create auction page
│   │   │   └── AuctionDetail.jsx  # Auction detail & bidding page
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   └── vite.config.js          # Vite configuration
└── .env                        # Environment variables (create this)
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Step 1: Clone/Download the Project
```bash
cd auth2
```

### Step 2: Install Backend Dependencies
```bash
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

**Important:** 
- Replace `username`, `password`, `cluster`, and `database` with your MongoDB Atlas credentials
- Use a strong, random string for `JWT_SECRET`
- Whitelist your IP address in MongoDB Atlas Network Access

### Step 5: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster (free tier is fine)
3. Create a database user
4. Get your connection string
5. Go to **Network Access** → **Add IP Address**
6. Click **"Add Current IP Address"** (or use `0.0.0.0/0` for development)
7. Wait 1-2 minutes for changes to propagate

---

## 🏃 Running the Project

### Start Backend Server
```bash
# From root directory
npm run dev
```

The backend will start on `http://localhost:5000`

### Start Frontend Server
```bash
# Open a new terminal
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

### Access the Application
Open your browser and navigate to: `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /api/users/register
```
**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### Login User
```
POST /api/users/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### Get Current User
```
GET /api/users/me
```
**Headers:**
```
Authorization: Bearer <token>
```
**Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Auction Endpoints

#### Get All Active Auctions
```
GET /api/auctions
```
**Response:**
```json
[
  {
    "_id": "auction_id",
    "title": "Vintage Watch",
    "description": "Beautiful vintage watch",
    "startingPrice": 100,
    "currentPrice": 150,
    "endTime": "2024-12-31T23:59:59.000Z",
    "createdBy": {
      "_id": "user_id",
      "username": "johndoe"
    },
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Single Auction
```
GET /api/auctions/:id
```
**Response:**
```json
{
  "auction": {
    "_id": "auction_id",
    "title": "Vintage Watch",
    "description": "Beautiful vintage watch",
    "startingPrice": 100,
    "currentPrice": 150,
    "endTime": "2024-12-31T23:59:59.000Z",
    "createdBy": {
      "_id": "user_id",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "status": "active"
  },
  "bids": [
    {
      "_id": "bid_id",
      "amount": 150,
      "bidder": {
        "_id": "user_id",
        "username": "janedoe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create Auction
```
POST /api/auctions
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "title": "Vintage Watch",
  "description": "Beautiful vintage watch from 1950s",
  "startingPrice": 100,
  "endTime": "2024-12-31T23:59:59.000Z"
}
```
**Response:**
```json
{
  "_id": "auction_id",
  "title": "Vintage Watch",
  "description": "Beautiful vintage watch from 1950s",
  "startingPrice": 100,
  "currentPrice": 100,
  "endTime": "2024-12-31T23:59:59.000Z",
  "createdBy": {
    "_id": "user_id",
    "username": "johndoe"
  },
  "status": "active"
}
```

#### Place a Bid
```
POST /api/auctions/:id/bid
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "amount": 150
}
```
**Response:**
```json
{
  "_id": "bid_id",
  "auction": "auction_id",
  "bidder": {
    "_id": "user_id",
    "username": "janedoe"
  },
  "amount": 150,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎨 Frontend Routes

| Route | Component | Description | Auth Required |
|-------|-----------|-------------|---------------|
| `/` | Home | Welcome page with links | No |
| `/login` | Login | User login form | No |
| `/register` | Register | User registration form | No |
| `/auctions` | Auctions | List all active auctions | No |
| `/auctions/create` | CreateAuction | Create new auction form | Yes |
| `/auctions/:id` | AuctionDetail | View auction details & bid | No |

---

## 🗄 Database Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Auction Model
```javascript
{
  title: String (required),
  description: String (required),
  startingPrice: Number (required, min: 0),
  currentPrice: Number (required, min: 0),
  endTime: Date (required),
  createdBy: ObjectId (ref: User, required),
  status: String (enum: ["active", "ended"], default: "active"),
  createdAt: Date,
  updatedAt: Date
}
```

### Bid Model
```javascript
{
  auction: ObjectId (ref: Auction, required),
  bidder: ObjectId (ref: User, required),
  amount: Number (required, min: 0),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Complete User Flows

### 1. Registration Flow
```
User visits /register
  ↓
Fills registration form (username, email, password)
  ↓
POST /api/users/register
  ↓
Backend validates & creates user
  ↓
JWT token generated & returned
  ↓
Token stored in localStorage
  ↓
User redirected to home page
  ↓
User state updated in App.jsx
```

### 2. Login Flow
```
User visits /login
  ↓
Fills login form (email, password)
  ↓
POST /api/users/login
  ↓
Backend validates credentials
  ↓
JWT token generated & returned
  ↓
Token stored in localStorage
  ↓
User redirected to home page
  ↓
User state updated in App.jsx
```

### 3. Create Auction Flow
```
Logged-in user clicks "Create Auction"
  ↓
Navigates to /auctions/create
  ↓
Fills auction form (title, description, startingPrice, endTime)
  ↓
POST /api/auctions (with JWT token)
  ↓
Backend validates & creates auction
  ↓
Auction saved to database
  ↓
User redirected to auction detail page
```

### 4. View Auctions Flow
```
User visits /auctions
  ↓
GET /api/auctions
  ↓
Backend returns all active auctions
  ↓
Auctions displayed in grid layout
  ↓
User clicks on an auction card
  ↓
Navigates to /auctions/:id
```

### 5. Bid on Auction Flow
```
User views auction detail page
  ↓
GET /api/auctions/:id (fetches auction + bids)
  ↓
User enters bid amount
  ↓
POST /api/auctions/:id/bid (with JWT token)
  ↓
Backend validates:
  - User is authenticated
  - Auction is active
  - User is not the owner
  - Bid amount > current price
  ↓
Bid created & saved
  ↓
Auction currentPrice updated
  ↓
Page auto-refreshes every 5 seconds
  ↓
New bid appears in bidding history
```

---

## 🔐 Authentication Flow

### JWT Token Generation
1. User registers/logs in
2. Backend generates JWT token with user ID
3. Token expires in 30 days
4. Token sent to frontend in response

### Protected Routes
1. Frontend sends request with `Authorization: Bearer <token>` header
2. Backend middleware (`protect`) verifies token
3. If valid, extracts user ID and fetches user from database
4. User object attached to `req.user`
5. Route handler can access authenticated user

### Frontend Authentication State
1. On app load, checks localStorage for token
2. If token exists, calls `GET /api/users/me`
3. User state updated if token is valid
4. Token removed if invalid/expired

---

## 🎯 Auction Flow

### Auction Lifecycle
1. **Creation**: User creates auction with end time
2. **Active**: Auction is open for bidding
3. **Bidding**: Users place bids (must be > current price)
4. **Updates**: Current price updates with each bid
5. **Ending**: Auction ends when endTime is reached
6. **Status**: Auction status changes to "ended"

### Bid Validation Rules
- ✅ User must be authenticated
- ✅ Auction must be active
- ✅ User cannot bid on own auction
- ✅ Bid amount must be > current price
- ✅ End time must not have passed

### Real-time Updates
- Auction detail page auto-refreshes every 5 seconds
- Latest bids and current price are fetched
- Highest bid is highlighted in green
- Bidding history sorted by amount (descending)

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Error:** `Could not connect to any servers in your MongoDB Atlas cluster`

**Solution:**
1. Check your `.env` file has correct `MONGO_URI`
2. Whitelist your IP in MongoDB Atlas Network Access
3. Wait 1-2 minutes after whitelisting
4. Verify database user credentials

### Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
- Change `PORT` in `.env` file
- Or kill the process using port 5000

### CORS Errors
**Solution:**
- Vite proxy is configured in `vite.config.js`
- Ensure backend is running on port 5000
- Check proxy configuration matches backend port

---

## 📝 Notes

- Passwords are hashed using bcryptjs before storage
- JWT tokens expire after 30 days
- Auction status is checked on bid attempts
- Frontend auto-refreshes auction details every 5 seconds
- All prices are stored as numbers (floats for decimals)

---

## 🚧 Future Enhancements

- [ ] Email notifications for outbid users
- [ ] Auction search and filtering
- [ ] User profile pages
- [ ] Auction categories/tags
- [ ] Image upload for auctions
- [ ] Payment integration
- [ ] Real-time WebSocket updates
- [ ] Auction watchlist/favorites
- [ ] Bid history for users
- [ ] Admin dashboard

---

## 📄 License

This project is open source and available for educational purposes.

---

## 👤 Author

Created as a full-stack MERN application with authentication and auction functionality.

