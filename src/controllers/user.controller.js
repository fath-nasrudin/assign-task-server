const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const Note = require('../models/note.model');

// @desc Get all users
// @route GET /api/users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  return res.json(users);
});

// @desc Get a user by its id
// @route GET /api/users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Get user by its id
  const user = await User.findById(id).select('-password');

  res.json(user);
});

// @desc Create a user
// @route POST /api/users
// @access Private
const createUser = asyncHandler(async (req, res) => {
  // validation and sanitization
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // check for duplicate username
  const userExists = await User.findOne({ username }).lean();
  if (userExists) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    username,
    password: hashedPassword,
  };

  // Create and store new user
  const user = await User.create(userData);

  if (!user) {
    return res.status(400).json({ message: 'Invalid user data received' });
  }
  return res.status(201).json({ message: `New user ${username} created` });
});

// @desc Update a user
// @route PUT /users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    username, roles, active, password,
  } = req.body;

  // Confirm data
  if (!username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields except password are required' });
  }

  // Does the user exist to update?
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Update a user
// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Does the user still have assigned notes?
  const note = await Note.findOne({ user: id }).lean();
  if (note) {
    return res.status(400).json({ message: 'User has assigned notes' });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const result = await User.findByIdAndDelete(id);

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
