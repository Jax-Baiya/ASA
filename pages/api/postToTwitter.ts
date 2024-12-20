import { NextApiRequest, NextApiResponse } from 'next';
import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text, mediaIds } = req.body;
    const accessToken = req.headers['x-twitter-access-token'] as string;

    if (!accessToken) {
      return res.status(401).json({ error: 'Twitter access token is required' });
    }

    const client = new TwitterApi(accessToken);

    try {
      const tweet = await client.v2.tweet(text, {
        media: { media_ids: mediaIds },
      });

      res.status(200).json({ tweet });
    } catch (error) {
      console.error('Error posting to Twitter:', error);
      res.status(500).json({ error: 'Failed to post to Twitter' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

