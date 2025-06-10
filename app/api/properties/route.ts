// app/api/properties/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // TODO: Save 'data' to your database here
    console.log("Received property data:", data);

    return NextResponse.json({ message: "Property saved successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving property:", error);
    return NextResponse.json({ error: "Failed to save property" }, { status: 500 });
  }
}
