import { Schema, type } from "@colyseus/schema";

export class MyRoomState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";

  // The counter property that will be synced across clients
  @type("number") count: number = 0; //
}