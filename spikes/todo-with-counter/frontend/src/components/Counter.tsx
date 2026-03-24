// import { Client, Callbacks } from "@colyseus/sdk";
// const client = new Client("http://localhost:2567");

// // Recommended Reading:
// // - https://docs.colyseus.io/state
// // - https://docs.colyseus.io/sdk#joining-rooms
// // - https://docs.colyseus.io/sdk#state-synchronization

// // Note:
// // you should probably implement the Colyseus room before implementing this component.

// export default function Counter() {
//   return (
//     <div className="counter">
//       <h2>Counter</h2>
//       {/* Counter UI goes here */}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { Client } from "@colyseus/sdk";
// import { MyRoomState } from "../../../colyseus/src/rooms/schema/MyRoomState"; // Path may vary based on your folders

// Initialize the client using the URL from your original file
const client = new Client("http://localhost:2567");

export default function Counter() {
  const [room, setRoom] = useState<any>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
      let activeRoom: any;

      client.joinOrCreate("my_room").then((res) => {
        console.log("Successfully connected to room:", res.id);
        activeRoom = res;
        setRoom(activeRoom);

        // We use onStateChange to catch ANY change to the server state
        activeRoom.onStateChange((state: any) => {
          console.log("New state received from server:", state);
          if (state.count !== undefined) {
            setCount(state.count);
          }
        });
      }).catch(err => {
        console.error("Colyseus Connection Error:", err);
      });

      return () => {
        activeRoom?.leave();
      };
    }, []);

  const handleIncrement = () => {
    // Sends the 'increment' message defined in your MyRoom.ts
    room?.send("increment", { amount: 1 });
  };

  const handleDecrement = () => {
    // Sends the 'decrement' message defined in your MyRoom.ts
    room?.send("decrement", { amount: 1 });
  };

  return (
    <div className="counter p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-bold mb-2">Global Counter</h2>
      <div className="flex items-center gap-4">
        <button 
          onClick={handleDecrement}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-700 font-bold"
        >
          -
        </button>
        <span className="text-2xl font-mono">{count}</span>
        <button 
          onClick={handleIncrement}
          className="px-4 py-2 bg-green-100 hover:bg-green-200 rounded text-green-700 font-bold"
        >
          +
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2 italic">
        Real-time sync via Colyseus active.
      </p>
    </div>
  );
}