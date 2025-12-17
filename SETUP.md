# Google OAuth Next.js App

A Next.js application with custom Google OAuth implementation (no third-party auth libraries).

## Setup Instructions

### 1. Get Google OAuth Credentials

You need to obtain Google OAuth credentials from Google Cloud Console:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing one)
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - http://localhost:3000
   - Add authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google
   - Click "Create"
5. **Copy your credentials**:
   - Copy the "Client ID" 
   - Copy the "Client Secret"

### 2. Configure Environment Variables

Open the .env.local file and replace the placeholder values:

GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
NEXTAUTH_SECRET=generate_a_random_string_here
NEXTAUTH_URL=http://localhost:3000

**Generate a random secret** for NEXTAUTH_SECRET:
- Use any random string generator (at least 32 characters)
- Example: abc123xyz789randomsecret456789

### 3. Install Dependencies

pnpm install

### 4. Run the Development Server

pnpm dev

Open http://localhost:3000 in your browser.

## How It Works

- / - Redirects to /login
- /login - Login page with Google sign-in button
- /home - Protected page (requires authentication)
- /api/auth/google - Initiates Google OAuth flow
- /api/auth/callback/google - Handles OAuth callback
- /api/auth/logout - Logs out user

## Technologies Used

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- jose (for JWT tokens - lightweight crypto library)
- Google OAuth 2.0 (direct API integration)

## Security Features

- Secure HTTP-only cookies
- JWT token encryption
- 7-day session expiration
- CSRF protection via SameSite cookies
