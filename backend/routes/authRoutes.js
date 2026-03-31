const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseService');

// Register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'Email, password, and name required' });

  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name } }
  });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user, session: data.session });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json({ user: data.user, session: data.session, token: data.session.access_token });
});

module.exports = router;
