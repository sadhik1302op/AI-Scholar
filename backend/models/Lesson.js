const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  content: [{
    type: Object, // Structured content like { type: 'text', value: '...' }
    required: true,
  }]
}, { timestamps: true });

module.exports = mongoose.model('Lesson', lessonSchema);
