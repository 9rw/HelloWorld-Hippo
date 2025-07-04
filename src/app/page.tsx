"use client";
import { useState } from "react";

import RenderBuildingComponent from "../components/renderBuilding";
import HeaderComponent from "../components/header"

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
import { Button } from "@/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";
const areas = [
  {
    value: "CB2 Building"
  },
  {
    value: "LX Building"
  },
  {
    value: "SIT Building"
  },
];

export default function Page() {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  return (
    <>
      <HeaderComponent />
      <section className="relative flex w-full h-max flex-col items-start">
        <h1 className="text-[#0d3168dd] text-center w-full my-20 lg:text-6xl md:text-4xl text-2xl">
          Have fun using the classroom.
        </h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="text-secondary-foreground/50 w-[200px] justify-between ml-[40px]"
            >
              {value
                ? areas.find((area) => area.value === value)?.value
                : "Building Areas"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search areas" className="h-9" />
              <CommandList>
                <CommandEmpty>No areas found.</CommandEmpty>
                <CommandGroup>
                  {areas.map((area) => (
                    <CommandItem
                      key={area.value}
                      value={area.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {area.value}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === area.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <RenderBuildingComponent buildingName={value} />
      </section>
    </>
  );
}