const express = require('express');

const router = express.Router();

const Course = require('../models/Course');

const verifyToken = require('../middleWares/auth');

router.post('/',async(req,res)=>{
  const { title, description, category, instructor, startDate, endDate, level } = req.body;
  try{
    const newCourse = new Course({
      title,
      description,
      category,
      instructorName: instructor,
      startDate,
      endDate,
      level
    });
    await newCourse.save();
    return res.status(200).json({ message: 'Data Added!' });
  }catch(err){
    res.status(500).json({ error: 'Failed to add course' });
  }
})

router.get('/',async(request,response)=>{
  try{
    const result = await Course.find();
    response.status(200).json(result);
  }catch(err){
    response.status(500).json({message:err});
  }
})

router.delete('/delete-course/:id',async(request,response)=>{
    try{
      await Course.findByIdAndDelete(request.params.id);
      response.status(200).json({message:'Course deleted successfully'});
    }catch(err){
      response.status(500).json({ message: `Error deleting course: ${err}` });
    }
})

module.exports = router;