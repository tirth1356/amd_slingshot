/**
 * Mifflin-St Jeor BMR formula
 * Activity multipliers for TDEE
 * Macro split based on goal
 */

const ACTIVITY_MULTIPLIERS = {
  sedentary:         1.2,
  light:             1.375,
  moderate:          1.55,
  very_active:       1.725,
  extremely_active:  1.9
};

const MEAL_SPLITS = {
  1: ['lunch'],
  2: ['breakfast','dinner'],
  3: ['breakfast','lunch','dinner'],
  4: ['breakfast','lunch','dinner','evening_snack'],
  5: ['breakfast','morning_snack','lunch','evening_snack','dinner'],
  6: ['breakfast','morning_snack','lunch','evening_snack','dinner','late_snack']
};

function calcBMR(weight_kg, height_cm, age, gender) {
  if (gender === 'male') {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    return 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
}

function calcTDEE(bmr, activity_level) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity_level] || 1.55));
}

function calcCalorieTarget(tdee, goal) {
  const adjustments = {
    lose_weight:     -500,
    gain_muscle:     +300,
    maintain:        0,
    improve_health:  -200,
    boost_energy:    +100
  };
  return Math.max(1200, tdee + (adjustments[goal] || 0));
}

function calcMacros(calories, goal, diet_type) {
  // Protein % varies by goal
  let proteinPct = 0.25, carbsPct = 0.50, fatPct = 0.25;

  if (goal === 'gain_muscle')     { proteinPct = 0.35; carbsPct = 0.45; fatPct = 0.20; }
  if (goal === 'lose_weight')     { proteinPct = 0.35; carbsPct = 0.40; fatPct = 0.25; }
  if (goal === 'boost_energy')    { proteinPct = 0.20; carbsPct = 0.55; fatPct = 0.25; }

  // Vegan/veg lower protein absorption — bump slightly
  if (diet_type === 'vegan' || diet_type === 'vegetarian') {
    proteinPct = Math.min(proteinPct + 0.05, 0.40);
    carbsPct = carbsPct - 0.05;
  }

  return {
    protein_g: Math.round((calories * proteinPct) / 4),
    carbs_g:   Math.round((calories * carbsPct) / 4),
    fat_g:     Math.round((calories * fatPct) / 9)
  };
}

function calcBMI(weight_kg, height_cm) {
  const h = height_cm / 100;
  return +(weight_kg / (h * h)).toFixed(1);
}

function getMealSlots(meals_per_day) {
  return MEAL_SPLITS[meals_per_day] || MEAL_SPLITS[3];
}

module.exports = { calcBMR, calcTDEE, calcCalorieTarget, calcMacros, calcBMI, getMealSlots };
