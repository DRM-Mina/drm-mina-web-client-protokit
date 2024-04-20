"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import useHasMounted from "@/lib/customHooks";
import { useToast } from "./ui/use-toast";

export function ModeToggle() {
    const { setTheme } = useTheme();
    const theme = useTheme().theme;

    const { toast } = useToast();

    const hasMounted = useHasMounted();

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light");
            toast({ description: "OH NO! MY EYES 😵" });
        } else {
            setTheme("dark");
            toast({ description: "Welcome to the dark side 😎" });
        }
    };

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            {hasMounted && theme === "dark" ? (
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            ) : (
                <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            )}
        </Button>
    );
}
