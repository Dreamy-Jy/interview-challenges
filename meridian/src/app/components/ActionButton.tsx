"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import React, { ReactElement, ReactNode } from "react";

export type ActionButtonProps = {
    /* NOTE 1 Start: All colors should be valid tailwind css classNames*/
    primaryBackgroundColor: string;
    primaryStrokeColor: string;
    revertStrokeColor: string;
    /* NOTE 1 End */
    primaryIcon: LucideIcon;
    revertIcon: LucideIcon;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isToggled: boolean;
}
export function ActionButton({
    primaryBackgroundColor,
    primaryStrokeColor,
    primaryIcon,
    revertStrokeColor,
    revertIcon,
    onClick,
    isToggled
}: ActionButtonProps): ReactNode {
    const PrimaryIcon = primaryIcon;
    const RevertIcon = revertIcon;
    
    if (isToggled) {
        return (<Button onClick={onClick} variant={"outline"} size={"icon"} className={`rounded-none cursor-pointer ${revertStrokeColor} bg-white hover:${revertStrokeColor} hover:${primaryBackgroundColor} border-2`}><RevertIcon strokeWidth={2.5} /></Button>);
    }
    return (<Button onClick={onClick} variant={"outline"} size={"icon"} className={`rounded-none cursor-pointer ${primaryStrokeColor} ${primaryBackgroundColor} hover:bg-white hover:${primaryStrokeColor}`}><PrimaryIcon strokeWidth={2.5} /></Button>);
}