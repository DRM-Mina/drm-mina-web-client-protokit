import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { postGameData } from "@/lib/api";
import { useRegisterStore } from "@/lib/stores/gameRegister";
import { useGamesStore } from "@/lib/stores/gameStore";
import { tagList } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export default function ChangeOffChain({ gameId }: { gameId: number }) {
  const { toast } = useToast();
  const registerStore = useRegisterStore();
  const gameStore = useGamesStore();

  const [offChainForm, setOffChainForm] = useState({
    name: "",
    description: "",
    creator: "",
    tags: [] as string[],
  });

  useEffect(() => {
    const gameOffChainProps = gameStore.games.find(
      (game) => game.gameId === gameId,
    );
    console.log(gameOffChainProps);
    if (!gameOffChainProps) {
      setOffChainForm({
        name: "",
        description: "",
        creator: "",
        tags: [],
      });
      return;
    }

    setOffChainForm({
      name: gameOffChainProps.name,
      description: gameOffChainProps.description,
      creator: gameOffChainProps.creator,
      tags: gameOffChainProps.tags,
    });
  }, [gameId, registerStore.registeredGameList]);

  const handleOffChainDataSubmit = async () => {
    try {
      const date = Date.now();
      const offChainData = {
        ...offChainForm,
        gameId: gameId,
        date: date.toString(),
      };
      const jsonData = JSON.stringify(offChainData);

      const signResult = await window.mina?.signMessage({
        message: jsonData,
      });

      if (signResult) {
        const verifyResult = await window.mina?.verifyMessage(signResult);
        if (verifyResult) {
          const result = await postGameData(signResult);
          if (result) {
            toast({
              description: "Your game data has been updated",
            });
            registerStore.setTrigger(!registerStore.trigger);
          } else {
            throw new Error("Server Error");
          }
        } else {
          throw new Error("Verification failed");
        }
      } else {
        throw new Error("Sign failed");
      }
    } catch (e: any) {
      toast({
        title: "Game Data Update Failed",
        description: e.message,
      });
    }
  };
  return (
    <div className=" col-span-1">
      <h3 className="p-4 text-lg font-semibold">
        {"Edit Game " + gameId + " OffChain"}
      </h3>

      <div>
        <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
          <div className=" col-span-4 items-center gap-1.5">
            <Label htmlFor="name">Name of the Game</Label>
            <Input
              onChange={(event) => {
                setOffChainForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }));
              }}
              value={offChainForm.name}
              defaultValue={""}
              type="text"
              id="name"
            />
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      <div>
        <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
          <div className=" col-span-4 items-center gap-1.5">
            <Label htmlFor="description">Description of the Game</Label>
            <Textarea
              onChange={(event) => {
                setOffChainForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }));
              }}
              value={offChainForm.description}
              defaultValue={""}
              id="description"
            />
          </div>
        </div>
      </div>

      <div>
        <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
          <div className=" col-span-4 items-center gap-1.5">
            <Label htmlFor="creator">Creator of the Game</Label>
            <Input
              onChange={(event) => {
                setOffChainForm((prev) => ({
                  ...prev,
                  creator: event.target.value,
                }));
              }}
              value={offChainForm.creator}
              defaultValue={""}
              type="text"
              id="creator"
            />
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>

      <div>
        <div className=" grid w-full max-w-md grid-cols-4 p-4 ">
          <div className=" col-span-4 items-center gap-1.5">
            <Label htmlFor="tags">Available Tags</Label>
            <ScrollArea id="tags" className=" h-32 w-full rounded-sm border">
              <div className="flex flex-col gap-3 p-2">
                {tagList.map((tag) => (
                  <div className=" flex gap-2" key={tag}>
                    <Checkbox
                      key={tag}
                      checked={offChainForm.tags.includes(tag)}
                      onClick={() => {
                        if (offChainForm.tags.includes(tag)) {
                          setOffChainForm((prev) => ({
                            ...prev,
                            tags: prev.tags.filter((t) => t !== tag),
                          }));
                        } else {
                          setOffChainForm((prev) => ({
                            ...prev,
                            tags: [...prev.tags, tag],
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={tag}>{tag}</Label>
                  </div>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className=" p-4">
        <Button onClick={handleOffChainDataSubmit}>Update</Button>
      </div>
    </div>
  );
}
