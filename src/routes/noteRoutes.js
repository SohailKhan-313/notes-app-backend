const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePinNote,
  deleteNote,
  getUserTags,
} = require('../controllers/noteController');
const { authenticateUser } = require('../middlewares/authMiddleware');

// All note routes require Passport authentication
router.use(authenticateUser);

router.route('/')
  .get(getNotes)
  .post(createNote);

router.get('/tags/all', getUserTags);

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

router.patch('/:id/pin', togglePinNote);

module.exports = router;
