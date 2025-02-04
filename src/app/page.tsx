"use client";
import TimeTableComponent from "../components/timetable";
import AnnounceComponent from "../components/announce";
import Image from "next/image";
import TestComponent from "../components/renderBuilding";

export default function page() {
  return (
    <>
      <section className="relative flex w-full h-screen flex-row items-start">
        {/* <AnnounceComponent /> */}
        <Image
          src="/SIT Building.webp"
          alt="SIT"
          width={2560}
          height={1696}
          className="absolute w-full h-screen object-cover"
        ></Image>
      </section>
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
