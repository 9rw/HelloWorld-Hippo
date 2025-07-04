'use client'
import { createContext, useState } from "react";

// Define the context type with the expected values
interface RoomContextType {
  room: string;
  setRoom: (room: string) => void;
  key: string;
  setKey: (key: string) => void;
}

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [room, setRoom] = useState<string>("");
  const [key, setKey] = useState<string>("0");

  return (
    <RoomContext.Provider value={{ room, setRoom, key, setKey }}>
      {children}
    </RoomContext.Provider>
  );
};
