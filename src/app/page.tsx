import TimeTableComponent from "../components/timetable";
import AnnounceComponent from "../components/announce";
import Image from "next/image";

export default function page() {
  return (
    <>
    <section className="relative flex w-full h-screen flex-row items-start">
      <AnnounceComponent />
      <Image src="/SIT-Building.svg" alt="SIT" width="1440" height="738" className="w-full"></Image>
    </section>
    <section>
      <TimeTableComponent />
    </section>
    </>
  );
}
