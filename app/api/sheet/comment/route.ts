// app/api/sheet/comment/route.ts
import { addComment, deleteComment, getCommentsForCell } from "@/lib/sheetData";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cellId = searchParams.get("cellId");

  if (!cellId) {
    return NextResponse.json(
      { success: false, error: "Cell ID is required" },
      { status: 400 }
    );
  }

  const comments = getCommentsForCell(cellId);
  return NextResponse.json({ success: true, comments });
}

export async function POST(request: Request) {
  try {
    const { cellId, content, author } = await request.json();

    if (!cellId || !content || !author) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const comment = addComment(cellId, content, author);

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Cell not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json(
        { success: false, error: "Comment ID is required" },
        { status: 400 }
      );
    }

    const success = deleteComment(commentId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
