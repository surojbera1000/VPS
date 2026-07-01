const { MongoClient } = require("mongodb");

let client = null;
async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
  }
  return client.db("kaizen_vps");
}

module.exports = async (req, res) => {
  try {
    const db = await getDb();
    const col = db.collection("plans");

    if (req.method === "GET") {
      const plans = await col.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(plans);
    }

    if (req.method === "POST") {
      const auth = req.headers.authorization;
      if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const b = req.body;
      const plan = {
        name: b.name, category: b.category, price: Number(b.price),
        currency: b.currency || "₹", badge: b.badge || null,
        locations: b.locations || [], specs: b.specs || {},
        validity: b.validity || "30 Days", warranty: b.warranty || "15 Days",
        createdAt: new Date()
      };
      const result = await col.insertOne(plan);
      plan._id = result.insertedId;
      return res.status(201).json(plan);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
