'use client'
import { createContext, useState } from "react";

export const DateContext = createContext<{
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}>({
  date: undefined,
  setDate: () => {},
});

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};