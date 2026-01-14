"use client";
import { ReactNode, useEffect } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install({
      appId: "app_2c1431f3763f1f4ac07163fd2001e377",
    });
    console.log("MiniKit Installed!");
  }, []);

  return <>{children}</>;
}