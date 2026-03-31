const Groq = require('groq-sdk');
const { getMealSlots } = require('../utils/nutritionCalc');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.1-8b-instant';

/**
 * GENERATE 7-DAY DIET PLAN
 * All constraints from onboarding are injected into the prompt
 */
async function generateDietPlan(profile) {
  const mealSlots = getMealSlots(profile.meals_per_day);
  const budgetText = profile.budget_inr
    ? `Budget: ₹${profile.budget_inr} ${profile.budget_type} (Indian Rupees). All meal suggestions must be affordable and realistically available in India within this budget.`
    : 'No specific budget constraint.';

  const allergyText = profile.allergies?.length
    ? `STRICTLY AVOID these allergens in every meal: ${profile.allergies.join(', ')}.`
    : 'No known allergies.';

  const medText = profile.medical_conditions?.length
    ? `Medical conditions: ${profile.medical_conditions.join(', ')}. Tailor macros and food choices accordingly (e.g., low GI for diabetes, low sodium for BP).`
    : 'No medical conditions.';

  const dietRules = {
    vegetarian:    'ONLY vegetarian food. No meat, no fish, no eggs.',
    vegan:         'ONLY vegan food. No meat, fish, eggs, dairy, or honey.',
    non_veg:       'Non-vegetarian food is allowed including meat, chicken, fish, eggs.',
    pescatarian:   'No meat or chicken. Fish, seafood, eggs, and dairy are allowed.',
    eggetarian:    'Vegetarian + eggs allowed. No meat or fish.'
  };

  const prompt = `You are a professional Indian dietitian and nutritionist.

Generate a complete 7-day personalized meal plan as a JSON object.

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age}, Gender: ${profile.gender}
- Weight: ${profile.weight_kg}kg, Height: ${profile.height_cm}cm, BMI: ${profile.bmi}
- Goal: ${profile.health_goal}
- Activity: ${profile.activity_level}
- Daily calorie target: ${profile.daily_calorie_target} kcal
- Protein target: ${profile.protein_target_g}g, Carbs: ${profile.carbs_target_g}g, Fat: ${profile.fat_target_g}g
- Diet type: ${dietRules[profile.diet_type] || 'Balanced'}
- Meals per day: ${profile.meals_per_day} meals (slots: ${mealSlots.join(', ')})
- Cuisine preferences: ${profile.cuisine_preferences?.join(', ') || 'Indian'}
- ${allergyText}
- ${medText}
- ${budgetText}

RULES:
1. Every meal must strictly follow the diet type rules above
2. Use real Indian food names (e.g., dal, sabzi, roti, idli, dosa, poha, upma, paneer, rajma, chole)
3. Include Western options only if user prefers it
4. Each meal must have: name, description (1 line), calories, protein_g, carbs_g, fat_g, cost_inr (estimated)
5. Total daily calories must be within 50 kcal of the target
6. Vary meals across days — no repeated meals on consecutive days
7. Include regional Indian variety based on cuisine preference

Return ONLY this JSON structure, no explanation, no markdown:
{
  "plan_summary": "2-sentence summary of this plan",
  "daily_target": { "calories": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0 },
  "estimated_daily_cost_inr": 0,
  "days": [
    {
      "day": "Monday",
      "meals": [
        {
          "slot": "breakfast",
          "name": "",
          "description": "",
          "calories": 0,
          "protein_g": 0,
          "carbs_g": 0,
          "fat_g": 0,
          "cost_inr": 0,
          "ingredients": ["", ""],
          "preparation": "1-2 sentence prep note"
        }
      ],
      "day_total_calories": 0,
      "day_total_cost_inr": 0
    }
  ],
  "tips": ["tip1", "tip2", "tip3"],
  "foods_to_avoid": ["food1", "food2"]
}`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000
  });

  try {
    const text = response.choices[0]?.message?.content || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('Groq JSON Parse Error:', err);
    throw new Error('Failed to generate diet plan');
  }
}

/**
 * AI CHAT — context-aware food Q&A
 */
async function chatWithAI(message, profile, recentMeals) {
  const dietContext = `User is ${profile.diet_type}, goal: ${profile.health_goal}, 
    daily target: ${profile.daily_calorie_target} kcal, cuisine: ${profile.cuisine_preferences?.join(', ')},
    budget: ₹${profile.budget_inr || 'flexible'} ${profile.budget_type || ''}.
    ${profile.allergies?.length ? 'Allergies: ' + profile.allergies.join(', ') : ''}
    ${profile.medical_conditions?.length ? 'Conditions: ' + profile.medical_conditions.join(', ') : ''}`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: `You are NutriSmart AI, a friendly Indian nutritionist assistant.
        Answer concisely (2-4 sentences max unless a list is needed).
        Always respect the user's diet type strictly — never suggest foods they cannot eat.
        User context: ${dietContext}`
      },
      { role: 'user', content: message }
    ],
    temperature: 0.6,
    max_tokens: 500
  });

  return response.choices[0]?.message?.content || 'Sorry, I could not process that.';
}

/**
 * WEEKLY INSIGHTS
 */
async function generateWeeklyInsights(profile, mealsLastWeek) {
  const mealSummary = mealsLastWeek.map(m =>
    `${m.meal_type}: ${m.name} (${m.calories}kcal, P:${m.protein_g}g, C:${m.carbs_g}g, F:${m.fat_g}g, ₹${m.cost_inr || 0})`
  ).join('\n');

  const prompt = `You are a professional nutritionist analyzing a week of meal data.

User: ${profile.name}, Goal: ${profile.health_goal}, Diet: ${profile.diet_type}
Daily calorie target: ${profile.daily_calorie_target} kcal
${profile.medical_conditions?.length ? 'Conditions: ' + profile.medical_conditions.join(', ') : ''}

Meals logged this week:
${mealSummary || 'No meals logged yet — give general advice based on their profile.'}

Return ONLY this JSON (no markdown):
{
  "wellness_score": 0,
  "summary": "2-sentence overview",
  "well_done": ["achievement 1", "achievement 2", "achievement 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "recommendations": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3"],
  "nutrient_gaps": {
    "protein": 0,
    "fiber": 0,
    "iron": 0,
    "calcium": 0,
    "vitamin_c": 0
  },
  "motivational_tip": "one personalized motivational sentence"
}`;

  const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 800
  });

  try {
    const text = response.choices[0]?.message?.content || '{}';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    console.error('Groq JSON Parse Error:', err);
    throw new Error('Failed to generate insights');
  }
}

module.exports = { generateDietPlan, chatWithAI, generateWeeklyInsights };
