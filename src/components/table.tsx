"use client";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react"

interface TimeSlot {
  time: string;
}

const generateTimeSlots = (
  start: Date,
  end: Date,
  interval: number
): TimeSlot[] => {
  const times: TimeSlot[] = [];
  let currentTime = start;
  while (currentTime < end) {
    times.push({
      time: `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    });
    currentTime = new Date(currentTime.getTime() + interval * 60000);
  }
  return times;
};

const rooms: string[] = ["CB2301", "CB2302", "CB2303", "CB2304", "CB2305"];
const days: string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TableExample: React.FC = () => {
  const { toast } = useToast();

  const startTime = new Date();
  startTime.setHours(8, 0, 0, 0);
  const endTime = new Date();
  endTime.setHours(22, 0, 0, 0);
  const timeSlots: TimeSlot[] = generateTimeSlots(startTime, endTime, 30);

  const [selectedSlots, setSelectedSlots] = useState<Record<string, number[]>>(
    {}
  );
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [startSlot, setStartSlot] = useState<number | null>(null);
  const [currentDay, setCurrentDay] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    startTime: string;
    endTime: string;
    room: string;
    day: string | null;
  }>({
    startTime: "08:00",
    endTime: "22:00",
    room: rooms[0],
    day: null,
  });

  const handleMouseDown = (timeIndex: number, day: string) => {
    setIsSelecting(true);
    setStartSlot(timeIndex);
    setCurrentDay(day);
    setSelectedSlots({ [day]: [timeIndex] });
  };

  const handleMouseEnter = (timeIndex: number, day: string) => {
    if (isSelecting && startSlot !== null && currentDay === day) {
      const newSelectedSlots = Array.from(
        { length: Math.abs(startSlot - timeIndex) + 1 },
        (_, i) => Math.min(startSlot, timeIndex) + i
      );
      setSelectedSlots({ [day]: newSelectedSlots });
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (currentDay !== null && selectedSlots[currentDay]) {
      setFormData({
        ...formData,
        startTime: timeSlots[selectedSlots[currentDay][0]].time,
        endTime:
          timeSlots[
            selectedSlots[currentDay][selectedSlots[currentDay].length - 1]
          ].time,
        day: currentDay,
      });
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking details: ", formData);
    setIsFormOpen(false);
  };

  return (
    <div
      className="m-4 rounded-lg overflow-auto border-2"
      onMouseUp={handleMouseUp}
    >
      <table className="w-full border-collapse border border-gray-300 select-none">
        <thead>
          <tr className="bg-orange-500">
            <th className="border border-orange-500 p-2">Time/Day</th>
            {days.map((day, dayIndex) => (
              <th key={dayIndex} className="border border-orange-500 p-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((slot, timeIndex) => (
            <tr key={timeIndex}>
              <th className="border border-orange-500 bg-[#311912] text-center">
                {slot.time}
              </th>
              {days.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={`relative border border-orange-800 text-center cursor-pointer duration-300
                    hover:before:bg-[#c8b39980] before:z-1 before:left-0 before:top-0 before:absolute before:w-full before:h-full ${
                      selectedSlots[day]?.includes(timeIndex)
                        ? "bg-orange-800"
                        : "bg-transparent"
                    }`}
                  onMouseDown={() => handleMouseDown(timeIndex, day)}
                  onMouseEnter={() => handleMouseEnter(timeIndex, day)}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-2">Booking Details</h2>
            <form onSubmit={handleSubmit}>
              {/* <div className="mb-2">
                <label className="block mb-1">Day</label>
                <input
                  type="text"
                  value={formData.day || ""}
                  readOnly
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Start Time</label>
                <input
                  type="text"
                  value={formData.startTime}
                  readOnly
                  className="border p-2 w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">End Time</label>
                <input
                  type="text"
                  value={formData.endTime}
                  readOnly
                  className="border p-2 w-full"
                />
              </div> */}
              <Label htmlFor="title">Title</Label>
              <Input type="text" id="title"></Input>
              <div className="flex justify-evenly">
                <Button variant={"outline"} type="reset" onClick={() => setIsFormOpen(false)}>
                  <X />
                </Button>
                <Button
                  type="submit"
                  onClick={() => {
                    toast({
                      title: `Reservation sent ${formData.room}`,
                      description: "Friday, February 10, 2023 at 5:57 PM",
                    });
                  }}
                >
                  <Check />
                  Reserve
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableExample;
