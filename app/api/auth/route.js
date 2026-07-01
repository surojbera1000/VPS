import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();
  if (body.password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: true, token: process.env.ADMIN_PASSWORD });
  }
  return NextResponse.json({ error: "Wrong password" }, { status: 401 });
}
