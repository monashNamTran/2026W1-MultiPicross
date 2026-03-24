import { Room, Client, CloseCode } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
  maxClients = 4;
  state = new MyRoomState();

  // We recommend reading the Colyseus documentation on state synchronization:
  // https://docs.colyseus.io/state

  // You handle messages from the client by defining message handlers in the `messages` property.
  // For example, the `yourMessageType` handler will be called when client sends a message
  // with type "yourMessageType".
  // You can define the structure of the `message` parameter in ./schema/MyRoomState.ts using @type decorators.
messages = {
    increment: (client: Client, message: any) => {
      // Access the state directly to change it; Colyseus handles the broadcast
      this.state.count += (message.amount || 1); //
      console.log(`Incremented by ${client.sessionId}. New count: ${this.state.count}`);
    },
    decrement: (client: Client, message: any) => {
      this.state.count -= (message.amount || 1); //
      console.log(`Decremented by ${client.sessionId}. New count: ${this.state.count}`);
    },
  };

  onCreate(options: any) {
    /**
     * Called when a new room is created.
     */
    console.log("Counter Room Created!");
  }

  onJoin(client: Client, options: any) {
    /**
     * Called when a client joins the room.
     */
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.
     */
    console.log(client.sessionId, "left!", code);
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log("room", this.roomId, "disposing...");
  }
}
