const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const dashboardRoute = require('./routes/dashboardRouter');
const courseRoute = require('./routes/resource');
const quizRoute = require('./routes/quizRoute');
const enrolledCourseRoute = require('./routes/enrolledCourse');
const answeredOptions = require('./routes/answeredOptions');
//Setting up environmental variables
dotenv.config();

const app = express();

//Middleware
app.use(express.json())
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/add-course', courseRoute);
app.use('/api/courses', courseRoute);
app.use('/api/add-question', quizRoute);
app.use('/api/questions', quizRoute);
app.use('/api/enroll-course', enrolledCourseRoute);
app.use('/api/enrolled-courses', enrolledCourseRoute);
app.use('/api/answered-options', answeredOptions);


mongoose.connect(process.env.MONGO_URI).then(()=>{console.log('MongoDB Connected!')}).catch(err=>console.log('MongoDB Connection error:',err))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));