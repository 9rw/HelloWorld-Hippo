"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function footer() {
  return (
    <footer className="text-[#DFDFDF] bg-[#041224] w-full h-max max-lg:px-0 px-[100px] py-20">
      <div className="flex flex-row justify-center h-max gap-10 max-md:flex-col">
        <div className="flex flex-col">
          <Image
            src="/logo-white.svg"
            alt="SIT"
            width={200}
            height={100}
            className=""
          />
          <span className="bg-white text-black mt-8 px-12 py-1 rounded-md w-max">
            Reservation
          </span>
        </div>
        <div className="flex flex-col">
          <h4 className="text-[20px] py-4">Menu</h4>
          <div className="flex justify-between items-start flex-col h-full">
            <Button variant={`link`} className="text-white p-0 text-sm">
              Check the rooms
            </Button>
            <Button variant={`link`} className="text-white p-0 text-sm">
              Building Areas
            </Button>
            <Button variant={`link`} className="text-white p-0 text-sm">
              Reservation
            </Button>
            <Button variant={`link`} className="text-white p-0 text-sm">
              Help
            </Button>
            <Button variant={`link`} className="text-white p-0 text-sm">
              Report
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <h4 className="text-[20px] py-4">Contact</h4>
          <div className="flex justify-between items-start flex-col h-full">
            <span className="flex flex-row items-center text-sm">
              <Image
                src={`/icons/phone.svg`}
                width={20}
                height={20}
                alt="phone"
                className="mr-4"
              />
              <Link href={`#`}>+662 470 9850</Link>
            </span>
            <span className="flex flex-row items-center text-sm">
              <Image
                src={`/icons/location.svg`}
                width={20}
                height={20}
                alt="location"
                className="mr-4"
              />
              <Link href={`#`}>
                126 Pracha Uthit Road, Bang Mot Subdistrict, Thung Khru
                District, Bangkok 10140
              </Link>
            </span>
            <span className="flex flex-row items-center text-sm">
              <Image
                src={`/icons/email.svg`}
                width={20}
                height={20}
                alt="email"
                className="mr-4"
              />
              <Link href={`#`}>webadmin@sit.kmutt.ac.th</Link>
            </span>
            <span className="flex flex-row items-center text-sm">
              <Image
                src={`/icons/line.svg`}
                width={20}
                height={20}
                alt="line"
                className="mr-4"
              />
              <Link href={`#`}>@sit.kmutt</Link>
            </span>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="min-h-max min-w-max">
            <div className="size[58px]">
              <Image
                src={`/icons/facebook.svg`}
                width={58}
                height={58}
                alt="facebook"
                className="max-lg:size-[40] self-start duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
          </div>
          <div className="min-h-max min-w-max">
            <div className="size[58px]">
              <Image
                src={`/icons/instagram.svg`}
                width={58}
                height={58}
                alt="instagram"
                className="max-lg:size-[40] self-start duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
          </div>
          <div className="min-h-max min-w-max">
            <div className="size[58px]">
              <Image
                src={`/icons/youtube.svg`}
                width={58}
                height={58}
                alt="youtube"
                className="max-lg:size-[40] self-start duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="justify-self-center w-[70%] my-8" />
      <p className="text-sm text-center mb-6">
        Copyright © 2025 King Mongkut’s University of Technology Thonburi, All
        rights reserved
      </p>
      <div className="text-[12px] flex flex-row justify-center items-center gap-8 h-max max-sm:flex-col">
        <span>
          <Button variant={"link"} className="text-white text-[12px]">
            Reservation conditions
          </Button>
        </span>
        <hr className="w-[1px] h-[24px] bg-white" />
        <span>
          <Button variant={"link"} className="text-white text-[12px]">
            Cookie Policy
          </Button>
        </span>
        <hr className="w-[1px] h-[24px] bg-white" />
        <span>
          <Button variant={"link"} className="text-white text-[12px]">
            Website Feedback
          </Button>
        </span>
      </div>
    </footer>
  );
}
