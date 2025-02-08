'use client'
import { createContext, useState } from "react";

export const RoomContext = createContext({
  room: "",
  setRoom: (room: string) => {},
  key: "0",
  setKey: (key: string) => {},
});

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [room, setRoom] = useState<string>("");
  const [key, setKey] = useState<string>("0");

  return (
    <RoomContext.Provider value={{ room, setRoom , key, setKey}}>
      {children}
    </RoomContext.Provider>
  );
};
