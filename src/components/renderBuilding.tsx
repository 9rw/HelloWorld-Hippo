"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import RenderTableComponent from "./renderTable";

type Building = Record<string, Record<string, string[]>>;

interface RenderBuildingProps {
  buildingName?: string;
}

const RenderBuilding: React.FC<RenderBuildingProps> = ({ buildingName }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nowRoom, setNowRoom] = useState<string | null>(null);
  const [buildings, setBuildings] = useState<Building>({});

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/rooms");
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const res = await response.json();
        if (res.success && Array.isArray(res.data)) {
          setBuildings(res.data[0]);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <p>Loading buildings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const renderBuildingImage = (name: string) => (
    <div className="relative flex flex-col justify-center items-center w-full h-[200px] overflow-hidden rounded-lg shadow-md shadow-secondary-foreground">
      <Image
        src={`/${name}.webp`}
        width={2560}
        height={1696}
        priority={true}
        alt={`${name}`}
        className="w-screen h-screen absolute -top-[160px] object-cover contrast-25 brightness-50"
      />
      <h1 className="absolute text-white lg:text-6xl md:text-4xl text-2xl">
        {name}
      </h1>
    </div>
  );
  const renderRoomButton = (buildingName: string) =>
    Object.entries(buildings[buildingName]).map(([floorName, rooms], k) => (
      <div key={k} className="mb-20">
        <h1 className="text-2xl text-secondary-foreground font-bold opacity-80 py-10 [text-shadow:_0_4px_5px_#00000070]">
          {floorName}
        </h1>
        <div className="flex flex-row flex-wrap gap-4">
          {rooms.map((room, l) => (
            <Button
              key={l}
              variant={nowRoom === room ? "building" : "secondary"}
              className="justify-self-center relative rounded-full min-w-max max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
              onClick={() => setNowRoom(room)}
            >
              {room}
            </Button>
          ))}
          <Button
            key={`all`}
            variant={"secondary"}
            className="relative rounded-full min-w- max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
          >
            ALL
          </Button>
        </div>
      </div>
    ));
  return (
    <div className="w-full h-max px-10 flex flex-col gap-10 py-20">
      {!buildingName &&
        Object.entries(buildings).map(([name], i) => (
          <div key={i} className="relative pb-20">
            <span id={`${name.slice(0, 2)}`} className="absolute top-[-164px]" />
            {renderBuildingImage(name)}
            {renderRoomButton(name)}
          </div>
        ))}

      {buildingName && (
        <div className="relative pb-20">
          <span id={`${buildingName.slice(0, 2)}`} className="absolute top-[-164px]" />
          {renderBuildingImage(buildingName)}
          {renderRoomButton(buildingName)}
        </div>
      )}
    </div>
  );
};

export default RenderBuilding;
