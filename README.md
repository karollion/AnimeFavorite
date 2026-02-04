# 🎌 AnimeFavorite

AnimeFavorite is a hobby project for storing and managing anime and
cartoon titles you have watched, want to watch, or marked as favorites.

The app allows you to store: - anime titles - seasons and ratings -
characters - genres, worlds, categories - personal reviews and
opinions - cover images (Google Drive links) - multi-user accounts with
sessions

------------------------------------------------------------------------

## 🛠 Tech stack

**Backend** - Node.js - Express - MongoDB + Mongoose - express-session +
connect-mongo - Helmet, CORS

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
NODE_ENV=development
PORT=3030

DB_SESSIONSECRET=your_super_secret_key

MONGO_URI_DEV=mongodb://localhost:27017/animefavorite
MONGO_URI_PROD=mongodb+srv://user:password@cluster.mongodb.net/animefavorite

SESSION_NAME=anime.sid
COOKIE_MAX_AGE=604800000
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

## 🔐 Authentication

-   Session-based authentication
-   Sessions stored in MongoDB
-   Multi-user ready

------------------------------------------------------------------------

## 📌 Status

🧪 Hobby project -- under active development

Planned features: - user statistics - anime ratings aggregation - search
& filters - user roles (admin / user)

------------------------------------------------------------------------

## 📜 License

GNU General Public License v3.0 