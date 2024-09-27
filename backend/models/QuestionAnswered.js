const mongoose = require('mongoose');


const answeredOptionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  chosen: {
    type: Number,
    required: true
  },
}, { _id: false });


const answeredQuestionsSchema = new mongoose.Schema({
  studentId:{
    type: String,
    required: true
  },
  options: [answeredOptionSchema], 

},{timestamps:true})


const AnsweredOptions = mongoose.model('AnsweredOptions', answeredQuestionsSchema);

module.exports = AnsweredOptions;