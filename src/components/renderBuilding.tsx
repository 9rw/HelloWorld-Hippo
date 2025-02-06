"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { set } from "date-fns";

const areas = [
  {
    value: "CB2 Building",
    label: "CB2 Building",
  },
  {
    value: "LX Building",
    label: "LX Building",
  },
  {
    value: "SIT Building",
    label: "SIT Building",
  },
];
type Building = Record<string, Record<string, string[]>>;

export default function renderBuilding(p: any) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nowRoom, setNowRoom] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [buildings, setBuidling] = useState<Building>({});

  // const floor = Object.entries(data)[0][0]
  // const roomList = Object.entries(data)[0][1]

  // const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  // const [page, setPage] = useState(<div>select something</div>);
  // const [building, setBuilding] = useState<Building>({}); // { floor: [room1, room2, ...] }
  useEffect(() => {
    fetch("http://localhost:3002/api/rooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        return response.json();
      })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setBuidling(res.data[0]);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Loading buildings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full h-max px-10 flex flex-col gap-6">
      {p.buildingName && (
        <div className="relative flex flex-col justify-center items-center w-full h-[200px] overflow-hidden rounded-lg shadow-md shadow-secondary-foreground">
          <Image
            src={`/${p.buildingName}.webp`}
            width={2560}
            height={1696}
            priority={true}
            alt={`CB2 Building`}
            className="w-screen h-screen absolute -top-[160px] object-cover contrast-25 brightness-50"
          />
          <h1 className="absolute text-white lg:text-6xl md:text-4xl text-2xl">
            {p.buildingName}
          </h1>
        </div>
      )}

      {p.buildingName &&
        Object.entries(buildings?.[p.buildingName]).map(
          ([floorName, rooms]: [string, string[]], k) => {
            return (
              <div key={k}>
                <h1 className="text-2xl text-secondary-foreground font-bold opacity-80 py-10 [text-shadow:_0_4px_5px_#00000070]">
                  {floorName}
                </h1>
                <div className="flex flex-row flex-wrap gap-4">
                  {rooms.map((room, l) => (
                    <Button
                      key={l}
                      variant={`${nowRoom === room ? "building" : "secondary"}`}
                      className="justify-self-center relative rounded-full min-w-max max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
                      onClick={() => {
                        setNowRoom(() => room);
                      }}
                    >
                      {room}
                    </Button>
                  ))}
                  <Button
                    key={`k`}
                    variant={"secondary"}
                    className="relative rounded-full min-w- max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
                  >
                    ALL
                  </Button>
                </div>
              </div>
            );
          }
        )}
    </div>
  );
}
