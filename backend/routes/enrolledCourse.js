const express = require('express');
const router = express.Router();
const EnrolledCourse = require('../models/EnrolledCourse');
const verifyToken=require('../middleWares/auth');

router.post('/',verifyToken,async(request,response)=>{
  const { studentId, courseId, enrolledDate, status } = request.body;
  try{
    const existingEnrollment = await EnrolledCourse.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return response.status(400).json({ message: 'Already enrolled in this course!' });
    }

    const result = new EnrolledCourse({ studentId, courseId, enrolledDate, status });
    await result.save();
    response.status(200).json({ message: 'Data Added successfully!'});
  }catch(err){
    response.status(500).json({message:err});
  }
})

router.get('/:userId',verifyToken,async(request,response)=>{
  const { userId } = request.params; 
  try{
    const result = await EnrolledCourse.find({ studentId: userId });
    response.status(200).json(result);
  }catch(err){
    response.status(200).json({message:err});
  }
})


module.exports = router;