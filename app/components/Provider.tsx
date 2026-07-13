"use client";

import type { ReactNode } from "react";
import { IKContext } from "imagekitio-react";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";

type ImageKitAuthResponse = {
  signature: string;
  expire: number;
  token: string;
};

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ?? "";
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? "";

async function authenticator(): Promise<ImageKitAuthResponse> {
  const response = await fetch("/api/imagekit-auth");

  if (!response.ok) {
    throw new Error("Failed to authenticate ImageKit upload");
  }

  return response.json() as Promise<ImageKitAuthResponse>;
}

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <IKContext
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
      >
        <NotificationProvider>{children}</NotificationProvider>
      </IKContext>
    </SessionProvider>
  );
}
