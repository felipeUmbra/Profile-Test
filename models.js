// models.js
const mongoose = require('mongoose');

// 1. Question Schema (Same as before)
const questionSchema = new mongoose.Schema({
  testType: { type: String, required: true, index: true },
  order: Number,
  text: { en: String, pt: String, es: String },
  factor: String, 
  reverse: Boolean, 
  options: { 
    optionA: { en: String, pt: String, es: String },
    optionB: { en: String, pt: String, es: String }
  },
  dimension: String, 
  values: { a: String, b: String } 
});

// 2. Result Schema (Same as before)
const resultSchema = new mongoose.Schema({
  sessionId: String,
  testType: String,
  scores: mongoose.Schema.Types.Mixed,
  profileKey: String,
  timestamp: { type: Date, default: Date.now }
});

// 3. NEW: Progress Schema (To fix the error)
const progressSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  testType: String,
  currentQuestion: Number,
  answers: [{
    questionId: Number,
    rating: mongoose.Schema.Types.Mixed, // Can be number or string value
    factor: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = {
  Question: mongoose.model('Question', questionSchema),
  Result: mongoose.model('Result', resultSchema),
  Progress: mongoose.model('Progress', progressSchema) // Export the new model
};