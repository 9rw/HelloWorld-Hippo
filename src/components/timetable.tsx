import React, { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Check, Send, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimeSlot {
  time: string;
}

const generateTimeSlots = (start: Date, end: Date, interval: number): TimeSlot[] => {
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
};

const rooms = ["CB2301", "CB2304", "CB2305", "CB2306"];

const RenderTable: React.FC<{
  name: string;
  timeSlots: Record<string, TimeSlot[]>;
  selectedSlots: Record<string, number[]>;
  handleMouseDown: (part: string, timeIndex: number) => void;
  handleMouseEnter: (timeIndex: number, part: string) => void;
  handleMouseUp: () => void;
}> = ({ name, timeSlots, selectedSlots, handleMouseDown, handleMouseEnter, handleMouseUp }) => (
  <div key={name} className="mb-5">
    <h3 className="text-lg font-bold opacity-70 capitalize">{name}</h3>
    <table
      className="w-full border-collapse border border-black select-none"
      onMouseUp={handleMouseUp}
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
          {timeSlots[name].map((_, timeIndex) => (
            <td
              key={timeIndex}
              className={`h-20 border border-black text-center cursor-pointer duration-300 hover:bg-gray-200
              ${selectedSlots[name]?.includes(timeIndex) ? "bg-slate-600" : ""}`}
              onMouseDown={() => handleMouseDown(name, timeIndex)}
              onMouseEnter={() => handleMouseEnter(timeIndex, name)}
            ></td>
          ))}
        </tr>
      </tbody>
    </table>
  </div>
);

const TimeTable: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [roomID, setRoom] = useState<string>(rooms[0]);
  const [titleText, setTitle] = useState<string>("");
  const [selectedSlots, setSelectedSlots] = useState<Record<string, number[]>>({});
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    title: string;
    room: string;
    selectedTimes: Record<string, string[]>;
  }>({
    title: titleText,
    room: roomID,
    selectedTimes: { morning: [], afternoon: [], evening: [] },
  });

  const timePeriods = useMemo(() => [
    { name: "morning", start: 8, end: 12 },
    { name: "afternoon", start: 12.5, end: 16.5 },
    { name: "evening", start: 17, end: 22 },
  ], []);

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
  }, [timePeriods]);

  const handleMouseDown = useCallback((part: string, timeIndex: number) => {
    setIsSelecting(true);
    setSelectedSlots((prev) => ({
      ...prev,
      [part]: prev[part]?.includes(timeIndex) ? [] : [timeIndex],
    }));
    setFormData((prevData) => ({
      ...prevData,
      selectedTimes: {
        ...prevData.selectedTimes,
        [part]: prevData.selectedTimes[part]?.includes(timeSlots[part][timeIndex]?.time)
          ? []
          : [timeSlots[part][timeIndex]?.time],
      },
    }));
  }, [timeSlots]);

  const handleMouseEnter = useCallback((timeIndex: number, part: string) => {
    if (isSelecting) {
      setSelectedSlots((prev) => {
        const updatedSlots = {
          ...prev,
          [part]: [...(prev[part] || []), timeIndex],
        };
        setFormData((prevData) => ({
          ...prevData,
          selectedTimes: {
            ...prevData.selectedTimes,
            [part]: updatedSlots[part].map((index) => timeSlots[part][index]?.time),
          },
        }));
        return updatedSlots;
      });
    }
  }, [isSelecting, timeSlots]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  const handleReserveClick = useCallback(() => {
    const hasSelection = Object.values(formData.selectedTimes).some((arr) => arr.length > 0);
    if (!hasSelection) {
      toast({
        title: "No time slot selected",
        description: "You must select at least one time slot before reserving.",
        variant: "destructive",
      });
    } else {
      setIsFormOpen(true);
    }
  }, [formData.selectedTimes, toast]);

  const groupTimesIntoRanges = useCallback((times: string[]): string[] => {
    const ranges: string[] = [];
    let rangeStart = 0;
    if (times[rangeStart] !== undefined) {
      ranges.push(`${times[rangeStart]}-${times[times.length - 1]}`);
    } else {
      ranges.push("Not selected");
    }
    return ranges;
  }, []);

  const handleRoomSelection = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const selectedRoom = event.currentTarget.value;
    setRoom(selectedRoom);
    setFormData((prevData) => ({ ...prevData, room: selectedRoom }));
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const formattedTimes: Record<string, string[]> = {};
    Object.keys(formData.selectedTimes).forEach((period) => {
      formattedTimes[period] = groupTimesIntoRanges(formData.selectedTimes[period]);
    });

    toast({
      title: `Reservation ${formData.room} sent`,
      description: `Times: ${new Date()}`,
    });

    const payload = formData;
    console.log(payload);
    setSelectedSlots({});
    setTitle("");
    setFormData({
      title: titleText,
      room: roomID,
      selectedTimes: { morning: [], afternoon: [], evening: [] },
    });

    setIsFormOpen(false);
  }, [formData, groupTimesIntoRanges, roomID, titleText, toast]);

  return (
    <div className="w-full h-[200vh] px-10 pt-[194px] flex flex-col gap-6">
      <div className="flex flex-row gap-5 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] h-[50px] justify-start text-left font-normal shadow-md shadow-[#0d316891]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
        <div className="flex gap-2">
          <Button variant={`lecture`}>Lecturer</Button>
          <Button variant={`staff`}>Student / Staff</Button>
        </div>
      </div>

      {timePeriods.map(({ name }) => (
        <RenderTable
          key={name}
          name={name}
          timeSlots={timeSlots}
          selectedSlots={selectedSlots}
          handleMouseDown={handleMouseDown}
          handleMouseEnter={handleMouseEnter}
          handleMouseUp={handleMouseUp}
        />
      ))}
      <Button
        onClick={handleReserveClick}
        variant={Object.values(formData.selectedTimes).some((arr) => arr.length > 0) ? "default" : "outline"}
        className="self-center"
      >
        Reserve
      </Button>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white min-w-80 p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-2">Booking Details</h2>
            <form onSubmit={handleSubmit}>
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                required
                value={titleText}
                onChange={handleTitleChange}
                placeholder="Enter title"
              />
              <div className="mt-2 text-sm text-gray-500">
                <strong>Selected Times:</strong>
                {Object.keys(formData.selectedTimes).map((period) => (
                  <div key={period} className="ml-5">
                    <strong>{period}:</strong>{" "}
                    {groupTimesIntoRanges(formData.selectedTimes[period].sort()).join(", ")}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Button variant="outline" type="reset" onClick={() => setIsFormOpen(false)}>
                  <X />
                </Button>
                <Button type="submit" onClick={() => setFormData({ ...formData, title: titleText })}>
                  <Check /> Confirm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTable;