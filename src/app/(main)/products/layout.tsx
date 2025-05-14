import { ReactNode } from "react";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 bg-background">
      {children}
    </div>
  );
}