import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) return NextResponse.json([]);
    const db = client.db("kaizen_vps");
    const plans = await db.collection("plans").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(plans);
  } catch (e) {
    return NextResponse.json([]);
  }
}

export async function POST(request) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const client = await clientPromise;
    if (!client) return NextResponse.json({ error: "DB not connected" }, { status: 500 });
    const db = client.db("kaizen_vps");
    const plan = {
      name: body.name,
      category: body.category,
      price: Number(body.price),
      currency: body.currency || "₹",
      badge: body.badge || null,
      locations: body.locations || [],
      specs: body.specs || {},
      validity: body.validity || "30 Days",
      warranty: body.warranty || "15 Days",
      createdAt: new Date(),
    };
    const result = await db.collection("plans").insertOne(plan);
    plan._id = result.insertedId;
    return NextResponse.json(plan, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
