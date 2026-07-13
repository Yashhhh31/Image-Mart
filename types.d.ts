import { Connection } from "mongoose";

declare global {
  var mongoose: {
    con: Connection | null;
    promise: Promise<Connection> | null;
  };

  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export {};
