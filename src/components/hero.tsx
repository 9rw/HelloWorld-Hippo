"use client";
import { useState } from "react";
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

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [date, setDate] = useState<Date | undefined>();
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
        <div className="text-secondary-foreground/50 flex flex-row gap-5 justify-center items-center h-14 my-8 max-lg:flex-col">
          <Button
            variant={"outline"}
            role="combobox"
            className="w-[200px] justify-between uppercase"
          >
            Building Area
            <ChevronsUpDown className="opacity-50" />
          </Button>
          <hr className="w-[1px] h-full bg-white" />
          <Button
            variant={"outline"}
            role="combobox"
            className="w-[200px] justify-between uppercase"
          >
            Room
            <ChevronsUpDown className="opacity-50" />
          </Button>
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
