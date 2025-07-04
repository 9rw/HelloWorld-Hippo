"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

import RenderTable from "./renderTable";

type Building = Record<
  string,
  Record<string, Record<string, { id: number; name: string }>>
>;

interface RenderBuildingProps {
  buildingName?: string;
}

const RenderBuilding: React.FC<RenderBuildingProps> = ({ buildingName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nowRoom, setNowRoom] = useState<number | null>(null);
  const [buildings, setBuildings] = useState<Building>({});
  const toDayDate = useMemo(() => new Date(), []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("http://helloworld01.sit.kmutt.ac.th:3002/api/rooms");
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

  const renderBuildingImage = useCallback(
    (name: string) => (
      <div className="relative flex flex-col justify-center items-center w-full h-[200px] overflow-hidden rounded-lg shadow-md shadow-secondary-foreground">
        <Image
          src={`/background/${name}.webp`}
          width={2560}
          height={1696}
          priority={true}
          alt={name}
          className="w-screen h-screen absolute -top-[160px] object-cover contrast-25 brightness-50"
        />
        <h1 className="absolute text-white lg:text-6xl md:text-4xl text-2xl">
          {name}
        </h1>
      </div>
    ),
    []
  );

  const renderRoomButton = useCallback(
    (buildingName: string) => {
      if (!buildings[buildingName]) return <p>Building not found</p>;

      return Object.entries(buildings[buildingName]).map(
        ([floorName, rooms], k) => (
          <div key={k} className="mb-20">
            <h1 className="text-2xl text-secondary-foreground font-bold opacity-80 py-10 [text-shadow:_0_4px_5px_#00000070]">
              {floorName}
            </h1>
            <div className="relative flex flex-row flex-wrap gap-4">
              {Object.values(rooms).map((room) => (
                <div key={room.id} className="relative w-full">
                  <Button
                    variant={nowRoom === room.id ? "building" : "secondary"}
                    className="justify-self-center relative rounded-full min-w-max max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
                    onClick={() => {
                      const newRoomId = nowRoom === room.id ? null : room.id;
                      setNowRoom(newRoomId);
                    }}
                  >
                    {room.name}
                  </Button>
                  {nowRoom === room.id && (
                    <div className="mt-4 flex justify-center w-full">
                      <RenderTable
                        buildingName={buildingName}
                        roomName={room.name}
                        roomId={nowRoom.toString()}
                        date={toDayDate}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button
                key={`${buildingName}-all`}
                variant="secondary"
                className="relative rounded-full min-w-max max-w-[300px] w-[20dvw] shadow-md backdrop:blur-lg shadow-[#0d316891] border"
                onClick={() => setNowRoom(null)}
              >
                ALL
              </Button>
            </div>
          </div>
        )
      );
    },
    [buildings, nowRoom, toDayDate]
  );

  const buildingKeys = useMemo(() => Object.keys(buildings), [buildings]);

  if (loading) return <p>Loading buildings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full h-max px-10 flex flex-col gap-10 py-20">
      {!buildingName ? (
        buildingKeys.map((name, i) => (
          <div key={i} className="relative pb-20">
            <span id={name.slice(0, 2)} className="absolute top-[-164px]" />
            {renderBuildingImage(name)}
            {renderRoomButton(name)}
          </div>
        ))
      ) : (
        <div className="relative pb-20">
          <span
            id={buildingName.slice(0, 2)}
            className="absolute top-[-164px]"
          />
          {renderBuildingImage(buildingName)}
          {renderRoomButton(buildingName)}
        </div>
      )}
    </div>
  );
};

export default RenderBuilding;