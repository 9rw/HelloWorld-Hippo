import TableComponent from "../pages/table";
import TimeTableComponent from "../pages/timetable";
import AnnounceComponent from "../pages/announce";

export default function page() {
  return (
    <>
      <AnnounceComponent />
      <TimeTableComponent />
    </>
  );
}
