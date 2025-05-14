// File: app/settings/layout.tsx
import React from "react";
import { Sidebar } from "./_components/sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
        <div className="sticky top-0 h-screen ">
        {/* <Sidebar />       */}
        </div>
    
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
}