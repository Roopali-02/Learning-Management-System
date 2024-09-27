const mongoose = require('mongoose');

const courseSchema =new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
   instructorName: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  }
})

const Course = mongoose.model('Course', courseSchema)

module.exports = Course;