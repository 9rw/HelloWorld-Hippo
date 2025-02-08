"use client";
import { useContext, useEffect, useState, useCallback } from "react";
import { RoomContext } from "@/context/roomContext";
import { DateContext } from "@/context/dateContext";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import RenderTableComponent from "@/components/renderTable";

interface TimeSlot {
  time: string;
}

interface Reservation {
  reservationId: number;
  title: string;
  description: string;
  status: string;
  reservationStart: string;
  reservationEnd: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

type Building = Record<
  string,
  Record<string, Record<string, { id: number; name: string }>>
>;

export default function Page() {
  const { room, key } = useContext(RoomContext);
  const { date, setDate } = useContext(DateContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRoom, setLoadingRoom] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nowRoom, setNowRoom] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building>({});
  const [reserve, setReserve] = useState<Reservation>({
    reservationId: 0,
    title: "",
    description: "",
    status: "",
    reservationStart: "",
    reservationEnd: "",
    createdAt: "",
    updatedAt: "",
    createdBy: "",
  });

  const fetchreserve = useCallback(async (roomId: number) => {
    setLoadingRoom(true);
    try {
      const response = await fetch(
        `http://helloworld01.sit.kmutt.ac.th:3002/api/rooms/room-schedule?roomId=${roomId}&date=${
          date ? format(date, "yyyy-MM-dd") : ""
        }`
      );
      if (!response.ok) throw new Error("Failed to fetch schedule");
      const res = await response.json();
      if (res.success) {
        setReserve(res.data[0]);
      } else {
        throw new Error("Invalid schedule format");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoadingRoom(false);
    }
  }, [date]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://helloworld01.sit.kmutt.ac.th:3002/api/rooms");
        if (!response.ok) throw new Error("Failed to fetch data");
        const res = await response.json();
        if (res.success) {
          setBuildings(res.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    if (key && date) {
      fetchreserve(Number(key));
    }
    console.log(buildings);
  }, [key, date, fetchreserve]);

  if (loading) return <p>Loading buildings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full h-max px-10 pt-[194px] flex flex-col gap-6">
      <div className="flex flex-row gap-5 items-center">
        <Link href={`/`}>
          <Image
            src={`/icons/home.svg`}
            width={42}
            height={42}
            alt="home"
            className="fill-red-400"
          />
        </Link>
        <h1 className="text-2xl text-secondary-foreground font-bold opacity-80 py-2 [text-shadow:_0_4px_5px_#00000070]">
          {room ? room : "No room selected"}
        </h1>
      </div>
      <div className="flex flex-row gap-5 items-center">
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
              {date ? format(date, "PPP") : "Choose Date"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => {
                setDate(day);
                fetchreserve(Number(key));
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="flex gap-2">
          <Button variant={`lecture`}>Lecturer</Button>
          <Button variant={`staff`}>Student / Staff</Button>
        </div>
      </div>

      <RenderTableComponent roomId={key} date={date} buildingName={room} roomName={room} />
    </div>
  );
}