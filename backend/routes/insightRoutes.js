const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const supabase = require('../services/supabaseService');
const { generateWeeklyInsights } = require('../services/groqService');

router.get('/weekly', auth, async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { data: meals } = await supabase
      .from('meals').select('*')
      .eq('user_id', req.user.id)
      .gte('eaten_at', weekAgo);

    const { data: profile } = await supabase
      .from('profiles').select('*').eq('id', req.user.id).single();

    const insights = await generateWeeklyInsights(profile, meals || []);

    // Cache insight
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    await supabase.from('insights').upsert({
      user_id: req.user.id,
      week_start: weekStart.toISOString().split('T')[0],
      insight_data: insights
    }, { onConflict: 'user_id,week_start' });

    res.json(insights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
