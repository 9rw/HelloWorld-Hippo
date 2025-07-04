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
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  description: z.string().min(2, {
    message: "Write your description.",
  }),
  times: z.custom<{ arg: string }>(),
  firstName: z.string().min(2, {
    message: "Firstname must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Lastname must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Set your title.",
  }),
  roomId: z.string().min(1, {
    message: "Room not valid.",
  })
});
// interface ReserveFormProps {
//   building: string;
//   room: string;
//   reserve: Reserve;
// }

// interface Reserve {
//   [key: string]: {
//     start: string;
//     end: string;
//   };
// }


export function ReserveForm(p: any) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      firstName: "",
      lastName: "",
      email: "",
      roomId: ""
    },
  });
  
  useEffect(() => {
    form.setValue("times", p.reserve.slice(1));
  }, [p.reserve]);
  
  useEffect(() => {
    form.setValue("roomId", p.room);
  }, [p.building, p.room]);

  
  
  function onSubmit(data: z.infer<typeof FormSchema>) {
    form.reset();
    fetch('http://helloworld01.sit.kmutt.ac.th:3002/reservation/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        toast({
          title: "Reservation Successful",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(result, null, 2)}</code>
            </pre>
          ),
        });
      })
      .catch(error => {
        toast({
          title: "Reservation Failed",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-red-500 p-4">
              <code className="text-white">{error.message}</code>
            </pre>
          ),
        });
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-2/3 space-y-6 bg-white h-[85dvh] overflow-auto flex flex-col items-start justify-start border-2 rounded-3xl p-6 shadow-md shadow-secondary-foreground/40"
      >
        <div className="flex flex-col items-center justify-center w-max">
          <Image src={`/logo/logo.svg`} width={200} height={100} priority={true} alt="logo"/>
          <h1 className="text-[30px]">Reservation</h1>
        </div>
        <div className="flex flex-col items-start justify-center w-full gap-2 *:w-full">
          <FormField
            control={form.control}
            name="email"
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row *:w-full gap-4">
            <FormField
              control={undefined}
              name="building"
              render={() => (
                <FormItem>
                  <FormLabel>Building</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Building"
                      disabled
                      required={false}
                      value={`${p.building}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Room"
                      disabled
                      required={false}
                      {...field}
                      value={`${p.roomName}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={undefined}
              name="start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Start Time"
                      disabled
                      required={false}
                      {...field}
                      value={`${Object.values(p.reserve.slice(1)).map((x: any) => x.start)}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={undefined}
              name="end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="End Time"
                      disabled
                      required={false}
                      {...field}
                      value={`${Object.values(p.reserve.slice(1)).map((x: any) => x.end)}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <hr className="w-1/2 my-10" />
          <div className="flex flex-col *:w-full gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-row justify-center items-center w-full gap-2">
          <FormField
            control={undefined}
            name="agree"
            render={() => (
              <FormItem>
                <div className="flex flex-row items-center justify-start gap-2">
                <FormControl>
                  <Input type="checkbox" id="cb" className="p-0 size-4" />
                </FormControl>
                <FormLabel htmlFor="cb">I accept the booking conditions.</FormLabel>
                </div>
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
          Reserve
        </Button>
      </form>
    </Form>
  );
}
