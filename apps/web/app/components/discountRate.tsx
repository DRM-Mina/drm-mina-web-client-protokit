import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const discountRateVariants = cva(
    "absolute inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                md: "top-2 left-2 text-sm text-discount bg-discount hover:bg-discount-hover rounded-lg p-1 border border-lime-950",
                bg: "top-3 left-3 text-lg text-discount bg-discount hover:bg-discount-hover rounded-lg p-2 border border-lime-950",
            },
        },
        defaultVariants: {
            variant: "md",
        },
    }
);

export interface DiscountRateProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof discountRateVariants> {}

export default function DiscountRate({
    game,
    variant,
}: DiscountRateProps & { game: { discount: number; price: number } }) {
    const discountRate = Math.floor((game.discount / game.price) * 100);

    return discountRate > 0 ? (
        <div className={cn(discountRateVariants({ variant }))}>{"- " + discountRate + "%"}</div>
    ) : (
        <></>
    );
}
