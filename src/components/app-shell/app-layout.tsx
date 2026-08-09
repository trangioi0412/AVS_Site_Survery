"use client";

import React from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { Toaster } from "sonner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex w-screen h-screen bg-background text-text-primary overflow-hidden">
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: "#0d1420",
            border: "1px solid #24344b",
            color: "#f8fafc",
          },
        }}
      />
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
