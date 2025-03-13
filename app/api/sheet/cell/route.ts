import { NextResponse } from "next/server";
import { getCell, updateCell } from "../../../../lib/sheetData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cellId = searchParams.get("id");

  if (!cellId) {
    return NextResponse.json(
      { success: false, error: "Cell ID is required" },
      { status: 400 }
    );
  }

  const cell = getCell(cellId);

  if (!cell) {
    return NextResponse.json(
      { success: false, error: "Cell not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, cell });
}

export async function PUT(request: Request) {
  try {
    const { cellId, value } = await request.json();

    if (!cellId || typeof cellId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid cell ID" },
        { status: 400 }
      );
    }

    const updatedCell = updateCell(cellId, { value });

    if (!updatedCell) {
      return NextResponse.json(
        { success: false, error: "Cell not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cell: updatedCell });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Failed to update cell" },
      { status: 500 }
    );
  }
}
