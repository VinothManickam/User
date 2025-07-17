require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

const app = express();

const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created Uploads directory');
}

connectDB();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
