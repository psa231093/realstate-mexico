# 🔐 Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for your Supabase project.

---

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console
- A Supabase project (already set up)
- Your Supabase project URL

---

## 🚀 Step-by-Step Setup

### Step 1: Get Your Supabase Project URL

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)
5. Your redirect URI will be: `https://xxxxx.supabase.co/auth/v1/callback`

---

### Step 2: Create Google OAuth Credentials

#### 2.1. Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

#### 2.2. Create or Select a Project

1. Click the project dropdown at the top
2. Click **"New Project"** (or select an existing one)
3. Enter project name: `Real Estate Mexico` (or your preferred name)
4. Click **"Create"**

#### 2.3. Enable Google+ API (if needed)

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity Services"**
3. Click on it and press **"Enable"**

> **Note:** Modern Google OAuth uses the Google Identity Services API, but you may need to enable additional APIs depending on your needs.

#### 2.4. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the required information:
   - **App name:** `Bienes Raíces México` (or your app name)
   - **User support email:** Your email
   - **Developer contact information:** Your email
5. Click **"Save and Continue"**
6. On **Scopes** page, click **"Save and Continue"** (default scopes are fine)
7. On **Test users** page, you can add test users if needed, then click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

#### 2.5. Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Select **"Web application"** as the application type
4. Give it a name: `Real Estate Mexico Web Client`
5. **Authorized JavaScript origins:**
   - Add your local development URL: `http://localhost:3000`
   - Add your production URL (if you have one): `https://yourdomain.com`
   - Add your Supabase project URL: `https://xxxxx.supabase.co`
6. **Authorized redirect URIs:**
   - **CRITICAL:** Add your Supabase callback URL:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
   - Also add your local callback (for testing):
     ```
     http://localhost:3000/auth/callback
     ```
7. Click **"Create"**
8. **IMPORTANT:** Copy both:
   - **Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`)
   
   ⚠️ **Save these immediately - you won't be able to see the secret again!**

---

### Step 3: Configure Google OAuth in Supabase

#### 3.1. Open Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project

#### 3.2. Navigate to Authentication Settings

1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** tab
3. Find **"Google"** in the list

#### 3.3. Enable and Configure Google Provider

1. Toggle **"Enable Google provider"** to ON
2. Enter your **Client ID** (from Step 2.5)
3. Enter your **Client Secret** (from Step 2.5)
4. Click **"Save"**

#### 3.4. Verify Configuration

1. The Google provider should now show as **"Enabled"**
2. You should see a green checkmark or success message

---

### Step 4: Test Google OAuth

#### 4.1. Test Locally

1. Make sure your `.env` file has:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

2. Start your development server:
   ```bash
   npm run dev
   ```

3. Navigate to your app and try signing in with Google
4. You should be redirected to Google's consent screen
5. After authorizing, you should be redirected back to your app

#### 4.2. Troubleshooting

**Issue: "redirect_uri_mismatch" error**
- **Solution:** Make sure you added the exact Supabase callback URL in Google Cloud Console:
  ```
  https://xxxxx.supabase.co/auth/v1/callback
  ```
- Check for typos, trailing slashes, or http vs https mismatches

**Issue: "invalid_client" error**
- **Solution:** Verify your Client ID and Client Secret are correct in Supabase dashboard
- Make sure there are no extra spaces when copying/pasting

**Issue: OAuth consent screen shows "This app isn't verified"**
- **Solution:** This is normal for development. Click "Advanced" → "Go to [Your App] (unsafe)" to proceed
- For production, you'll need to verify your app with Google (requires verification process)

---

## 🔒 Security Best Practices

1. **Never commit credentials to Git**
   - Your `.env` file should be in `.gitignore`
   - Client Secret should only be in Supabase Dashboard (server-side)

2. **Use different credentials for development and production**
   - Create separate OAuth clients in Google Cloud Console
   - Use different Supabase projects if possible

3. **Restrict redirect URIs**
   - Only add the exact URLs you need
   - Don't use wildcards unless necessary

4. **Rotate secrets periodically**
   - Update credentials if you suspect they're compromised
   - Update in both Google Cloud Console and Supabase Dashboard

---

## 📝 Quick Reference

### Your Supabase Callback URL Format:
```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

### Where to Find Your Project Reference:
1. Supabase Dashboard → Settings → API
2. Look at your Project URL: `https://xxxxx.supabase.co`
3. The `xxxxx` part is your project reference

### Google Cloud Console Links:
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)
- [OAuth 2.0 Client IDs](https://console.cloud.google.com/apis/credentials)

### Supabase Dashboard Links:
- [Supabase Dashboard](https://supabase.com/dashboard)
- Authentication → Providers → Google

---

## ✅ Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled necessary APIs
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added Supabase callback URL to authorized redirect URIs
- [ ] Copied Client ID and Client Secret
- [ ] Configured Google provider in Supabase Dashboard
- [ ] Tested Google sign-in locally
- [ ] Verified redirect works correctly

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Supabase logs:**
   - Dashboard → Logs → Auth Logs

2. **Check Google Cloud Console:**
   - APIs & Services → Credentials → Check OAuth client settings

3. **Common issues:**
   - Redirect URI mismatch → Double-check the exact URL
   - Invalid credentials → Re-copy from Google Cloud Console
   - App not verified → Normal for development, use "Advanced" option

---

**Last Updated:** 2024










