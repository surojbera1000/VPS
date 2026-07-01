const { MongoClient, ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  let client;
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Plan ID required" });

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ error: "MONGODB_URI not set" });
    }

    const auth = req.headers.authorization;
    if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("kaizen_vps");
    const col = db.collection("plans");

    if (req.method === "PUT") {
      const b = req.body;
      await col.updateOne({ _id: new ObjectId(id) }, {
        $set: {
          name: b.name, category: b.category, price: Number(b.price),
          currency: b.currency || "₹", badge: b.badge || null,
          locations: b.locations || [], specs: b.specs || {},
          validity: b.validity, warranty: b.warranty, updatedAt: new Date()
        }
      });
      await client.close();
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      await col.deleteOne({ _id: new ObjectId(id) });
      await client.close();
      return res.status(200).json({ success: true });
    }

    await client.close();
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    if (client) try { await client.close(); } catch(x) {}
    return res.status(500).json({ error: "DB Error: " + e.message });
  }
};
