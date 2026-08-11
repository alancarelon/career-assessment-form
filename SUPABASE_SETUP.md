# Supabase Setup Guide

## Step 1: Create the Database Table

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-schema.sql` file
5. Click **Run** to create the table

## Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these two variables:
   - Name: `VITE_SUPABASE_URL`
     Value: `https://fyzybmcflrktxpdpudtw.supabase.co`
   
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `sb_publishable_uOO_Rm7yiztcz58SFr9YJg_cd0kg2gZ`

4. Make sure to select all environments (Production, Preview, Development)
5. Click **Save**

## Step 3: Redeploy

After adding environment variables, trigger a new deployment:
- Either push a new commit to GitHub
- Or go to Vercel → Deployments → click the three dots on latest deployment → Redeploy

## Features

### Form Submission
- Users fill out the form at your main URL
- Data is automatically saved to Supabase
- Users also get an Excel download

### Admin Dashboard
- Access at: `your-url.vercel.app/admin`
- View all submissions
- See statistics and averages
- Export all data to Excel

## Database Structure

The `assessments` table stores:
- Personal information (name, email, role, experience)
- Skill ratings (UX research, design systems, leadership)
- Career goals and learning preferences
- Timestamp of submission

## Security

- Row Level Security (RLS) is enabled
- Public can insert (for form submissions)
- Public can read (you can restrict this later if needed)
- Your API keys are safe to use in the browser (anon/public key)
