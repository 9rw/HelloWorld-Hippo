"use client";
import Image from "next/image";
import { format } from "date-fns";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import ReportFormComponent from "@/components/reportForm";

interface Report {
  detail: string;
  buildingName: string;
  roomName: string;
  problem_start_at: string;
  problem_end_at: string;
  userEmail: string;
}

export default function Page() {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://helloworld01.sit.kmutt.ac.th:3002/report/allreport")
      .then((response) => response.json())
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <section className="px-[40px] relative flex flex-col justify-center items-center h-screen w-full">
        <h1 className="text-white lg:text-6xl md:text-4xl text-2xl drop-shadow-[0_4px_10px_#000000a0]">
          Loading...
        </h1>
      </section>
    );
  }

  return (
    <section className="px-[40px] relative flex flex-col justify-center items-center h-screen w-full">
      <div className="flex flex-row justify-between w-full">
        <h1 className="px-4 self-start text-white lg:text-6xl md:text-4xl text-2xl drop-shadow-[0_4px_10px_#000000a0]">
          Reports
        </h1>
        <Button
          variant={"destructive"}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="mt-4"
        >
          New Report
        </Button>
      </div>
      <Image
        src={`/background/SIT Building.webp`}
        width={2560}
        height={1696}
        alt="SIT Building"
        className="-z-10 absolute w-full h-screen object-cover"
      />
      <div className="w-full px-4">
        <div className="overflow-x-auto rounded-3xl border-2 border-white overflow-hidden shadow-md shadow-secondary-foreground/40">
          <table className="bg-white shadow-md w-full max-w-full shadow-secondary-foreground/40">
            <thead className="bg-[#0d3168] text-white">
              <tr className="*:px-8 *:border-x-2 *:border-black">
                <th>Problem</th>
                <th>Building</th>
                <th>Room</th>
                <th className="min-w-[20dvh]">Start</th>
                <th className="min-w-[20dvh]">End</th>
                <th>User</th>
              </tr>
            </thead>
            <tbody className="text-thin">
              {data.map((value, index) => (
                <tr key={index} className="*:px-8 *:border-2 *:border-black">
                  <td className="border-x-2 border-secondary-foreground/25 overflow-auto">
                    {value.detail}
                  </td>
                  <td className="border-x-2 border-secondary-foreground/25 overflow-auto">
                    {value.buildingName}
                  </td>
                  <td className="border-x-2 border-secondary-foreground/25 overflow-auto">
                    {value.roomName}
                  </td>
                  <td className="border-x-2 border-secondary-foreground/25 w-max">
                    {format(new Date(value.problem_start_at), "yyyy-MM-dd")}
                  </td>
                  <td className="border-x-2 border-secondary-foreground/25 w-max">
                    {format(new Date(value.problem_end_at), "yyyy-MM-dd")}
                  </td>
                  <td className="border-x-2 border-secondary-foreground/25 overflow-auto">
                    {value.userEmail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpen && (
        <div className="z-[50] backdrop-blur-sm fixed top-0 left-0 w-full min-h-screen h-max bg-black bg-opacity-50 flex flex-col justify-center items-center">
          <ReportFormComponent />
          <div
            className="absolute -z-10 min-h-screen w-full"
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </section>
  );
}
