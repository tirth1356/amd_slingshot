const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const supabase = require('../services/supabaseService');
const { generateDietPlan, chatWithAI } = require('../services/groqService');

// Generate AI diet plan
router.post('/generate', auth, async (req, res) => {
  try {
    // Get full profile
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', req.user.id).single();

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const plan = await generateDietPlan({ ...profile, ...req.body });

    // Save to DB
    await supabase.from('diet_plans').insert({
      user_id: req.user.id,
      plan_data: plan,
      valid_from: new Date().toISOString().split('T')[0],
      valid_to: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    });

    res.json({ plan });
  } catch (err) {
    console.error('Diet generation error:', err);
    res.status(500).json({ error: 'Failed to generate diet plan: ' + err.message });
  }
});

// Get latest active diet plan
router.get('/current', auth, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('diet_plans')
    .select('*')
    .eq('user_id', req.user.id)
    .lte('valid_from', today)
    .gte('valid_to', today)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  res.json(data || null);
});

// AI Chat
router.post('/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', req.user.id).single();

    // Get today's meals for context
    const today = new Date().toISOString().split('T')[0];
    const { data: meals } = await supabase
      .from('meals').select('*').eq('user_id', req.user.id)
      .gte('eaten_at', today);

    const reply = await chatWithAI(message, profile, meals || []);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
