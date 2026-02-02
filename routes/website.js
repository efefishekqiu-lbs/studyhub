const express = require('express');
const router = express.Router();
const path = require('path');
const archiver = require('archiver');
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {
  createAuthToken,
  setAuthCookie,
  authGuard,
  clearAuth,
} = require('../lib/cookieLib.js')

const supabase = require('../lib/supabase');

router.get('/', async (req, res) => {
  res.render('dashboard')
});

module.exports = router;