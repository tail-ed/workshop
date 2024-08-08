"use client"

import "./globals.css";

import { DarkMode } from "@/components/component/dark-mode";

import * as React from "react"
import { Lift } from "@/components/component/lift";
import { V0 } from "@/components/component/v0";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <DarkMode />
      <Lift />
      <V0 />
    </main>
  );
}
