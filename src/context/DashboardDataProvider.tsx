
"use client";

import * as React from "react";
// The context no longer holds data, so we don't need to import the data types.
// This provider is kept in case we need to share UI state across the dashboard in the future.

type DashboardDataContextType = {
    // This context is currently empty but can be used to share state between dashboard widgets if needed.
};

const DashboardDataContext = React.createContext<DashboardDataContextType | undefined>(undefined);

export function DashboardDataProvider({ children }: { children: React.ReactNode; }) {

  const value = {};

  return (
    <DashboardDataContext.Provider value={value}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = React.useContext(DashboardDataContext);
  if (context === undefined) {
    throw new Error("useDashboardData must be used within a DashboardDataProvider");
  }
  return context;
}
