export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true, token: process.env.ADMIN_PASSWORD });
  }

  return res.status(401).json({ error: 'Invalid password' });
}
