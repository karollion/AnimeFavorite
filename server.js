/* ENV */
require('dotenv').config()

/* Imports */
const path = require('path')
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const helmet = require('helmet')

const connectToDB = require('./db')

/* Routes */
const animeRoutes = require('./routes/anime.routes')
const authRoutes = require('./routes/auth.routes')

const app = express()

/* ======================
   SECURITY & MIDDLEWARE
====================== */

app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))

if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true
    })
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ======================
   START SERVER
====================== */

const startServer = async () => {
  await connectToDB()

  app.use(
    session({
      name: process.env.SESSION_NAME,
      secret: process.env.DB_SESSIONSECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl:
          process.env.NODE_ENV === 'production'
            ? process.env.MONGO_URI_PROD
            : process.env.MONGO_URI_DEV,
        collectionName: 'sessions'
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
		maxAge: Number(process.env.COOKIE_MAX_AGE)
      }
    })
  )

  /* ROUTES */
  app.use('/api', animeRoutes)
  app.use('/api/auth', authRoutes)

  /* STATIC */
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(express.static(path.join(__dirname, 'client/build')))

  app.use((req, res) => {
    res.status(404).json({ message: '404 Not found...' })
  })

  const PORT = process.env.PORT || 3030
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()