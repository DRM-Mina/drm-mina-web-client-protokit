import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function FeaturedSkeleton() {
  return (
    <div className="col-span-3 row-span-1 flex justify-center py-8 lg:col-span-5">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-2xl justify-center p-4"
      >
        <h3 className="mb-2 text-lg font-medium tracking-tight">
          Featured Games
        </h3>
        <CarouselContent>
          <CarouselItem className="md:basis-full lg:basis-full">
            <div className="p-2">
              <div className="shadow-smflex flex-col space-y-3 rounded-lg border bg-card text-card-foreground ">
                <div className="relative flex items-center justify-center rounded-xl p-6 md:aspect-square lg:aspect-video">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className=" flex w-full items-center justify-between p-6 pt-0">
                  <Skeleton className="h-6 w-1/2" />
                  <div className=" mt-8 flex flex-row gap-3 p-2">
                    <Skeleton className=" h-7 w-40" />
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}
