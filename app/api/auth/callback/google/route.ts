import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import connectDB  from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json();
     
     // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      const errorData = await userInfoResponse.json();
      console.error('User info fetch failed:', errorData);
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await userInfoResponse.json();
    console.log("user info",userInfo);
    
    // Connect to MongoDB
    await connectDB();

    // Find or create user in database
    let user = await User.findOne({ googleId: userInfo.id });

    if (!user) {
      // Create new user
      user = await User.create({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        lastLogin: new Date(),
      });
      console.log('✅ New user created:', user.email);
    } else {
      // Update last login for existing user
      user.lastLogin = new Date();
      user.picture = userInfo.picture; // Update Google photo if changed
      await user.save();
      console.log('✅ Existing user logged in:', user.email);
    }

    // Create session with custom avatar if set, otherwise Google photo
    await createSession({
      id: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.customAvatar || user.picture,
    });

    
    // Return HTML that closes popup and notifies parent
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Login Successful</title>
        </head>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'oauth-success' }, window.location.origin);
              window.close();
            } else {
              window.location.href = '/home';
            }
          </script>
          <p>Login successful! Redirecting...</p>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
