-- ============================================================
-- NUTRISMART DATABASE SCHEMA (Production without RLS)
-- ============================================================

-- Wipe old data on reset
drop table if exists insights cascade;
drop table if exists diet_plans cascade;
drop table if exists meals cascade;
drop table if exists profiles cascade;

-- USER PROFILES (extends Supabase auth.users)
create table if not exists profiles (
  id                  uuid references auth.users(id) on delete cascade primary key,
  name                text,
  age                 int,
  gender              text check (gender in ('male','female','other')),

  -- Body metrics
  weight_kg           float,
  height_cm           float,
  bmi                 float,

  -- Diet preferences
  diet_type           text check (diet_type in
                        ('vegetarian','vegan','non_veg','pescatarian','eggetarian')),
  health_goal         text check (health_goal in
                        ('lose_weight','gain_muscle','maintain','improve_health','boost_energy')),
  activity_level      text check (activity_level in
                        ('sedentary','light','moderate','very_active','extremely_active')),

  -- Allergies & conditions (stored as arrays)
  allergies           text[] default '{}',
  medical_conditions  text[] default '{}',
  cuisine_preferences text[] default '{}',

  -- Meal frequency & budget
  meals_per_day       int default 3 check (meals_per_day between 1 and 6),
  budget_type         text check (budget_type in ('daily','weekly','monthly')),
  budget_inr          int,                -- budget in Indian Rupees

  -- Calculated targets
  bmr                 float,
  tdee                float,
  daily_calorie_target int,
  protein_target_g    float,
  carbs_target_g      float,
  fat_target_g        float,

  onboarding_complete boolean default false,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- MEALS LOG
create table if not exists meals (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  calories    int not null,
  protein_g   float default 0,
  carbs_g     float default 0,
  fat_g       float default 0,
  fiber_g     float default 0,
  meal_type   text check (meal_type in
                ('breakfast','morning_snack','lunch','evening_snack','dinner','late_snack')),
  cost_inr    float,               -- estimated cost in INR
  eaten_at    timestamptz default now(),
  created_at  timestamptz default now()
);

-- AI GENERATED DIET PLANS
create table if not exists diet_plans (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  plan_data   jsonb not null,       -- full AI generated plan
  valid_from  date default current_date,
  valid_to    date default (current_date + interval '7 days'),
  created_at  timestamptz default now()
);

-- AI INSIGHTS CACHE
create table if not exists insights (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  week_start  date not null,
  insight_data jsonb not null,
  created_at  timestamptz default now(),
  unique(user_id, week_start)
);

-- RLS Policies omitted: Node.js Backend handles all security directly via service role key.

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- SAMPLE DATA FOR TESTING (MANUAL TEMPLATE)
-- ============================================================

-- [INSTRUCTIONS]:
-- 1. Create a user in the Supabase Auth Dashboard.
-- 2. Copy the User ID (UUID).
-- 3. Replace '<USER_ID>' below and run these queries in the SQL Editor.

/*
-- 1. Populate Profile
INSERT INTO public.profiles (
  id, name, age, gender, weight_kg, height_cm, bmi, 
  diet_type, health_goal, activity_level, meals_per_day, 
  budget_type, budget_inr, daily_calorie_target, 
  protein_target_g, carbs_target_g, fat_target_g, onboarding_complete
)
VALUES (
  '<USER_ID>', 'Demo User', 28, 'male', 75, 180, 23.1, 
  'non_veg', 'gain_muscle', 'moderate', 3, 
  'daily', 500, 2500, 150, 300, 70, true
);

-- 2. Add Sample Meals
INSERT INTO public.meals (user_id, name, calories, protein_g, carbs_g, fat_g, meal_type, cost_inr)
VALUES 
('<USER_ID>', 'Scrambled Eggs on Toast', 400, 20, 35, 15, 'breakfast', 80),
('<USER_ID>', 'Grilled Chicken & Rice', 650, 45, 60, 10, 'lunch', 150),
('<USER_ID>', 'Protein Shake', 200, 25, 10, 5, 'evening_snack', 100);

-- 3. Add Sample Diet Plan
INSERT INTO public.diet_plans (user_id, plan_data)
VALUES ('<USER_ID>', '{
    "plan_summary": "High-protein mass gain protocol.",
    "days": [
      {
        "day": "Monday",
        "meals": [
          {"slot": "Breakfast", "name": "Oatmeal & Berries", "calories": 400, "protein_g": 12, "cost_inr": 60},
          {"slot": "Lunch", "name": "Paneer & Roti", "calories": 600, "protein_g": 20, "cost_inr": 120}
        ]
      }
    ],
    "tips": ["Hydrate with 3L water daily"],
    "foods_to_avoid": ["Highly processed sugars"]
}');
*/
