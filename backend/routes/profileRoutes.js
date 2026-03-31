const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const supabase = require('../services/supabaseService');
const { calcBMR, calcTDEE, calcCalorieTarget, calcMacros, calcBMI } = require('../utils/nutritionCalc');

router.get('/', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('profiles').select('*').eq('id', req.user.id).single();
  if (error || !data) return res.status(200).json({ _is_new: true }); // Return mock profile so frontend doesn't crash on newly registered auth without profile record
  res.json(data);
});

router.put('/', auth, async (req, res) => {
  const body = req.body;

  // Recalculate nutrition targets if body metrics present
  if (body.weight_kg && body.height_cm && body.age && body.gender) {
    body.bmi = calcBMI(body.weight_kg, body.height_cm);
    body.bmr = Math.round(calcBMR(body.weight_kg, body.height_cm, body.age, body.gender));
    body.tdee = calcTDEE(body.bmr, body.activity_level || 'moderate');
    body.daily_calorie_target = calcCalorieTarget(body.tdee, body.health_goal || 'maintain');
    const macros = calcMacros(body.daily_calorie_target, body.health_goal, body.diet_type);
    Object.assign(body, macros);
  }

  body.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('profiles').upsert({ id: req.user.id, ...body }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
