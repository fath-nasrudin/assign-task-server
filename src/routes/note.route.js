const router = require('express').Router();
const noteController = require('../controllers/note.controller');

router.route('/')
  .get(noteController.getAllNotes)
  .post(noteController.createNote);

router.route('/:id')
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);
module.exports = router;
