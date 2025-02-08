"use client";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const data = {
  success: true,
  data: [
    {
      id: 5,
      detail: "projector and air conditioner broken",
      roomName: "Lecture Room 5",
      buildingName: "IT Building",
      problem_start_at: "2024-04-08T02:00:00.000Z",
      problem_end_at: "2024-04-08T04:00:00.000Z",
      userEmail: "67130500009@ad.sit.kmutt.ac.th",
    },
    {
      id: 6,
      detail: "Electricity issue in the entire building",
      roomName: null,
      buildingName: "Library",
      problem_start_at: "2024-04-08T02:00:00.000Z",
      problem_end_at: "2024-04-08T04:00:00.000Z",
      userEmail: "67130500009@ad.sit.kmutt.ac.th",
    },
  ],
};

export default function page() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section className="relative flex justify-center items-center h-screen w-full bg-white">
      {/* <Image src={`/background/SIT Building.webp`} width={2560} height={1696} alt="SIT Buidlding"/> */}
      <div>
      {data && (
        <div>test</div>
      )

      }

      </div>
    </section>
  );
}
