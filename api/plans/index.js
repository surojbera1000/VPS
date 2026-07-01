const { MongoClient } = require("mongodb");

module.exports = async (req, res) => {
  let client;
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ error: "MONGODB_URI not set in environment" });
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("kaizen_vps");
    const col = db.collection("plans");

    if (req.method === "GET") {
      const plans = await col.find({}).sort({ createdAt: -1 }).toArray();
      await client.close();
      return res.status(200).json(plans);
    }

    if (req.method === "POST") {
      const auth = req.headers.authorization;
      if (!process.env.ADMIN_PASSWORD) {
        await client.close();
        return res.status(500).json({ error: "ADMIN_PASSWORD not set in environment" });
      }
      if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        await client.close();
        return res.status(401).json({ error: "Unauthorized - wrong token" });
      }
      const b = req.body;
      if (!b || !b.name) {
        await client.close();
        return res.status(400).json({ error: "Plan name is required" });
      }
      const plan = {
        name: b.name,
        category: b.category || "bandwidth",
        price: Number(b.price) || 0,
        currency: b.currency || "₹",
        badge: b.badge || null,
        locations: b.locations || [],
        specs: b.specs || {},
        validity: b.validity || "30 Days",
        warranty: b.warranty || "15 Days",
        createdAt: new Date()
      };
      const result = await col.insertOne(plan);
      plan._id = result.insertedId;
      await client.close();
      return res.status(201).json(plan);
    }

    await client.close();
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    if (client) try { await client.close(); } catch(x) {}
    return res.status(500).json({ error: "DB Error: " + e.message });
  }
};
