"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
interface TimeSlot {
  time: string;
}
interface RenderTableProps {
  roomId: string;
  date: Date | undefined;
}


interface TimePeriod {
  start: string;
  end: string;
}

interface ReservationTimes {
  morning?: TimePeriod;
  afternoon?: TimePeriod;
  evening?: TimePeriod;
}

interface ReservationRequest {
  title: string;
  description: string;
  times: ReservationTimes[];
  firstName: string;
  lastName: string;
  email: string;
  roomId: number;
}

export default function RenderTable({ roomId, date }: RenderTableProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [part, setPart] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, number[]>>({});
  const [formData, setFormData] = useState<{ selectedTimes: Record<string, string[]> }>({
    selectedTimes: {},
  });
  const [initialIndex, setInitialIndex] = useState<number | null>(null);
  const [data, setData] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        if (date !== undefined) {
          const responseRoom = await fetch(
            `http://helloworld01.sit.kmutt.ac.th:3002/api/rooms/room-schedule?roomId=${roomId}&date=${date ? format(date, "yyyy-MM-dd") : ""}`
          );
          if (!responseRoom.ok) {
            throw new Error("Failed to fetch data");
          }
          const res = await responseRoom.json();
          if (res.success) {
            setReservations(res.data);
          } else {
            throw new Error("Invalid data format");
          }
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    setSelectedSlots({});
    fetchRooms();
  }, [roomId, date]);

  const generateTimeSlots = useCallback(
    (start: Date, end: Date, interval: number): TimeSlot[] => {
      const times: TimeSlot[] = [];
      let currentTime = start;
      while (currentTime <= end) {
        times.push({
          time: `${currentTime.getHours().toString().padStart(2, "0")}:${currentTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
        });
        currentTime = new Date(currentTime.getTime() + interval * 60000);
      }
      return times;
    },
    []
  );

  const timePeriods = useMemo(
    () => [
      { name: "morning", start: 8, end: 12 },
      { name: "afternoon", start: 12.5, end: 16.5 },
      { name: "evening", start: 17, end: 22 },
    ],
    []
  );

  const timeSlots = useMemo(() => {
    const slots: Record<string, TimeSlot[]> = {};
    timePeriods.forEach(({ name, start, end }) => {
      const startDate = new Date();
      const endDate = new Date();
      startDate.setHours(Math.floor(start), (start % 1) * 60, 0, 0);
      endDate.setHours(Math.floor(end), (end % 1) * 60, 0, 0);
      slots[name] = generateTimeSlots(startDate, endDate, 30);
    });
    return slots;
  }, [timePeriods, generateTimeSlots]);

  const getReservationDetails = (slotTime: string) => {
    return reservations.find((reservation) => {
      const slotDate = parseISO(`${format(date ?? new Date(), "yyyy-MM-dd")}T${slotTime}:00`);
      return isWithinInterval(slotDate, {
        start: parseISO(reservation.reservationStart),
        end: parseISO(reservation.reservationEnd),
      });
    });
  };

  const isTimeSlotSelected = (nowAt: string, timeIndex: number) => {
    return selectedSlots[nowAt]?.includes(timeIndex);
  };

  const handleMouseDown = useCallback(
    (nowAt: string, timeIndex: number) => {
      setIsSelecting(true);
      setPart(nowAt);
      setInitialIndex(timeIndex);
      setSelectedSlots((prev) => ({
        ...prev,
        [nowAt]: [timeIndex],
      }));
      setFormData((prevData) => ({
        ...prevData,
        selectedTimes: {
          ...prevData.selectedTimes,
          [nowAt]: [timeSlots[nowAt][timeIndex]?.time],
        },
      }));
    },
    [timeSlots]
  );

  const handleMouseEnter = useCallback(
    (timeIndex: number, nowAt: string) => {
      if (isSelecting && nowAt === part) {
        setSelectedSlots((prev) => {
          const updatedSlots = {
            ...prev,
            [nowAt]: Array.from(
              new Set([...prev[nowAt], ...Array.from({ length: Math.abs(timeIndex - initialIndex!) + 1 }, (_, i) => Math.min(timeIndex, initialIndex!) + i)])
            ),
          };
          setFormData((prevData) => ({
            ...prevData,
            selectedTimes: {
              ...prevData.selectedTimes,
              [nowAt]: updatedSlots[nowAt].map(
                (index) => timeSlots[nowAt][index]?.time
              ),
            },
          }));
          return updatedSlots;
        });
      }
    },
    [isSelecting, part, initialIndex, timeSlots]
  );

  

  const handleReserveClick = async () => {
    const formattedData = Object.entries(formData.selectedTimes).reduce((acc, [nowAt, times]) => {
      if (times.length > 0) {
        const [startHours, startMinutes] = times[0].split(":").map(Number);
        const [endHours, endMinutes] = times[times.length - 1].split(":").map(Number);
        const dateStart = new Date(date ?? new Date());
        const dateEnd = new Date(date ?? new Date());
        dateStart.setHours(startHours, startMinutes, 0, 0);
        dateEnd.setHours(endHours, endMinutes, 0, 0);
        acc[nowAt] = {
          datestart: format(dateStart, "yyyy-MM-dd' 'HH:mm:ss"),
          dateend: format(dateStart, "yyyy-MM-dd' 'HH:mm:ss"),
        };
      }
      return acc;
    }, {} as Record<string, { datestart: string; dateend: string }>);
    try {
      const response = await fetch('http://helloworld01.sit.kmutt.ac.th:3002/reservation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }
  
      const result = await response.json();
      console.log('Reservation successful', result);
    } catch (error) {
      console.error('Error creating reservation:', error);
    }

    console.log('Reserve button clicked', formattedData);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col w-full">
      {Object.keys(timeSlots).map((name) => (
        <div key={name} className="mb-5">
          <h3 className="text-lg font-bold opacity-70 capitalize">{name}</h3>
          <table
            className="w-full border-collapse border border-black select-none"
            onMouseUp={() => setIsSelecting(false)}
          >
            <thead>
              <tr className="bg-transparent border-2 border-black">
                {timeSlots[name].map((slot, timeIndex) => (
                  <th key={timeIndex} className="border border-black p-2">
                    {slot.time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="relative border-2 border-black">
                {timeSlots[name].map((slot, timeIndex) => {
                  const reservationDetails = getReservationDetails(slot.time);
                  if (reservationDetails) {
                    return (
                      <td
                        key={`${name}-${timeIndex}`}
                        className={`relative h-20 border border-black text-center cursor-pointer duration-300 hover:bg-gray-200`}
                      >
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="flex flex-col text-[10px] text-white border border-black bg-lecturer">
                              <span>{reservationDetails.title}</span>
                              <span>({reservationDetails.status})</span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="h-max w-full bg-lecturer border-2 border-lecturer-shadow">
                            <div className="text-lecturer-shadow relative text-[8px] flex gap-[4px] flex-col h-max w-max">
                              <p className="bg-lecturer-shadow text-white text-center rounded-sm py-1 uppercase">{reservationDetails.title}</p>
                              <div>
                              <p>Description</p>
                              <p className="bg-lecturer font-thin brightness-150 border-lecturer-shadow border-2 rounded-sm">{reservationDetails.description}</p>
                              </div>
                              <div>
                              <p>Create by</p>
                              <p className="bg-lecturer font-thin brightness-150 border-lecturer-shadow border-2 rounded-sm">{reservationDetails.createdBy}</p>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    );
                  }
                  return (
                    <td
                      key={`${name}-${timeIndex}`}
                      className={`h-20 border border-black text-center cursor-pointer duration-300 hover:bg-gray-200 ${
                        isTimeSlotSelected(name, timeIndex) ? "bg-slate-400" : ""
                      }`}
                      onMouseDown={() => handleMouseDown(name, timeIndex)}
                      onMouseEnter={() => handleMouseEnter(timeIndex, name)}
                    ></td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      <Button
        onClick={handleReserveClick}
        variant={
          Object.values(formData.selectedTimes).some((arr) => arr.length > 1)
            ? "default"
            : "outline"
        }
        className="self-center mb-20"
      >
        Reserve
      </Button>
    </div>
    
  );
}