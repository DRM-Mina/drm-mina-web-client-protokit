"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Download, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function SearchBar() {
  const router = useRouter();
  const { toast } = useToast();

  const handleDownload = async (fileName: string) => {
    toast({
      title: "Download started",
      description: "Please wait while we prepare the download link for you 🚀",
    });
    try {
      const signedUrlResponse = await fetch(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "get-signed-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: fileName,
          }),
        },
      );

      if (!signedUrlResponse.ok) {
        throw new Error("Failed to get signed url");
      }

      const { url } = await signedUrlResponse.json();

      const downloadResponse = await fetch(url);
      if (!downloadResponse.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await downloadResponse.blob();
      const urlBlob = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(urlBlob);

      toast({
        title: "Download complete",
        description: "Please check your download folder 😏",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to download",
        description: "Sowwy 😢, please try again later.",
      });
    }
  };

  return (
    <div className="relative top-0 flex items-center justify-center px-8 py-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const search = (e.target as HTMLFormElement)["search"].value;
          (e.target as HTMLFormElement)["search"].value = "";
          router.push("/browse?search=" + search);
        }}
      >
        <div className="relative w-[30vw]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search games..."
            className="w-full appearance-none bg-background pl-8 shadow-none"
          />
        </div>
      </form>

      <div className=" absolute right-5 top-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              className="flex w-full justify-start px-2 "
            >
              Download Client
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" grid w-auto grid-rows-4 items-start">
            <div className="grid h-full place-items-center">
              <h4 className="text-sm font-normal">Select your platform</h4>
            </div>
            <Button
              className=" items-left row-span-1 mt-2 justify-start pl-1"
              variant="link"
              onClick={() => {
                toast({
                  title: "Download started",
                  description:
                    "Just kidding we don't have this yet, use Linux 🤧",
                });
              }}
            >
              <Download size={24} /> &nbsp;Windows App
            </Button>
            <Button
              className=" items-left row-span-1 mt-2 justify-start pl-1"
              variant="link"
              onClick={() => {
                toast({
                  title: "Download started",
                  description:
                    "Just kidding we don't have this yet neither, use Linux 🤧",
                });
              }}
            >
              <Download size={24} /> &nbsp;Mac App
            </Button>
            <Button
              className=" items-left col-span-1 mt-2 justify-start pl-1"
              variant="link"
              onClick={() => {
                handleDownload("DrmMinaClient-1.1.0.AppImage");
              }}
            >
              <Download size={24} /> &nbsp;Linux App
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
