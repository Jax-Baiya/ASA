import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { state, code } = req.query;
    const storedState = req.cookies['twitter_oauth_state'];
    const codeVerifier = req.cookies['twitter_oauth_code_verifier'];

    if (!state || !code || !codeVerifier || state !== storedState) {
      return res.status(400).json({ error: 'Invalid OAuth state' });
    }

    try {
      const { accessToken, refreshToken } = await client.loginWithOAuth2({
        code: code as string,
        codeVerifier,
        redirectUri: process.env.TWITTER_CALLBACK_URL!,
      });

      // Store these tokens securely (e.g., in a database)
      // For simplicity, we'll just send them back to the client
      // In a real app, you should never expose these tokens to the client
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error('Error during Twitter OAuth:', error);
      res.status(500).json({ error: 'Failed to authenticate with Twitter' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

