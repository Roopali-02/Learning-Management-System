const express = require('express');
const router = express.Router();
const AnsweredOptions = require('../models/QuestionAnswered');
const verifyToken = require('../middleWares/auth');

router.post('/',verifyToken,async(request,response)=>{
  const { studentId, options } = request.body;
  if (!Array.isArray(options)) {
    return response.status(400).json({ message: 'Options must be an array of answers' });
  }
  try{
    const existingRecord = await AnsweredOptions.findOne({ studentId });
    if (existingRecord){
      existingRecord.options = options;
      await existingRecord.save();
      return response.status(200).json({ message: 'Answers updated successfully!' });
    }
    const result = new AnsweredOptions({ studentId, options });
    await result.save();
    response.status(200).json({ message: 'Answers saved successfully!',result})
  }catch(err){
    response.status(500).json({ message: err.message }); 
  }
})

router.get('/:userId',verifyToken,async(request,response)=>{
  const { userId } = request.params; 
  try{
    const result = await AnsweredOptions.find({ studentId: userId });
    response.status(200).json(result);
  }catch(err){
    response.status(500).json({message:err});
  }
})
module.exports = router;