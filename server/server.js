require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const quizRoutes = require('./routes/quizRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const lecture = require('./routes/lecture.js');
const courseRoutes = require('./routes/courseRoutes');
const progrroutes = require('./routes/progressRoutes.js');
const path = require('path');
const app = express();
connectDB();

app.use(express.json());

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/lecture', lecture);
app.use('/api/quizzes', quizRoutes);
app.use('/progress', progrroutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





