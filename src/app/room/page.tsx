"use client";
import { useContext } from "react";
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

export default function Page() {
  const roomContext = useContext(RoomContext);
  if (!roomContext) {
    throw new Error("RoomContext must be used within a RoomProvider");
  }
  const { room, key } = roomContext;
  const { date, setDate } = useContext(DateContext);

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
              onSelect={(day) => setDate(day)}
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