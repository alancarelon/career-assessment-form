# Database Migration Instructions

## ⚠️ IMPORTANT: Run This Before Deploying

You need to update your Supabase database schema to the new comprehensive version.

## Steps:

### 1. Go to Supabase SQL Editor
- Open your Supabase dashboard
- Click **SQL Editor** in the left sidebar
- Click **New Query**

### 2. Run the Migration
- Open the file `supabase-migration-v2.sql` in your project
- Copy ALL the SQL code
- Paste it into the Supabase SQL Editor
- Click **Run** ▶️

### 3. Verify the Migration
You should see: **"Success"**

The migration will:
- ✅ Drop the old `assessments` table
- ✅ Create a new comprehensive `assessments` table with all form fields
- ✅ Set up proper indexes for performance
- ✅ Configure Row Level Security (RLS) policies

## What's New in the Database:

### Personal Info:
- `name`, `email`, `agid`, `current_role`

### Career Vision (Step 1):
- `career_growth`, `future_vision`, `growth_areas`

### Self Assessment (Step 2):
- `skill_ratings` (JSONB - all skill ratings with examples)
- `multi_select_responses` (JSONB - multi-select answers)

### Superpowers (Step 3):
- `strengths`, `teammates_feedback`, `proud_accomplishment`

### Growth Opportunities (Step 4):
- `skills_to_improve`, `growth_limits`, `learning_style`

### Community (Step 5):
- `teaching_topic`, `mentor_interest`

### Commitment (Step 6):
- `six_month_goal`, `goal_importance`

## After Migration:

1. **Deploy the code** (push to GitHub - Vercel will auto-deploy)
2. **Test a form submission**
3. **Check the admin dashboard** - you'll see ALL the comprehensive data!
4. **Export to Excel** - all fields will be included

## Note:
⚠️ This migration will **delete existing data** in the assessments table. If you have important data, export it first before running the migration.
