import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Filter, Grid3X3, ArrowUpNarrowWide, Folder } from "lucide-react";
import React from "react";

interface FiltersBarProps {
  filterOwner: string;
  setFilterOwner: (value: "anyone" | "me" | "others") => void;
  sortBy: string;
  setSortBy: (value: "title" | "date") => void;
  viewMode: string;
  setViewMode: (value: "grid" | "list") => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({
  filterOwner,
  setFilterOwner,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
}) => {
  return (
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
                className={cn("h-8 w-8", viewMode === "grid" && "bg-gray-100")}
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
                className={cn("h-8 w-8", viewMode === "list" && "bg-gray-100")}
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
  );
};

export default FiltersBar;
