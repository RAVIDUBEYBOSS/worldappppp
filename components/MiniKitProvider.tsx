"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect } from "react";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // 🟢 FIX: Pass App ID directly as a string (Not inside an object)
    MiniKit.install("app_2c1431f3763f1f4ac07163fd2001e377");
    console.log("MiniKit Installed!");
  }, []);

  return <>{children}</>;
}