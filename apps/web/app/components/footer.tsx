import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Footer({ className }: FooterProps) {
  const router = useRouter();

  return (
    <footer
      className={cn(
        "border-t border-border/40 py-6 md:px-8 md:py-6",
        className,
      )}
    >
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-4">
          <span className="text-sm">© 2024 Drm Mina Game Market</span>
        </div>

        <div>
          <a
            href="https://github.com/DRM-Mina"
            target="_blank"
            rel="noreferrer"
            className=" text-sm font-normal underline underline-offset-4"
          >
            Github
          </a>
        </div>

        <div>
          <a
            href="https://twitter.com/MinaGameMarket"
            target="_blank"
            rel="noreferrer"
            className=" text-sm font-normal underline underline-offset-4"
          >
            Twitter
          </a>
        </div>

        <div>
          <div
            className=" cursor-pointer text-sm font-normal underline underline-offset-4"
            onClick={() => router.push("/register")}
          >
            Do You Want to Add Your Game?
          </div>
        </div>

        <div></div>

        <div className="flex flex-col gap-6">
          <div>
            <span>
              Build with ❤️ by{" "}
              <a
                href="https://github.com/kadirchan"
                target="_blank"
                rel="noreferrer"
                className=" text-sm font-normal underline underline-offset-4"
              >
                Kadircan
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <img src={"mina.svg"} alt="Mina Logo" className="h-5" />
            <span className="text-sm">
              Powered by{" "}
              <a
                href="https://minaprotocol.com/"
                target="_blank"
                rel="noreferrer"
                className=" text-sm font-normal underline underline-offset-4"
              >
                Mina
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
