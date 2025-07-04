"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import * as React from "react";
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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Calendar } from "@/components/ui/calendar";

import Image from "next/image";

const FormSchema = z.object({
  detail: z.string().min(2, {
    message: "Detail must be at least 2 characters.",
  }),
  userEmail: z.string().email({
    message: "Invalid email address.",
  }),
  roomId: z.number().nullable(),
  buildingId: z.number().min(1, {
    message: "Building ID must be a positive number.",
  }),
  problemStartAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date.",
  }),
  problemEndAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date.",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;
type Building = Record<
  string,
  Record<string, Record<string, { id: number; name: string }>>
>;

export default function ReportForm() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openBuilding, setOpenBuilding] = useState(false);
  const [openFloor, setOpenFloor] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      detail: "",
      userEmail: "",
      roomId: null,
      buildingId: 1,
      problemStartAt: "",
      problemEndAt: "",
    },
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          "http://helloworld01.sit.kmutt.ac.th:3002/api/rooms"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const res = await response.json();
        if (res.success) {
          setBuildings(res.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const [data, setData] = useState<FormSchemaType | null>(null);

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setData(data);
    try {
      const response = await fetch(
        "http://helloworld01.sit.kmutt.ac.th:3002/report/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Report submitted successfully",
          description: "Your report has been submitted.",
        });
      } else {
        throw new Error(result.message || "Failed to submit report");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
  };

  if (loading) return <p>Loading buildings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6 bg-white h-[60dvh] overflow-auto flex flex-col items-start justify-start border-2 rounded-3xl p-6 shadow-md shadow-secondary-foreground/40"
      >
        <div className="flex flex-col items-start justify-center w-max">
          <Image
            src={`/logo/logo.svg`}
            width={200}
            height={100}
            priority={true}
            alt="logo"
          />
          <h1 className="text-[30px]">Reporting a problem</h1>
        </div>
        <div className="flex flex-col items-start justify-center w-full gap-2 *:w-full">
          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="@ad.sit.kmutt.ac.th" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row *:w-full gap-4">
            <FormField
              control={form.control}
              name="buildingId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Building</FormLabel>
                  <Popover open={openBuilding} onOpenChange={setOpenBuilding}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openBuilding}
                        className="w-[200px] justify-between"
                      >
                        {selectedBuilding
                          ? selectedBuilding
                          : "Select building..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search building..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No building found.</CommandEmpty>
                          <CommandGroup>
                            {Object.keys(buildings).map((building) => (
                              <CommandItem
                                key={building}
                                value={building}
                                onSelect={(currentValue) => {
                                  setSelectedBuilding(
                                    currentValue === selectedBuilding
                                      ? null
                                      : currentValue
                                  );
                                  setSelectedFloor(null);
                                  setSelectedRoom(null);
                                  setOpenBuilding(false);
                                }}
                              >
                                {building}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selectedBuilding === building
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <Popover open={openFloor} onOpenChange={setOpenFloor}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFloor}
                        className="w-[200px] justify-between"
                      >
                        {selectedFloor ? selectedFloor : "Select floor..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search floor..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No floor found.</CommandEmpty>
                          <CommandGroup>
                            {selectedBuilding &&
                              Object.keys(
                                buildings[selectedBuilding] || {}
                              ).map((floor) => (
                                <CommandItem
                                  key={floor}
                                  value={floor}
                                  onSelect={(currentValue) => {
                                    setSelectedFloor(
                                      currentValue === selectedFloor
                                        ? null
                                        : currentValue
                                    );
                                    setSelectedRoom(null);
                                    setOpenFloor(false);
                                  }}
                                >
                                  {floor}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      selectedFloor === floor
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Popover open={openRoom} onOpenChange={setOpenRoom}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openRoom}
                        className="w-[200px] justify-between"
                      >
                        {selectedRoom
                          ? selectedBuilding &&
                            selectedFloor &&
                            buildings[selectedBuilding]?.[selectedFloor]?.[
                              selectedRoom
                            ]?.name
                          : "Select room..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search room..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No room found.</CommandEmpty>
                          <CommandGroup>
                            {selectedBuilding &&
                              selectedFloor &&
                              Object.keys(
                                buildings[selectedBuilding][selectedFloor] || {}
                              ).map((room) => (
                                <CommandItem
                                  key={room}
                                  value={room}
                                  onSelect={(currentValue) => {
                                    setSelectedRoom(
                                      currentValue === selectedRoom
                                        ? null
                                        : currentValue
                                    );
                                    setOpenRoom(false);
                                  }}
                                >
                                  {
                                    buildings[selectedBuilding][selectedFloor][
                                      room
                                    ]?.name
                                  }
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      selectedRoom === room
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row *:w-full gap-4">
            <FormField
              control={form.control}
              name="problemStartAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start at</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            !startDate && "text-muted-foreground uppercase"
                          )}
                          aria-label="Select Date"
                        >
                          {startDate ? format(startDate, "PPP") : "Choose Date"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate ?? undefined}
                          onSelect={(day) => {
                            setStartDate(day ?? null);
                            field.onChange(
                              day ? format(day, "yyyy-MM-dd HH:mm:ss") : ""
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="problemEndAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End at</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            !endDate && "text-muted-foreground uppercase"
                          )}
                          aria-label="Select Date"
                        >
                          {endDate ? format(endDate, "PPP") : "Choose Date"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate ?? undefined}
                          onSelect={(day) => {
                            setEndDate(day ?? null);
                            field.onChange(
                              day ? format(day, "yyyy-MM-dd HH:mm:ss") : ""
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="detail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detail</FormLabel>
                <FormControl>
                  <Textarea placeholder="Type your detail here." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant={`building`}
          className="px-36 relative self-center before:rounded-md"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}