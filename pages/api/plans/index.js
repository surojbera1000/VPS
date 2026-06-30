import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('kaizen_vps');
  const collection = db.collection('plans');

  // GET - Fetch all plans
  if (req.method === 'GET') {
    try {
      const plans = await collection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(plans);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch plans' });
    }
  }

  // POST - Add a new plan
  if (req.method === 'POST') {
    try {
      // Check admin password
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const planData = req.body;

      // Validate required fields
      if (!planData.name || !planData.category || !planData.price) {
        return res.status(400).json({ error: 'Missing required fields: name, category, price' });
      }

      const newPlan = {
        name: planData.name,
        category: planData.category,
        price: Number(planData.price),
        currency: planData.currency || '₹',
        badge: planData.badge || null,
        locations: planData.locations || [],
        specs: {
          ram: planData.specs?.ram || '',
          cpu: planData.specs?.cpu || '',
          storage: planData.specs?.storage || '',
          bandwidth: planData.specs?.bandwidth || '',
          latency: planData.specs?.latency || '',
          speed: planData.specs?.speed || ''
        },
        validity: planData.validity || '30 Days',
        warranty: planData.warranty || '15 Days',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(newPlan);
      newPlan._id = result.insertedId;

      return res.status(201).json(newPlan);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to add plan' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
