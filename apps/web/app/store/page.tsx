"use client";
import React from "react";
import Discounts from "../components/discounts";
import dynamic from "next/dynamic";

const Featured = dynamic(() => import("@/app/components/featured"));

export default function Store() {
  return (
    <div className="col-span-5 grid grid-rows-2">
      <Featured /> <Discounts />
    </div>
  );
}
