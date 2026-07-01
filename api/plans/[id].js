const { MongoClient, ObjectId } = require("mongodb");

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
    const id = req.query.id;
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const db = await getDb();
    const col = db.collection("plans");

    if (req.method === "PUT") {
      const b = req.body;
      await col.updateOne({ _id: new ObjectId(id) }, {
        $set: { name: b.name, category: b.category, price: Number(b.price), currency: b.currency || "₹", badge: b.badge || null, locations: b.locations || [], specs: b.specs || {}, validity: b.validity, warranty: b.warranty, updatedAt: new Date() }
      });
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      await col.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
