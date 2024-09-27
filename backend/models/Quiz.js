const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  id: {
    type: Number,  
    required: true,
  },
  value:{
    type:String,
    required:true,
  },
  correct: {
    type: Boolean,
    required: true,
  }
})

const quizSchema = new mongoose.Schema({
  question:{
    type:String,
    required:true
  },
  options: {
    type: [optionSchema],
    required:true
  },
  category: {
    type: String,
    default: 'HTML'
  },
}, { timestamps: true })


const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;