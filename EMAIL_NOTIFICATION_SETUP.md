# 📧 EMAIL NOTIFICATION SETUP GUIDE

## Overview
Get instant email notifications when team members complete their UX Growth Journey assessment.

---

## 🎯 WHAT YOU'LL GET

Every time someone submits an assessment, you'll receive an email like this:

```
Subject: ✅ New Assessment Submitted - Sarah Johnson

From: UX Assessment <onboarding@resend.dev>
To: your-email@company.com

---
✅ New Assessment Submitted!

A new UX Growth Journey assessment has been completed:

👤 Name: Sarah Johnson
📧 Email: sarah.johnson@company.com
💼 Role: Associate UX Designer
⏰ Submitted: Monday, September 22, 2024 at 12:30 PM

[📊 View in Admin Dashboard]

---
UX Growth Journey Assessment System
This is an automated notification. Please do not reply to this email.
```

---

## 🚀 SETUP STEPS (15 minutes)

### **Step 1: Sign up for Resend (Free)**

1. Go to: https://resend.com/signup
2. Sign up with your work email
3. Verify your email address
4. You'll get **100 emails/day FREE** (3,000/month)

---

### **Step 2: Get Your API Key**

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: `UX Assessment Notifications`
4. Copy the API key (starts with `re_...`)
5. **Save it somewhere safe** - you'll need it in the next step

---

### **Step 3: Configure Supabase**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Edge Functions**
4. Click **Add Secret**
5. Add these two secrets:

   **Secret 1:**
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxxx` (paste your Resend API key)

   **Secret 2:**
   - Name: `NOTIFICATION_EMAIL`
   - Value: `your-email@company.com` (your email address)

---

### **Step 4: Deploy the Edge Function**

Open your terminal and run these commands:

```bash
# Navigate to your project
cd "/Users/AL41912/Library/CloudStorage/OneDrive-ElevanceHealth/Documents/CascadeProjects/Career/Self assessment form"

# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the function
supabase functions deploy send-assessment-notification
```

**To find your PROJECT_REF:**
- Go to Supabase Dashboard → Settings → General
- Copy the "Reference ID"

---

### **Step 5: Test It!**

1. Go to: https://career-assessment-form-five.vercel.app
2. Fill out a test assessment
3. Submit it
4. **Check your email** - you should receive a notification within seconds!

---

## 🔧 TROUBLESHOOTING

### **Not receiving emails?**

1. **Check spam folder** - First email might go to spam
2. **Verify Resend API key** - Make sure it's correct in Supabase secrets
3. **Check email address** - Verify NOTIFICATION_EMAIL is correct
4. **Check Supabase logs:**
   - Go to Supabase Dashboard → Edge Functions → Logs
   - Look for any errors

### **Emails going to spam?**

1. **Add sender to contacts:** `onboarding@resend.dev`
2. **Mark as "Not Spam"** in your email client
3. **Upgrade Resend** (optional): Add custom domain for better deliverability

---

## 📊 MONITORING

### **Check Email Usage:**
- Resend Dashboard: https://resend.com/emails
- See all sent emails, delivery status, and usage

### **Supabase Function Logs:**
- Supabase Dashboard → Edge Functions → send-assessment-notification → Logs
- See all function invocations and any errors

---

## 💰 PRICING

**Resend Free Tier:**
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ Perfect for 23 team members (23 emails total)

**If you need more:**
- Pro: $20/month for 50,000 emails
- (You won't need this!)

---

## 🔄 UPDATING NOTIFICATION EMAIL

To change who receives notifications:

1. Go to Supabase Dashboard → Settings → Edge Functions
2. Find secret: `NOTIFICATION_EMAIL`
3. Click **Edit**
4. Update to new email address
5. Save

**To notify multiple people:**
Update the Edge Function code to include multiple emails:
```typescript
to: ['email1@company.com', 'email2@company.com', 'email3@company.com']
```

---

## ✅ CHECKLIST

- [ ] Sign up for Resend
- [ ] Get API key from Resend
- [ ] Add RESEND_API_KEY to Supabase secrets
- [ ] Add NOTIFICATION_EMAIL to Supabase secrets
- [ ] Deploy Edge Function via Supabase CLI
- [ ] Test with a sample submission
- [ ] Verify email received
- [ ] Add sender to contacts (avoid spam)

---

## 📞 NEED HELP?

If you run into issues:
1. Check Supabase Edge Function logs
2. Check Resend email logs
3. Verify all secrets are set correctly
4. Make sure Edge Function is deployed

---

**Once set up, you'll get instant email notifications for every assessment submission!** 📧✅
