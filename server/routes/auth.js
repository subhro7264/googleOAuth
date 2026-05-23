const express = require('express');
const router = express.Router();
const passport = require('passport');
const {register,login,getMe,updateProfile,googleCallback,logout,} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Local Auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

// Protected Routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

// Google OAuth Routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
    session: false,
  }),
  googleCallback
);

module.exports = router;