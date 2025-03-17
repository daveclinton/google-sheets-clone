import React, { FC } from "react";
import { Cell } from "../types/types";

interface SheetProps {
  cells: Record<string, Cell>;
  selectedCellId: string | null;
  onCellClick: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: string) => void;
}

const Sheet: FC<SheetProps> = ({
  cells,
  selectedCellId,
  onCellClick,
  onCellChange,
}) => {
  const renderColumnHeaders = () => {
    return (
      <>
        <div className="bg-gray-200 border-b border-r h-10 flex items-center justify-center"></div>
        {Array(10)
          .fill(0)
          .map((_, col) => (
            <div
              key={`col-${col}`}
              className="bg-gray-200 border-b border-r h-10 flex items-center justify-center font-medium"
            >
              {String.fromCharCode(65 + col)}
            </div>
          ))}
      </>
    );
  };

  const renderRows = () => {
    return Array(20)
      .fill(0)
      .map((_, row) => (
        <React.Fragment key={`row-${row}`}>
          <div className="bg-gray-200 border-b border-r w-10 h-10 flex items-center justify-center font-medium">
            {row + 1}
          </div>
          {Array(10)
            .fill(0)
            .map((_, col) => {
              const cellId = `${row}-${col}`;
              const cell = cells[cellId];

              return (
                <div
                  key={`cell-${row}-${col}`}
                  className={`border-b border-r h-10 relative ${
                    selectedCellId === cellId
                      ? "outline outline-blue-500 z-10"
                      : ""
                  }`}
                  onClick={() => onCellClick(row, col)}
                >
                  <input
                    type="text"
                    value={cell?.value || ""}
                    onChange={(e) => onCellChange(row, col, e.target.value)}
                    className="w-full h-full px-2 focus:outline-none"
                  />
                  {cell?.hasComment && (
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-4 border-r-4 border-t-transparent border-r-red-500"></div>
                  )}
                </div>
              );
            })}
        </React.Fragment>
      ));
  };

  return (
    <div className="grid grid-cols-[40px_repeat(10,minmax(100px,1fr))]">
      {renderColumnHeaders()}
      {renderRows()}
    </div>
  );
};

export default Sheet;
