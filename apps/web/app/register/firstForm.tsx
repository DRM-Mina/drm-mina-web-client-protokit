import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function FirstForm() {
  return (
    <>
      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name of Game</Label>
          <Input type="text" id="name" />
        </div>
      </div>

      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Input type="text" id="description" />
        </div>
      </div>

      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="price">Price</Label>
          <Input type="number" id="price" />
        </div>
      </div>

      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="discount">{"Discount Amount (Optional)"}</Label>
          <Input type="number" id="discount" />
        </div>
      </div>

      <div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="image">Image</Label>
          <Input type="file" id="image" />
        </div>
      </div>
    </>
  );
}
