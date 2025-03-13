"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Menu,
  Grid3X3,
  ArrowUpNarrowWide,
  Folder,
  Plus,
  MoreHorizontal,
  Star,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Your FileRow Component
interface FileRowProps {
  icon: "sheets" | "excel" | "docs" | "slides";
  title: string;
  owner: string;
  date: string;
  shared?: boolean;
  className?: string;
  actions?: React.ReactNode;
}

function FileRow({
  icon,
  title,
  owner,
  date,
  shared = false,
  className,
  actions,
}: FileRowProps) {
  const getIconColor = () => {
    switch (icon) {
      case "sheets":
        return "#34a853";
      case "excel":
        return "#217346";
      case "docs":
        return "#4285f4";
      case "slides":
        return "#f4b400";
      default:
        return "#34a853";
    }
  };

  const getIconSvg = () => {
    switch (icon) {
      case "sheets":
      case "excel":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={getIconColor()}
            className="w-5 h-5"
          >
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
          </svg>
        );
      case "docs":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={getIconColor()}
            className="w-5 h-5"
          >
            <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
          </svg>
        );
      case "slides":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={getIconColor()}
            className="w-5 h-5"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
            <path d="M7 12h10v2H7z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      href={`/spreadsheets/${title}`}
      className={cn(
        "flex items-center px-4 py-2 border-b last:border-b-0 group hover:bg-gray-50",
        className
      )}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="w-10 h-10 rounded flex items-center justify-center mr-3">
          {getIconSvg()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium truncate">{title}</h3>
          <div className="flex items-center mt-1">
            {owner === "me" ? (
              <span className="text-xs text-gray-500">me</span>
            ) : (
              <div className="flex items-center">
                {owner !== "--" && (
                  <Avatar className="h-4 w-4 mr-1">
                    <AvatarFallback className="text-[8px] bg-blue-100 text-blue-800">
                      {owner.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <span className="text-xs text-gray-500">{owner}</span>
              </div>
            )}
            {shared && (
              <div className="flex items-center ml-2">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                <span className="text-xs text-gray-500">Shared</span>
              </div>
            )}
            <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
        </div>
      </div>
      {actions}
    </Link>
  );
}

// Sample file data
const sampleFiles = [
  {
    id: 1,
    title: "Untitled spreadsheet",
    owner: "me",
    date: "2025-03-13 19:57:00",
    shared: false,
    starred: false,
    type: "sheets",
  },
  {
    id: 2,
    title: "To-do list",
    owner: "me",
    date: "2025-03-07",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: 3,
    title: "Kenyan Indie Maker Community top talent",
    owner: "Peter Okwara",
    date: "2025-02-09",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: 4,
    title: "Case Numbers in each 1000 for all consulates",
    owner: "--",
    date: "2025-02-04",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: 5,
    title: "Injured & deceased protestors",
    owner: "--",
    date: "2024-06-26",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: 6,
    title: "Finance Bill 2024 Voting",
    owner: "--",
    date: "2024-06-20",
    shared: true,
    starred: false,
    type: "sheets",
  },
  {
    id: 7,
    title: "Remote/Frontend Jobs",
    owner: "Vishal Rajput",
    date: "2023-10-04",
    shared: true,
    starred: true,
    type: "sheets",
  },
  {
    id: 8,
    title: "Event Registration (Responses)",
    owner: "me",
    date: "2023-04-17",
    shared: false,
    starred: false,
    type: "sheets",
  },
];

export default function GoogleSheetsUI() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filterOwner, setFilterOwner] = useState<"anyone" | "me" | "others">(
    "anyone"
  );
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  // Filter and search logic
  const filteredFiles = useMemo(() => {
    let result = [...sampleFiles];

    // Apply owner filter
    if (filterOwner === "me") {
      result = result.filter((file) => file.owner === "me");
    } else if (filterOwner === "others") {
      result = result.filter(
        (file) => file.owner !== "me" && file.owner !== "--"
      );
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (file) =>
          file.title.toLowerCase().includes(query) ||
          file.owner.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [searchQuery, filterOwner, sortBy]);

  // Group files by time period for list view
  const groupedFiles = useMemo(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      today: filteredFiles.filter(
        (f) => new Date(f.date).toDateString() === today.toDateString()
      ),
      lastWeek: filteredFiles.filter((f) => {
        const fileDate = new Date(f.date);
        return fileDate < today && fileDate >= weekAgo;
      }),
      earlier: filteredFiles.filter((f) => new Date(f.date) < weekAgo),
    };
  }, [filteredFiles]);

  const renderActions = (file: (typeof sampleFiles)[0]) => (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Star
          className={`h-4 w-4 ${
            file.starred ? "text-yellow-500 fill-yellow-500" : ""
          }`}
        />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Open with</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Move</DropdownMenuItem>
          <DropdownMenuItem>
            {file.starred ? "Remove from starred" : "Add to starred"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 mr-8">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
            </svg>
          </div>
          <span className="text-lg font-medium">Sheets</span>
        </div>
        <div className="flex-1 max-w-3xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search in Sheets"
              className="w-full py-2 pl-10 pr-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center ml-4 gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Google apps</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 h-9 w-9 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-200"
              >
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-13%20at%207.57.57%E2%80%AFPM-3YyKNYyBTy3VuJgGQuYcsOK3RJVvkE.png"
                    alt="User"
                  />
                  <AvatarFallback className="bg-blue-200 text-blue-800">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="flex items-center gap-3 p-3 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-13%20at%207.57.57%E2%80%AFPM-3YyKNYyBTy3VuJgGQuYcsOK3RJVvkE.png"
                    alt="User"
                  />
                  <AvatarFallback className="bg-blue-200 text-blue-800">
                    U
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">User Name</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
              </div>
              <DropdownMenuItem className="cursor-pointer">
                Manage your Google Account
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Add another account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Create New Button */}
      <div className="fixed bottom-8 right-8 z-10">
        <Button className="rounded-full h-14 w-14 shadow-lg bg-white hover:bg-gray-100 border border-gray-200">
          <Plus className="h-6 w-6 text-green-600" />
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Filters Bar */}
        <div className="sticky top-0 bg-white border-b px-4 py-2 z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant={filterOwner === "anyone" ? "default" : "outline"}
              size="sm"
              className="text-sm gap-1 h-8"
              onClick={() => setFilterOwner("anyone")}
            >
              <Filter className="h-3.5 w-3.5 mr-1" />
              Anyone
            </Button>
            <Button
              variant={filterOwner === "me" ? "default" : "outline"}
              size="sm"
              className="text-sm gap-1 h-8"
              onClick={() => setFilterOwner("me")}
            >
              Owned by me
            </Button>
            <Button
              variant={filterOwner === "others" ? "default" : "outline"}
              size="sm"
              className="text-sm gap-1 h-8"
              onClick={() => setFilterOwner("others")}
            >
              Shared with me
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm h-8">
                  Sort by: {sortBy === "date" ? "Date" : "Title"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("date")}>
                  Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  Title
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      viewMode === "grid" && "bg-gray-100"
                    )}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      viewMode === "list" && "bg-gray-100"
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <ArrowUpNarrowWide className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Folder className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Folders</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Files Section */}
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
                        icon={
                          file.type as "sheets" | "excel" | "docs" | "slides"
                        }
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
                        icon={
                          file.type as "sheets" | "excel" | "docs" | "slides"
                        }
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
                        icon={
                          file.type as "sheets" | "excel" | "docs" | "slides"
                        }
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
                    <h3 className="font-medium text-sm truncate">
                      {file.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback className="text-[10px] bg-blue-100 text-blue-800">
                            {file.owner[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">
                          {file.owner}
                        </span>
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
      </main>
    </div>
  );
}
