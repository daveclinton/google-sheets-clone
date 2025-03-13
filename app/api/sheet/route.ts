import { NextResponse } from "next/server";
import { getSheetData, updateSheetData } from "../../../lib/sheetData";

export async function GET() {
  return NextResponse.json(getSheetData());
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    updateSheetData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Invalid data format" },
      { status: 400 }
    );
  }
}
