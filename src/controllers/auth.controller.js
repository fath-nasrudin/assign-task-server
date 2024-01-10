const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // make sure all fields filled
  if (!username || !password) return res.status(400).json({ message: 'all fields required' });

  // find user by username
  const foundUser = await User.findOne({ username });

  if (!foundUser || !foundUser.active) return res.status(401).json({ message: 'Unauthorized' });

  const matchPassword = await bcrypt.compare(password, foundUser.password);

  if (!matchPassword) return res.status(401).json({ message: 'Unauthorized' });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10',
    },

  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  );

  // Create secure cookie with refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = asyncHandler(async (req, res) => {
  // accept refresh token
  const { cookies } = req;

  // check if the cookies have jwt
  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (async (error, decoded) => {
      if (error) return res.status(403).json({ message: 'Forbidden' });

      const foundUser = await User.findOne({ username: decoded.username }).exec();

      if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' },
      );

      return res.json({ accessToken });
    }),
  );
});

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = asyncHandler(async (req, res) => {
  const { cookies } = req;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  return res.json({ message: 'Cookie cleared' });
});

module.exports = { login, refresh, logout };
