"use client";
import React from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, Globe, Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Nav() {
  return (
    <nav className="z-50 fixed top-0 flex justify-between items-center px-10 py-4 w-full h-[164px] bg-white text-primary-background border-b-2 border-primary-foreground/20 shadow-lg">
      <div className="min-w-[200px] min-h-[100px] max-h-[100px] max-w-[200px] max-sm:min-w-[50px] max-sm:min-h-[50px] max-sm:max-h-[50px]">
        <Image
          src="/logo.svg"
          width={0}
          height={0}
          alt={"Logo"}
          priority={true}
          className="w-full h-full object-fill"
        ></Image>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between items-center bg-white border-2 border-[#0d3168dd] rounded-lg w-full h-[50px]">
          <Input
            name="search"
            type="search"
            placeholder="SEARCH FOR ACTIVITIES"
            className="bg-white border-0 shadow-[0] w-full h-full"
          ></Input>
          <Button variant={"outline"} className="h-full border-0">
            <Search />
          </Button>
        </div>
        <div className="flex flex-row gap-6 justify-start items-center max-sm:hidden">
          {["CB2", "LX Building", "SIT Building"].map((building, index) => (
            <Button
              key={index}
              variant={"building"}
              className="relative before:rounded-md w-max px-[3dvw] shadow-md shadow-[#0d316891] mt-4"
            >
              {building}
            </Button>
          ))}
        </div>
      </div>
      <div className="relative w-max h-[100px] mt-[10px] flex items-start flex-row max-lg:mt-[5px] max-md:mt-0">
        <div className="flex flex-row max-lg:hidden">
          <Button variant={"link"}>
            <Globe />
          </Button>
          <Button variant={"link"}>EN</Button>
          <hr className="h-[36px] w-[1px] bg-black" />
          <Button variant={"link"}>TH</Button>
        </div>
        <div className="flex flex-row gap-2 max-lg:hidden">
          <Button variant={"secondary"}>Help</Button>
          <Button variant={"secondary"}>Report</Button>
        </div>
        <Popover>
        <PopoverTrigger asChild>
          <button className="max-lg:ml-10 max-lg:self-center">
            <Menu size={40}/>
          </button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-2 p-2">
            <Button variant={"building"} className="relative before:rounded-md">Booking History</Button>
            <Button variant={"building"} className="relative before:rounded-md">Report Rooms</Button>
            <Button variant={"building"} className="relative before:rounded-md">Help</Button>
            <Button variant={"link"} className="w-max p-0 self-center">contact</Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
