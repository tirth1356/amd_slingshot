const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const supabase = require('../services/supabaseService');

// Get meals for a date
router.get('/', auth, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('meals').select('*')
    .eq('user_id', req.user.id)
    .gte('eaten_at', date + 'T00:00:00')
    .lte('eaten_at', date + 'T23:59:59')
    .order('eaten_at');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Log a meal
router.post('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('meals')
    .insert({ ...req.body, user_id: req.user.id })
    .select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete a meal
router.delete('/:id', auth, async (req, res) => {
  const { error } = await supabase
    .from('meals').delete()
    .eq('id', req.params.id).eq('user_id', req.user.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
