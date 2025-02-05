"use client";
import TimeTableComponent from "../components/timetable";
import AnnounceComponent from "../components/announce";
import Image from "next/image";
import TestComponent from "../components/renderBuilding";
import { Button } from "@/components/ui/button";
import HeroComponent from "../components/hero";

export default function page() {
  return (
    <>
      <HeroComponent />
      {/* <section>
        <TimeTableComponent />
      </section> */}
      <section className="relative flex w-full h-max flex-col items-start">
        <h1 className="text-5xl text-[#0d3168dd] text-center w-full my-20">
          Have fun using the classroom.
        </h1>
        <TestComponent />
      </section>
    </>
  );
}
