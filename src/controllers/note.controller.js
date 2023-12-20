const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Note = require('../models/note.model');
const User = require('../models/user.model');

// @desc Get all notes
// @route GET /notes
// @access Private
module.exports.getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().populate('user', 'username');
  res.json(notes);
});

// @desc Create new note
// @route POST /api/notes
// @access Private
module.exports.createNote = asyncHandler(async (req, res) => {
  // check duplicate title
  // find user
  // if user found
  // create note
  const { user, title, text } = req.body;

  // Confirm data
  if (!user || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!mongoose.isValidObjectId(user)) {
    return res.status(400).json({ message: 'Invalid objectId for user field' });
  }

  // check if user not exist
  const userExists = await User.findById(user).lean();
  if (!userExists) {
    return res.status(400).send({ message: 'User not found. Correct user id required' });
  }

  // Create and store the new user
  const note = await Note.create({ user, title, text });

  if (!note) { // failed
    return res.status(400).json({ message: 'Invalid note data received' });
  }
  return res.status(201).json({ message: 'New note created' });
});

// @desc Update a note
// @route PATCH /api/notes/:id
// @access Private
module.exports.updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    user, title, text, completed,
  } = req.body;

  // Confirm data
  if (!user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Confirm note exists to update
  const noteExists = await Note.findById(id).exec();

  if (!noteExists) {
    return res.status(400).json({ message: 'Note not found' });
  }

  noteExists.user = user;
  noteExists.title = title;
  noteExists.text = text;
  noteExists.completed = completed;

  const updatedNote = await Note.findByIdAndUpdate(id, noteExists);

  res.json({ message: `'${updatedNote.title}' updated` });
});

// @desc Delete a note
// @route DELETE /api/notes/:id
// @access Private
module.exports.deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedNote = await Note.findByIdAndDelete(id);
  if (!deletedNote) {
    return res.status(400).json({ message: 'Note not found' });
  }

  const message = `Note '${deletedNote.title}' with ID ${deletedNote._id} deleted`;
  return res.json({ message });
});
