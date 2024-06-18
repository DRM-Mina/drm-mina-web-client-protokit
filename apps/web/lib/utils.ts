import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tagList = [
  "Action",
  "Adventure",
  "RPG",
  "Racing",
  "Sports",
  "Simulation",
  "Strategy",
  "Puzzle",
  "Fighting",
  "Shooter",
  "Stealth",
  "Survival",
  "Platformer",
  "Sandbox",
  "Horror",
  "MMO",
  "Metroidvania",
  "Rhythm",
  "Idle",
  "Visual Novel",
  "Tower Defense",
  "Trivia",
  "Card",
  "MOBA",
  "Battle Royale",
  "Board Game",
  "Educational",
  "Party",
  "Artillery",
  "Pinball",
  "Music",
  "Dating Sim",
];
