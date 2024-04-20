"use client";
import React from "react";
import Featured from "../components/featured";
import Discounts from "../components/discounts";

export default function Store() {
    return (
        <div className="grid grid-rows-2 col-span-5">
            <Featured /> <Discounts />
        </div>
    );
}
