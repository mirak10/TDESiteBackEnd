const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/admin'); // if you already have admin auth
const teamRoutes = require('./routes/teamRoutes'); // 💥 Add this line
const newsRoutes = require('./routes/newsRoutes');
const eventRoutes = require('./routes/eventRoutes');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/team', teamRoutes); // 💥 Add this line
app.use('/api/news', newsRoutes);
app.use('/api/events', eventRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
