const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const verifyToken = require('../middleWares/auth');


router.post('/', async (request, response) => {
  const { question, options,category } = request.body;
  try {
    const newQuestion = new Quiz({ question, options,category });
    await newQuestion.save();
    return  response.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    response.status(500).json({ message: 'Error!' });
  }
})

router.get('/',async(request,response)=>{
   try{
     const page = parseInt(request.query.page) || 1;
     const limit = parseInt(request.query.limit) || 10; 
     const skip = (page-1) * limit;
     const questions = await Quiz.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
     const totalQuestions = await Quiz.countDocuments();
     response.status(200).json({ questions, totalQuestions });
   }catch(err){
     response.status(500).json({message:err})
   }
})

router.put('/update-question/:id',async(request,response)=>{
  try{
    const updatedQuestion = await Quiz.findByIdAndUpdate(request.params.id, request.body, { new: true });
    response.status(200).json(updatedQuestion);
  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

router.delete('/delete-question/:id',async(request,response)=>{
  try{
    await Quiz.findByIdAndDelete(request.params.id);
    response.status(200).json({message:'Question deleted successfully!'});
  }catch(err){
    response.status(500).json({message:err.message});
  }
})

module.exports = router;