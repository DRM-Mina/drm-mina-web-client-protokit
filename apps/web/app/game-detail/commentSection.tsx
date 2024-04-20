import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function CommentSection() {
    return (
        <div className="grid grid-cols-4">
            <div className=" col-start-2 col-end-4">
                <Textarea placeholder="Type your message here." />
                <Button>Send message</Button>
            </div>
        </div>
    );
}
