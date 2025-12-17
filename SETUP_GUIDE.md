# Google OAuth Setup Guide

## What You Need to Provide

### 1. Google OAuth Credentials

Visit **Google Cloud Console**: https://console.cloud.google.com/

#### Steps:

1. **Create a new project** or select an existing one
2. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Search and enable "Google+ API"
3. **Create OAuth Client ID**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
4. **Save your credentials**:
   - Client ID
   - Client Secret

### 2. Environment Variables

Update `.env.local` file with:

```
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
NEXTAUTH_SECRET=<random-32-character-string>
NEXTAUTH_URL=http://localhost:3000
```

Generate `NEXTAUTH_SECRET` using any random string (32+ chars).

## Running the App

```bash
cd google-oauth-app
pnpm install
pnpm dev
```

Visit: http://localhost:3000
