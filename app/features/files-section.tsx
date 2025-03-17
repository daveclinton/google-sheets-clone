import React, { ReactNode } from "react";
import { FileRow } from "./file-row";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FilterTypes {
  id: string;
  title: string;
  owner: string;
  date: string;
  shared: boolean;
  starred: boolean;
  type: string;
}

interface GroupedFiles {
  today: FilterTypes[];
  lastWeek: FilterTypes[];
  earlier: FilterTypes[];
}

interface FileSectionProps {
  viewMode: string;
  groupedFiles: GroupedFiles;
  renderActions: (value: FilterTypes) => ReactNode;
  filteredFiles: FilterTypes[];
}

const FilesSection: React.FC<FileSectionProps> = ({
  viewMode,
  groupedFiles,
  renderActions,
  filteredFiles,
}) => {
  return (
    <div className="px-4 py-4">
      {viewMode === "list" ? (
        <>
          {groupedFiles.today.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-medium text-gray-700 mb-2">
                Today
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {groupedFiles.today.map((file) => (
                  <FileRow
                    key={file.id}
                    icon={file.type as "sheets" | "excel" | "docs" | "slides"}
                    id={file.id}
                    title={file.title}
                    owner={file.owner}
                    date={new Date(file.date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    shared={file.shared}
                    actions={renderActions(file)}
                  />
                ))}
              </div>
            </div>
          )}
          {groupedFiles.lastWeek.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-medium text-gray-700 mb-2">
                Last 7 Days
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {groupedFiles.lastWeek.map((file) => (
                  <FileRow
                    key={file.id}
                    icon={file.type as "sheets" | "excel" | "docs" | "slides"}
                    id={file.id}
                    title={file.title}
                    owner={file.owner}
                    date={new Date(file.date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    shared={file.shared}
                    actions={renderActions(file)}
                  />
                ))}
              </div>
            </div>
          )}
          {groupedFiles.earlier.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-medium text-gray-700 mb-2">
                Earlier
              </h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {groupedFiles.earlier.map((file) => (
                  <FileRow
                    key={file.id}
                    icon={file.type as "sheets" | "excel" | "docs" | "slides"}
                    id={file.id}
                    title={file.title}
                    owner={file.owner}
                    date={new Date(file.date).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    shared={file.shared}
                    actions={renderActions(file)}
                  />
                ))}
              </div>
            </div>
          )}
          {filteredFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No files match your search criteria
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-green-50 flex items-center justify-center border-b">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#34a853"
                  className="w-12 h-12"
                >
                  <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
                </svg>
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{file.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarFallback className="text-[10px] bg-blue-100 text-blue-800">
                        {file.owner[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">{file.owner}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(file.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filteredFiles.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No files match your search criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilesSection;
