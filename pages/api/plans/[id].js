import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { id } = req.query;
  const client = await clientPromise;
  const db = client.db('kaizen_vps');
  const collection = db.collection('plans');

  // Validate ObjectId
  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid plan ID' });
  }

  // Check admin auth for PUT and DELETE
  if (req.method === 'PUT' || req.method === 'DELETE') {
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // GET - Fetch single plan
  if (req.method === 'GET') {
    try {
      const plan = await collection.findOne({ _id: objectId });
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      return res.status(200).json(plan);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch plan' });
    }
  }

  // PUT - Update a plan
  if (req.method === 'PUT') {
    try {
      const planData = req.body;

      const updateData = {
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
        updatedAt: new Date()
      };

      const result = await collection.updateOne(
        { _id: objectId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      return res.status(200).json({ ...updateData, _id: id });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update plan' });
    }
  }

  // DELETE - Delete a plan
  if (req.method === 'DELETE') {
    try {
      const result = await collection.deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      return res.status(200).json({ message: 'Plan deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete plan' });
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
