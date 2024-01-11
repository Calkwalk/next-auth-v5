import React from "react";
import Navbar from "./_components/navbar";
interface ProtectedLayoutProps {
  children: React.ReactNode;
}
const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <main className="h-full w-full flex flex-col bg-gradient-to-b from-sky-500 to-blue-800">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
    </main>
  );
};

export default ProtectedLayout;
