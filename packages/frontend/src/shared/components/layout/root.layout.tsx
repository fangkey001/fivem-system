import React from "react";

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="root-layout w-full min-h-screen">{children}</div>;
};
