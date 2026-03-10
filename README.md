# 🎌 AnimeFavorite

AnimeFavorite is a hobby full-stack application for managing anime and animated series collections.

Users can:
- track watched and planned anime
- rate titles and write reviews
- manage favorite characters
- upload avatars and covers
- maintain personal anime lists

The backend provides a REST API with session-based authentication and role-based authorization.

------------------------------------------------------------------------

## 📸 Preview

------------------------------------------------------------------------

## 🛠 Tech stack

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- express-session + connect-mongo
- Multer + Cloudinary (image uploads)
- Helmet, CORS, Rate limiting

**Frontend** - React (client folder)

------------------------------------------------------------------------

## 🚀 Installation

Choose **one** package manager:

### Using npm

``` bash
npm install
npm start
```

### Using yarn

``` bash
yarn install
yarn start
```

------------------------------------------------------------------------

## 🌍 Development environment

  Service    Address
  ---------- -----------------------
  Backend    http://localhost:3030
  Frontend   http://localhost:3000

------------------------------------------------------------------------

## ⚙️ Environment variables

Create a `.env` file in the root directory:

``` env
# ======================================
# APP
# ======================================
NODE_ENV=development
PORT=3030
APP_URL=http://localhost:3000

# ======================================
# DATABASE
# ======================================
DB_SESSIONSECRET=XXXXXXX
MONGO_URI_PROD=mongodb+srv://...
MONGO_URI_DEV=mongodb://127.0.0.1:27017/XXXXXXXXXX

# ======================================
# SESSION (EXPRESS SESSION)
# ======================================
SESSION_SECRET=XXXXXXXXXXXXXXXXXXXX
SESSION_NAME=anime.sid

# cookie settings
SESSION_MAX_AGE=604800000

# ======================================
# AUTH
# ======================================
BCRYPT_ROUNDS=10

# ======================================
# CLOUDINARY (UPLOADS)
# ======================================
CLOUDINARY_CLOUD_NAME=XXXXXXXXXXXXXXX
CLOUDINARY_API_KEY=XXXXXXXXXXXXXXXXX
CLOUDINARY_API_SECRET=XXXXXXXXXXXXXXXXXXXX

# ======================================
# RATE LIMIT
# ======================================
LOGIN_RATE_LIMIT_MAX=50
LOGIN_RATE_LIMIT_WINDOW=900000

# ======================================
# SECURITY
# ======================================
TRUST_PROXY=true
```

------------------------------------------------------------------------

## 🗄 Database

The application uses **MongoDB** as the primary database.

### Local development
By default, the app connects to:

mongodb://localhost:27017/animefavorite

This can be changed via the `.env` file:

``` env
MONGO_URI_DEV=mongodb://localhost:27017/animefavorite
```

## 🖼 Image uploads

Images (avatars, anime covers, character images) are uploaded using:

- Multer
- Cloudinary storage
- Automatic resizing & optimization

### Production

For production, a MongoDB Atlas cluster is recommended:
``` env
MONGO_URI_PROD=mongodb+srv://user:password@cluster.mongodb.net/animefavorite
```

The database stores:
- users and sessions
- anime titles
- seasons
- characters
- reviews and ratings
- user lists (watched, favorites, watchlist)

## 🌱 Seeding sample data

For development and testing purposes, the project includes a seed script
that populates the database with sample data.

The seed creates:
- 2 anime titles
- seasons for each anime
- characters linked to anime
- demo users
- sample reviews and ratings

### Running the seed

⚠️ Warning: This will remove existing data from the database.

``` bash
npm run seed
```
or

``` bash
node seed/seed.js
```

After seeding, the database will contain fully linked example data
ready for development and testing.

------------------------------------------------------------------------

## 🧱 Architecture

Backend follows MVC structure:
- Models (Mongoose schemas)
- Controllers (business logic)
- Routes (HTTP layer)
- Middleware (auth, uploads, validation)

------------------------------------------------------------------------

## 📁 Project structure

``` bash
.
├── client/           # React frontend
├── models/           # Mongoose models
├── routes/           # Express routes
├── controllers/      # Route controllers
├── seed/             # Data for seed to DB
├── db.js             # MongoDB connection
├── server.js         # Express server
└── .env              # Environment variables
```

------------------------------------------------------------------------

## 📡 API Overview

### Auth
POST /api/auth/register
POST /api/auth/login
DELETE /api/auth/logout

### Anime
GET /api/anime
GET /api/anime/:id
POST /api/anime (admin)
PUT /api/anime/:id (admin)

### User
GET /api/auth/user
PUT /api/auth/user
PUT /api/auth/user/avatar

------------------------------------------------------------------------

## 🔐 Authentication

- Session-based authentication (Express Session)
- MongoDB session store
- Role-based authorization (admin/user)
- Session fixation protection

------------------------------------------------------------------------

## 📌 Status

🧪 Hobby project -- under active development

------------------------------------------------------------------------

## 📜 License

GNU General Public License v3.0 