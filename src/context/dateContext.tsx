'use client'
import { createContext, useState } from "react";

export const DateContext = createContext<{
  date: Date;
  setDate: (date: Date ) => void;
}>({
  date: new Date(),
  setDate: () => {},
});

export const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};