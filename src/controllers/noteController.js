const Note = require('../models/Note');

// @desc    Get all notes for current user with optional search and tag filters
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const { search, tag, isPinned } = req.query;
    const filter = { user: req.user._id };

    if (tag && tag.trim() !== '') {
      filter.tags = { $regex: new RegExp(`^${tag.trim()}$`, 'i') };
    }

    if (isPinned !== undefined) {
      filter.isPinned = isPinned === 'true';
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Pinned notes first, then newest updated first
    const notes = await Note.find(filter).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, color, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the note',
      });
    }

    // Process tags array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => t.trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const note = await Note.create({
      title,
      content,
      tags: processedTags,
      color: color || '#1e293b',
      isPinned: Boolean(isPinned),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized',
      });
    }

    const { title, content, tags, color, isPinned } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (color !== undefined) note.color = color;
    if (isPinned !== undefined) note.isPinned = Boolean(isPinned);

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        note.tags = tags.map((t) => t.trim()).filter(Boolean);
      } else if (typeof tags === 'string') {
        note.tags = tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle pin status for a note
// @route   PATCH /api/notes/:id/pin
// @access  Private
const togglePinNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized',
      });
    }

    note.isPinned = !note.isPinned;
    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: `Note ${updatedNote.isPinned ? 'pinned' : 'unpinned'} successfully`,
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct tags of all notes belonging to the current user
// @route   GET /api/notes/tags/all
// @access  Private
const getUserTags = async (req, res, next) => {
  try {
    const tags = await Note.distinct('tags', { user: req.user._id });
    res.status(200).json({
      success: true,
      tags: tags.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePinNote,
  deleteNote,
  getUserTags,
};
