"use client";
import { ActionButton, ActionButtonProps } from "./ActionButton";
import { ListPlus, ListRestart, AlarmClock, AlarmClockMinus, AlarmPlus, CircleX, Undo2 } from "lucide-react";
import { Action } from "./ClientApp";

const actionProps: {[K in Exclude<Action, "NO_ACTION">]: ActionButtonProps} = {
    ADD_TO_LIST: {
        isToggled: false,
        primaryBackgroundColor: "bg-blue-50",
        primaryStrokeColor: "text-blue-800",
        primaryIcon: ListPlus,
        revertStrokeColor: "text-blue-950",
        revertIcon: ListRestart,
        onClick: () => { }
    },
    SNOOZE: {
        isToggled: false,
        primaryBackgroundColor: "bg-pink-50",
        primaryStrokeColor: "text-pink-800",
        primaryIcon: AlarmClock,
        revertStrokeColor: "text-pink-950",
        revertIcon: AlarmClockMinus,
        onClick: () => { }
    },
    LONG_SNOOZE: {
        isToggled: false,
        primaryBackgroundColor: "bg-violet-50",
        primaryStrokeColor: "text-violet-800",
        primaryIcon: AlarmPlus,
        revertStrokeColor: "text-violet-950",
        revertIcon: AlarmClockMinus,
        onClick: () => { }
    },
    DISMISS: {
        isToggled: false,
        primaryBackgroundColor: "bg-red-50",
        primaryStrokeColor: "text-red-800",
        primaryIcon: CircleX,
        revertStrokeColor: "text-red-950",
        revertIcon: Undo2,
        onClick: () => { }
    },
};

type InsightActionsProps = {
    action: Action
    actionHandler: (action: Action) => void
};
export function InsightActions({action, actionHandler}: InsightActionsProps) {
    return (
        <div className="flex gap-[8px]">
            { Object.entries(actionProps).map((entry, index) => (
                <ActionButton key={index} {...entry[1]} isToggled={entry[0] === action} onClick={(e) => {
                    e.stopPropagation();
                    
                    if (entry[0] !== action) {
                        actionHandler(entry[0] as Action);
                    } else if (entry[0] === action) {
                        actionHandler("NO_ACTION");
                    }
                }}/>
            ))}
        </div>
    );
}