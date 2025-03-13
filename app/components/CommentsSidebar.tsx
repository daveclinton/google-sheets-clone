import React, { FC } from "react";
import { Cell, Comment } from "../types/types";

interface CommentSidebarProps {
  selectedCell: Cell | null;
  comments: Comment[];
  commentInput: string;
  onCommentInputChange: (value: string) => void;
  onAddComment: () => void;
  onDeleteComment: (id: string) => void;
}

const CommentSidebar: FC<CommentSidebarProps> = ({
  selectedCell,
  comments,
  commentInput,
  onCommentInputChange,
  onAddComment,
  onDeleteComment,
}) => {
  const getCellLabel = (cell: Cell): string => {
    return `${String.fromCharCode(65 + cell.col)}${cell.row + 1}`;
  };

  return (
    <div className="w-80 border-l border-gray-300 flex flex-col bg-gray-50">
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-medium">Comments</h2>
        {selectedCell && (
          <div className="text-sm text-gray-500">
            Cell: {getCellLabel(selectedCell)}
          </div>
        )}
      </div>

      <div className="flex-grow overflow-auto p-4">
        {selectedCell ? (
          comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="mb-4 bg-white p-3 rounded-lg shadow-sm"
              >
                <div className="flex justify-between">
                  <div className="font-medium">{comment.author}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-1">{comment.content}</div>
                <button
                  className="text-xs text-red-500 mt-2"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center mt-4">
              No comments for this cell
            </div>
          )
        ) : (
          <div className="text-gray-500 text-center mt-4">
            Select a cell to view comments
          </div>
        )}
      </div>

      {selectedCell && (
        <div className="p-4 border-t mt-auto">
          <textarea
            value={commentInput}
            onChange={(e) => onCommentInputChange(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded-lg mb-2 resize-none"
            rows={3}
          />
          <button
            onClick={onAddComment}
            disabled={!commentInput.trim()}
            className={`px-4 py-2 rounded-lg w-full ${
              !commentInput.trim()
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white"
            }`}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSidebar;
