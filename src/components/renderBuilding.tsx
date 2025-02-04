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

const areas = [
  {
    value: "CB Building",
    label: "CB Building",
  },
  {
    value: "LX Building",
    label: "LX Building",
  },
  {
    value: "SIT Building",
    label: "SIT Building",
  }
];
interface Building {
  [floor: string]: string[];
}

export default function RoomList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [ddiv, setDdiv] = useState(<div>Show Joo</div>);
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
          setData(res.data);
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? areas.find((areas) => areas.value === value)?.label
              : "Building Areas"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search areas" className="h-9" />
            <CommandList>
              <CommandEmpty>No areas found.</CommandEmpty>
              <CommandGroup>
                {areas.map((areas) => (
                  <CommandItem
                    key={areas.value}
                    value={areas.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {areas.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === areas.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {data.map(
        (b: { [s: string]: Building } | ArrayLike<Building>, i: any) => {
          const buildings = Object.keys(b);
          const roomList: Building[] = Object.values(b);
          let page = buildings.map((buildingName, j) => (
            <div key={j} className="flex flex-col mb-20">
              <div className="relative flex flex-col justify-center items-center w-full h-[200px] overflow-hidden rounded-lg shadow-md shadow-secondary-foreground">
                <Image
                  src={`/${buildingName}.webp`}
                  width={2560}
                  height={1696}
                  priority={true}
                  alt={buildingName}
                  className="w-screen h-screen absolute -top-[160px] object-cover contrast-25 brightness-50"
                />
                <h1 className="absolute text-white lg:text-6xl md:text-4xl text-2xl">
                  {buildingName}
                </h1>
              </div>
              {Object.entries(roomList[j]).map(([floorName, rooms], k) => {
                return (
                  <div key={k} className="flex flex-col w-full">
                    <h1 className="text-2xl text-secondary-foreground font-bold opacity-80 py-10 [text-shadow:_0_4px_5px_#00000070]">
                      {floorName}
                    </h1>
                    <div className="flex flex-row flex-wrap gap-4">
                      {rooms.map((room, l) => (
                        <Button
                          key={l}
                          variant={
                            selectedBuilding === room ? "building" : "secondary"
                          }
                          className="justify-self-center relative rounded-full min-w-max max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
                          value={room}
                          onClick={() => setSelectedBuilding(room)}
                        >
                          {room}
                        </Button>
                      ))}
                      <Button
                        key={k}
                        variant={"secondary"}
                        className="relative rounded-full min-w- max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
                        onClick={() => setSelectedBuilding(null)}
                      >
                        ALL
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ));
          return page;
        }
      )}
    </div>
  );
}
