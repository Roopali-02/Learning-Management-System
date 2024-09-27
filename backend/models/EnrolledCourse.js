const mongoose = require('mongoose');

const enrolledCourseSchema = new mongoose.Schema({
  studentId:{
    type:String,
    required:true
  },
  courseId:{
    type: String,
    required: true
  },
  enrolledDate: {
    type:Date,
    required: true,
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true })


const EnrolledCourse = mongoose.model('EnrolledCourse', enrolledCourseSchema);

module.exports = EnrolledCourse;