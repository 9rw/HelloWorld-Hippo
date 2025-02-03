"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Announce() {
  const [isAnnounceOpen, setIsAnnouceOpen] = useState<boolean>(true);
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <>
      {isAnnounceOpen && (
        <div className="z-[99] fixed w-full h-full flex justify-center items-center">
          <div
            className="absolute w-full h-full bg-secondary-foreground/50 backdrop-blur-sm"
            onClick={() => setIsAnnouceOpen(false)}
          />
          <div className="absolute flex flex-col w-[80dvw] h-max text-[#4A0000] bg-white justify-start items-center gap-6 p-10 rounded-xl border-2 border-[#4A0000] top-[200]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Announcement
            </h1>
            <span className="text-base font-semibold text-wrap text-center">
              Rules for any personnel authorized to book a classroom / a
              computer training room
            </span>
            <hr className="h-0.5 w-[40%] bg-[#4A0000]" />
            <p className="text-center">
              Any instructor, teaching assistant, or personnel who has booked a
              classroom or a computer training room must take care of all
              teaching equipment and turn off the lights and the
              air-conditioners after each use. If you fail to comply, and the
              damage is found, the school shall treat this as your negligence
              and you may be liable for such damage.
            </p>
            <div className="font-semibold w-max flex flex-col items-center self-end">
              <p>Effective {date}</p>
              <p>School of Information Technology</p>
            </div>
            <Button
              variant={"link"}
              className="text-[#4A0000] font-bold"
              type="button"
              onClick={() => setIsAnnouceOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
