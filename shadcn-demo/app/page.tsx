"use client"

import "./globals.css";

import { DarkMode } from "@/components/component/dark-mode";

import * as React from "react"
import { Lift } from "@/components/component/lift";
import { V0 } from "@/components/component/v0";
import { FormExample } from "@/components/component/form";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex items-center  justify-center min-h-screen p-2">
      <Card className="md:w-2/3 lg:w-1/2 flex flex-col items-center justify-center gap-6 p-4">
        <DarkMode />
        <FormExample />
        <Lift />
        <V0 />
      </Card>
    </main>
  );
}
