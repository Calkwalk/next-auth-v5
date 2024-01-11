"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { MdLogout, MdSettings } from "react-icons/md";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";

const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="pb-4">
        <div className="px-4 pt-5 pb-3 font-semibold border-b">
            <p>{user?.name}</p>
            <p>{user?.email}</p>
        </div>
        <DropdownMenuItem className="pt-5 pb-3 border-b">
          <div className="w-full flex flex-row gap-x-4 items-center cursor-pointer">
            <MdSettings className="text-xl" />
            Settings
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="pt-5 pb-3 border-b">
          <LogoutButton>
            <div className="w-full flex flex-row gap-x-4 items-center cursor-pointer">
              <MdLogout className="text-xl" />
              Logout
            </div>
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
