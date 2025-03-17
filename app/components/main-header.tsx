import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import React, { useEffect } from "react";
import { useUserStore } from "../store";
import { useVeltClient } from "@veltdev/react";
import Link from "next/link";

interface MainHeaderProps {
  searchQuery: string;
  setSearchQuery: (e: string) => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const { user, login, logout } = useUserStore();

  const { client } = useVeltClient();
  const loginDummyUser = () => {
    const dummyUser = {
      uid: "12345",
      displayName: "John Doe",
      email: "john.doe@example.com",
      photoURL:
        "https://robohash.org/cef02e24fe3282152a3f4b57eb0de839?set=set2&bgset=bg1&size=400x400",
      organizationId: "org-123",
      colorCode: "#3b82f6",
      textColor: "#ffffff",
    };
    login(dummyUser);
  };

  const logoutDummyUser = () => {
    logout();
  };

  useEffect(() => {
    if (client && user) {
      const veltUser = {
        userId: user.uid,
        organizationId: user.organizationId,
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        color: user.colorCode,
        textColor: user.textColor,
      };

      client.identify(veltUser);
    }
  }, [client, user]);
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b shadow-sm">
      <div className="flex items-center gap-2 mr-8">
        <Link
          href="/"
          className="w-8 h-8 bg-green-600 rounded flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5"
          >
            <path d="M3 3h18v18H3V3zm16 16V5H5v14h14z" />
          </svg>
        </Link>
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
        {user ? (
          <Button
            variant="ghost"
            onClick={logoutDummyUser}
            className="text-gray-600 hover:bg-gray-100"
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={loginDummyUser}
            className="text-gray-600 hover:bg-gray-100"
          >
            Login
          </Button>
        )}

        <Button
          variant="ghost"
          className="p-0 h-9 w-9 rounded-full overflow-hidden border-2 border-transparent hover:border-gray-200"
        >
          <Avatar className="h-full w-full">
            <AvatarImage
              src={user?.photoURL || "https://example.com/avatar.jpg"}
              alt="User"
            />
            <AvatarFallback className="bg-blue-200 text-blue-800">
              {user?.displayName[0] || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
};

export default MainHeader;
