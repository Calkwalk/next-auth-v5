"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/auth/user-button";

const Navar = () => {
  const pathname = usePathname();
  return (
    <div className="w-full">
      <div className="container border-b flex flex-row items-center justify-between p-4 shadow-sm mx-auto">
        <div className="flex gap-x-2">
          <Button
            asChild
            variant={pathname === "/server" ? "default" : "outline"}
          >
            <Link href="/server">Server</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/client" ? "default" : "outline"}
          >
            <Link href="/client">Client</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">Admin</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/settings" ? "default" : "outline"}
          >
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Navar;
