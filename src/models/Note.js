const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a note title'],
      trim: true,
      maxlength: [120, 'Title cannot be more than 120 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add note content'],
    },
    tags: {
      type: [String],
      default: [],
    },
    color: {
      type: String,
      default: '#1e293b', // Sleek dark slate default card color
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search optimization
noteSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);
