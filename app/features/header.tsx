import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { useVeltClient, VeltPresence } from "@veltdev/react";

import Link from "next/link";
import React, { Ref, useEffect } from "react";
import { useUserStore } from "@/store/user-store";

interface HeaderProps {
  type: "main" | "sheets";
  measureRef?: Ref<HTMLSpanElement>;
  filename?: string;
  inputRef?: Ref<HTMLInputElement>;
  setFilename?: (value: string) => void;
  handleTitleFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  type,
  measureRef,
  filename,
  inputRef,
  setFilename,
  handleTitleFocus,
  searchQuery,
  setSearchQuery,
}) => {
  const { user, login, logout, generateRandomUser } = useUserStore();
  const { client } = useVeltClient();

  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      const storedUser = localStorage.getItem("user-storage");
      if (!storedUser) {
        login(generateRandomUser());
      }
    }
  }, [user, login, generateRandomUser]);

  // Regular login function
  const loginDummyUser = () => {
    login(generateRandomUser());
  };

  useEffect(() => {
    if (!client || !user) return;
    const veltUser = {
      userId: user.uid,
      organizationId: "org-user007",
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoURL,
      color: user.colorCode,
      textColor: user.textColor,
    };

    client.identify(veltUser);
  }, [client, user]);

  return (
    <header
      className={`flex items-center justify-between ${
        type === "sheets"
          ? "p-2 border-b bg-white"
          : "px-4 py-2 border-b shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
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
          </Link>
          {type === "sheets" && filename !== undefined && setFilename && (
            <div className="relative">
              <span
                ref={measureRef}
                className="invisible absolute whitespace-pre"
                style={{ fontWeight: 500, fontSize: "1.125rem" }}
              >
                {filename}
              </span>
              <Input
                ref={inputRef}
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                onFocus={handleTitleFocus}
                className="text-lg font-medium h-9 focus-visible:ring-1 px-2 py-1"
                style={{
                  width: `${
                    Math.max(
                      (measureRef as React.RefObject<HTMLSpanElement>)?.current
                        ?.offsetWidth ?? 0,
                      120
                    ) + 24
                  }px`,
                  minWidth: "20px",
                  maxWidth: "400px",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {type === "main" && (
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
              onChange={(e) => setSearchQuery?.(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center ml-4 gap-4">
        <VeltPresence />
        {user ? (
          <>
            <span className="text-gray-700 font-medium">
              {user.displayName}
            </span>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-gray-600 hover:bg-gray-100"
            >
              Change User
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            onClick={loginDummyUser}
            className="text-gray-600 hover:bg-gray-100"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
