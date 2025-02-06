"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
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

const areas = [
  {
    value: "CB2 Building",
    label: "CB2 Building",
  },
  {
    value: "LX Building",
    label: "LX Building",
  },
  {
    value: "SIT Building",
    label: "SIT Building",
  },
];
interface Building {
  [floor: string]: string[];
}

export default function RoomList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  // const [page, setPage] = useState(<div>select something</div>);
  // const [building, setBuilding] = useState<Building>({}); // { floor: [room1, room2, ...] }
  useEffect(() => {
    fetch("http://localhost:3002/api/rooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        return response.json();
      })
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setData(res.data);
        } else {
          throw new Error("Invalid data format");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  if (loading) return <p>Loading buildings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full h-max px-10 flex flex-col gap-6">
    </div>
  );
}
