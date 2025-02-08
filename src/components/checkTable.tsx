import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const UserDetail = () => {
  const router = useRouter();
  const { roomId, date } = router.query;
  const [data, setData] = useState<[{}]>([{}]);

  useEffect(() => {
    if (roomId) {
      // fetch(`http://helloworld01.sit.kmutt.ac.th:3002/api/rooms/room-schedule?roomId=${id}&date=${date}`)
      fetch(`http://helloworld01.sit.kmutt.ac.th:3002/api/rooms/room-schedule?roomId=7&date=2024-2-4`)
        .then((response) => response.json())
        .then((data) => setData(data[0]))
        .catch((error) => console.error('Error fetching user:', error));
    }
  }, [roomId]);

  if (!roomId) return <div>Loading...</div>;

  return (
    <div>
      {/* <h1>{data.title}</h1>
      <p>{data.description}</p> */}
      working
    </div>
  );
};

export default UserDetail;