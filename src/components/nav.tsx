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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"

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
        
        {/* Help Button with dialog */}
        <div className="flex flex-row gap-2 max-lg:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"secondary"}>Help</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="min-w-[200px] min-h-[100px] max-h-[100px] max-w-[200px] max-sm:min-w-[50px] max-sm:min-h-[50px] max-sm:max-h-[50px]">
                <Image
                  src="/logo.svg"
                  width={219}
                  height={112}
                  alt={"Logo"}
                  priority={true}
                  className="w-full h-full object-fill"
                ></Image>

              </div>
            </DialogHeader>
            <DialogTitle>
              <h1 className=" font-normal text-2xl mt-3 text-[#1B2845]">Help</h1>
            </DialogTitle>
            <DialogDescription>
            <h2 className="mt-4 text-xl text-[#1B2845]">
              How to log in ？
            </h2>
            <div className="text-gray-700 text-sm leading-relaxed max-h-[400px] overflow-y-auto mt-4">
              <p className="text-sm text-[#1B2845] indent-10">
                  Those who have the right to access the room reservation system must be employees within the Faculty only, using the same login and password as SIT-mail if the person wishing to reserve a room is a Faculty student. Please contact your Educational Services Officer or Student Developer.
              </p>
            </div>
            <h2 className="mt-4 text-xl text-[#1B2845]">
            Why can't I delete or change a booking ？
            </h2>
            <div className="text-gray-700 text-sm leading-relaxed max-h-[400px] overflow-y-auto mt-4">
              <p className="text-sm text-[#1B2845] indent-10">
              To delete or change a room reservation Only the person who created the booking has the right to delete or change their booking. You cannot delete or change someone else's booking.
              </p>
            </div>

            <h2 className="mt-4 text-xl text-[#1B2845]">What are the different colors when booking a room ?</h2>
            <div className="mt-5 flex flex-row ">
              <Button className=" w-[117px] h-[40px] bg-[#9D64A7] border-[1px] border-solid border-black ">Lecturer</Button>
              <Button className=" w-[154px] h-[40px] bg-[#D988B9] border-[1px] border-solid border-black ml-2">Student / Staff</Button>
            </div>

            <h2 className="mt-4 text-xl text-[#1B2845]">How can I view the booking schedule ?</h2>
            <p className="text-sm text-[#1B2845] indent-10 mt-4">  Looking at the room booking time, each channel is 30 minutes, for example, booking a room for 1 hours is 8:30-10:00 a.m. The highlighted colors cover 4 channels as shown in the picture.</p>
            <div className="mt-3 flex flex-row">
            <Image
                  src="/Help column.webp"
                  width={886}
                  height={169}
                  alt={"Logo"}
                  priority={true}
                  className="w-full h-full object-fill"
                ></Image>
            </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>

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
