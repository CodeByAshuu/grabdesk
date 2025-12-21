const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins for development (restrict in production)
    methods: ['GET', 'POST']
  }
});

// Create /activity namespace for activity logs
const activityNamespace = io.of('/activity');

activityNamespace.on('connection', (socket) => {
  console.log('Client connected to activity logs');

  socket.on('disconnect', () => {
    console.log('Client disconnected from activity logs');
  });
});

// Make io available to controllers via app
app.set('io', io);

// Enable CORS before body parser to handle preflight requests
app.use(cors({
  origin: '*',  // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser (after CORS) with increased limit for base64 images
app.use(express.json({ limit: '50mb' }));  // Increase from default 100kb to 50mb
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

const PORT = process.env.PORT || 5000;
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO ready at /activity namespace`);
});
