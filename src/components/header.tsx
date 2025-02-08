"use client";
import { useState, useEffect, useContext, useMemo } from "react";
import Image from "next/image";

import AnnounceComponent from "@/components/announce";
import { RoomContext } from "../context/roomContext";
import { DateContext } from "../context/dateContext";

import { Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
import { useRouter } from "next/navigation";

const areas = [
  { value: "CB2 Building" },
  { value: "LX Building" },
  { value: "SIT Building" },
];

type Building = Record<
  string,
  Record<string, Record<string, { id: number; name: string }>>
>;

export default function Hero() {
  const router = useRouter();
  const { room, setRoom, key, setKey } = useContext(RoomContext);
  const { date, setDate } = useContext(DateContext);
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building>({});
  const [rooms, setRooms] = useState<{ id: number; name: string }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [openArea, setOpenArea] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://helloworld01.sit.kmutt.ac.th:3002/api/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const res = await response.json();
        if (res.success) {
          setBuildings(res.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: 1000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [toast]);

  const handleAreaSelect = useMemo(() => (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpenArea(false);
    setRooms([]);
    Object.keys(buildings[currentValue]).forEach((building) => {
      Object.keys(buildings[currentValue][building]).forEach((room) => {
        setRooms((rooms) => [...rooms, buildings[currentValue][building][room]]);
      });
    });
  }, [buildings, value]);

  const handleRoomSelect = useMemo(() => (currentValue: string) => {
    const selectedRoomObj = rooms.find((room) => room.name === currentValue);
    if (selectedRoomObj) {
      setSelectedRoom(currentValue === selectedRoom ? "" : currentValue);
      setOpenRoom(false);
      setKey(selectedRoomObj.id.toString());
    }
  }, [rooms, selectedRoom]);

  const handleCheckRooms = async () => {
    if (!selectedRoom) {
      return toast({
        title: "No room selected",
        description: "You must select a room before checking.",
        variant: "destructive",
        duration: 1000,
      });
    }
    if (!date) {
      return toast({
        title: "No date selected",
        description: "You must select a date before checking.",
        variant: "destructive",
        duration: 1000,
      });
    }
    setDate(date);
    setRoom(selectedRoom);
    toast({
      title: "Checking the room",
      description: `Redirecting to ${selectedRoom} on ${format(date, "PPP")}.`,
      variant: "default",
      duration: 1000,
    });
    router.push(`/room`);
  };

  return (
    <section className="relative flex w-full h-screen flex-row justify-center items-center">
      <AnnounceComponent />
      <div className="mt-[164px] absolute text-white z-[1] flex w-full h-full flex-col items-center justify-center -top-[164px]">
        <h1 className="lg:text-6xl md:text-4xl text-2xl drop-shadow-[0_4px_10px_#000000a0]">
          School of Information Technology
        </h1>
        <h3 className="text-lg drop-shadow-[0_4px_8px_#000000a0]">
          Classroom booking system via website
        </h3>
        <div className="text-secondary-foreground/50 flex flex-row gap-5 justify-center items-center h-max my-8 max-lg:flex-col">
          <Popover open={openArea} onOpenChange={setOpenArea}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openArea}
                aria-label="Select Building Area"
                className="w-[200px] justify-between uppercase text-left font-normal shadow-md shadow-[#0d316891]"
              >
                {value
                  ? areas.find((area) => area.value === value)?.value
                  : "Building Area"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search area" className="h-9" />
                <CommandList>
                  <CommandEmpty>No areas found.</CommandEmpty>
                  <CommandGroup>
                    {areas.map((area) => (
                      <CommandItem
                        key={area.value}
                        value={area.value}
                        onSelect={() => handleAreaSelect(area.value)}
                      >
                        {area.value}
                        <Check
                          className={cn(
                            "ml-auto",
                            value === area.value ? "opacity-100" : "opacity-0"
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
          <Popover open={openRoom} onOpenChange={setOpenRoom}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openRoom}
                aria-label="Select Room"
                className="w-[200px] justify-between uppercase text-left font-normal shadow-md shadow-[#0d316891]"
              >
                {selectedRoom ? selectedRoom : "room"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder="Search room" className="h-9" />
                <CommandList>
                  <CommandEmpty>No rooms found.</CommandEmpty>
                  <CommandGroup>
                    {rooms &&
                      rooms.map((room) => (
                        <CommandItem
                          key={room.id}
                          value={room.name}
                          onSelect={() => handleRoomSelect(room.name)}
                        >
                          {room.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedRoom === room.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    <CommandItem
                      value="Room 101"
                      onSelect={() => setSelectedRoom(() => null)}
                    >
                      {!rooms.length && "Select the area"}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <hr className="w-[1px] h-full bg-white" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-between text-left font-normal shadow-md shadow-[#0d316891]",
                  !date && "text-muted-foreground uppercase"
                )}
                aria-label="Select Date"
              >
                {date ? (
                  format(date, "PPP")
                ) : (
                  "Choose Date"
                )}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(day) => setDate(day ?? undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="building"
          className="relative uppercase bg-[#0d3168] before:rounded-md w-[200px] font-normal shadow-md shadow-[#0d316891]"
          aria-label="Check the rooms"
          onClick={handleCheckRooms}
        >
          Check the room
        </Button>
      </div>
      {loading && <div className="absolute z-10">Loading...</div>}
      {error && <div className="absolute z-10 text-red-500">{error}</div>}
      <Image
        src="/SIT Building.webp"
        alt="SIT"
        width={2560}
        height={1696}
        priority={true}
        className="z-0 absolute w-full h-screen object-cover"
      />
    </section>
  );
}