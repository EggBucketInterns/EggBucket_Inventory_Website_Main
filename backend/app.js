// app.js
const express = require("express")
const path = require("path")
const routes = require(path.join(__dirname, ".", "routes"))
const { initializeApp } = require("firebase/app")
const cors = require("cors")
const cookieParser = require('cookie-parser');

const firebaseConfig = {
  apiKey: "AIzaSyCI8lZ8socew2H-JAmNmhnIisF-MBvMM5s",
  authDomain: "scannerapp-4448f.firebaseapp.com",
  projectId: "scannerapp-4448f",
  storageBucket: "scannerapp-4448f.appspot.com",
  messagingSenderId: "822303664619",
  appId: "1:822303664619:web:cca5457ac63e669f9e11ae",
  measurementId: "G-S4S64HK08Y"
};

const app = express()
const cloud = initializeApp(firebaseConfig);

// Increase payload limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Updated CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 3600
}))

app.use(express.static(path.join(__dirname, "..", "frontend", "build")))
app.use('/', routes)

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

// Create server with proper error handling and timeouts
const server = app.listen(5000, '0.0.0.0', () => {
  console.log("Server started on port 5000") // Fixed port number in console log
})

// Set timeout values
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 121000;   // Slightly higher than keepAliveTimeout

// Error handling
server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
