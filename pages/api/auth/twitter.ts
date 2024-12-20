import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  clientId: process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
      process.env.TWITTER_CALLBACK_URL!,
      { scope: ['tweet.read', 'tweet.write', 'users.read'] }
    );

    // Store codeVerifier and state in session or database
    // For simplicity, we'll use cookies here, but in a production app, you should use a more secure method
    res.setHeader('Set-Cookie', [
      `twitter_oauth_state=${state}; HttpOnly; Path=/; Max-Age=3600`,
      `twitter_oauth_code_verifier=${codeVerifier}; HttpOnly; Path=/; Max-Age=3600`,
    ]);

    res.redirect(url);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

