"use client";

import { useState, useMemo } from "react";
import { Plus, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sampleFiles } from "@/lib/sheetData";
import FiltersBar from "./features/filters-bar";
import FilesSection from "./features/files-section";
import Header from "./features/header";

export default function GoogleSheetsUI() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filterOwner, setFilterOwner] = useState<"anyone" | "me" | "others">(
    "anyone"
  );
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  const filteredFiles = useMemo(() => {
    let result = [...sampleFiles];

    if (filterOwner === "me") {
      result = result.filter((file) => file.owner === "me");
    } else if (filterOwner === "others") {
      result = result.filter(
        (file) => file.owner !== "me" && file.owner !== "--"
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (file) =>
          file.title.toLowerCase().includes(query) ||
          file.owner.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [searchQuery, filterOwner, sortBy]);

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
      <Header
        type="main"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="fixed bottom-8 right-8 z-10">
        <Button className="rounded-full h-14 w-14 shadow-lg bg-white hover:bg-gray-100 border border-gray-200">
          <Plus className="h-6 w-6 text-green-600" />
        </Button>
      </div>
      <main className="flex-1 overflow-auto">
        <FiltersBar
          filterOwner={filterOwner}
          setFilterOwner={setFilterOwner}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <FilesSection
          viewMode={viewMode}
          groupedFiles={groupedFiles}
          renderActions={renderActions}
          filteredFiles={filteredFiles}
        />
      </main>
    </div>
  );
}
