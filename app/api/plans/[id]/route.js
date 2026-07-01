import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const client = await clientPromise;
    if (!client) return NextResponse.json({ error: "DB error" }, { status: 500 });
    const db = client.db("kaizen_vps");
    await db.collection("plans").updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { name: body.name, category: body.category, price: Number(body.price), currency: body.currency || "₹", badge: body.badge || null, locations: body.locations || [], specs: body.specs || {}, validity: body.validity, warranty: body.warranty, updatedAt: new Date() } }
    );
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const client = await clientPromise;
    if (!client) return NextResponse.json({ error: "DB error" }, { status: 500 });
    const db = client.db("kaizen_vps");
    await db.collection("plans").deleteOne({ _id: new ObjectId(params.id) });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
