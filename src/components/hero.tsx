"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import AnnounceComponent from "@/components/announce";

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
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const areas = [
  {
    value: "CB2 Building",
  },
  {
    value: "LX Building",
  },
  {
    value: "SIT Building",
  },
];

type Building = Record<string, Record<string, string[]>>;

export default function Hero() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building>({});
  const [rooms, setRooms] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const res = await response.json();
        if (res.success && Array.isArray(res.data)) {
          setBuildings(res.data[0]);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRooms();
  }, []);
  
  return (
    <section className="relative flex w-full h-screen flex-row justify-center items-center">
      <AnnounceComponent />
      <div className="mt-[164px] absolute text-white z-[1] flex w-full h-full flex-col items-center justify-center -top-[164px]">
        <h1 className="lg:text-6xl md:text-4xl text-2xl drop-shadow-[0_4px_10px_#000000a0]">
          School of Information Teachnology
        </h1>
        <h3 className="text-lg drop-shadow-[0_4px_8px_#000000a0]">
          Classroom booking system via website
        </h3>
        <div className="text-secondary-foreground/50 flex flex-row gap-5 justify-center items-center h-max my-8 max-lg:flex-col">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between ml-[40px]"
              >
                {value
                  ? areas.find((areas) => areas.value === value)?.value
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
                        {areas.value}
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
          <hr className="w-[1px] h-full bg-white" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                role="combobox"
                className="w-[200px] justify-between uppercase"
              >
                Room
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
            <Command>
                <CommandInput placeholder="Search areas" className="h-9" />
                <CommandList>
                  <CommandEmpty>No room found.</CommandEmpty>
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
                        {areas.value}
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
          <hr className="w-[1px] h-full bg-white" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal shadow-md shadow-[#0d316891]",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? (
                  format(date, "PPP")
                ) : (
                  <span className="uppercase">Choose Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant={"building"}
          className="relative uppercase bg-[#0d3168] before:rounded-md"
        >
          check the rooms
        </Button>
      </div>
      <Image
        src="/SIT Building.webp"
        alt="SIT"
        width={2560}
        height={1696}
        className="z-0 absolute w-full h-screen object-cover"
      />
    </section>
  );
}
