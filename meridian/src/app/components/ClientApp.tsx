"use client";

import React, { useMemo, useState } from "react";
import { InsightData } from "./Desktop"
import { Insight } from "./Insight";
import { Button } from "@/components/ui/button";
import { SideBar, SidebarProps } from "./SideBar";
import { Inbox, ListCheck, Trash2 } from "lucide-react";

export type Action = "DISMISS" | "SNOOZE" | "ADD_TO_LIST" | "LONG_SNOOZE" | "NO_ACTION";
type InsightActions = {
    [key: number]: Action;
};

// this component needs to create context for the entire app

type ClientApp = {
    data: InsightData[]
}
export function ClientApp({ data }: ClientApp) {
    const [open, setOpen] = useState<number>(-1); // -1 means no insight is open
    const [insights, setInsights] = useState<InsightData[]>(data);
    const [tasks, setTasks] = useState<InsightData[]>([]);
    const [lightSnoozed, setLightSnoozed] = useState<InsightData[]>([]);
    const [dismissed, setDismissed] = useState<InsightData[]>([]);
    const [deepSnoozed, setDeepSnoozed] = useState<InsightData[]>([]);
    const [
        insightActions,
        setInsightAction
    ] = useState<InsightActions>(data.reduce((acc, insight) => {
        acc[insight.id] = "NO_ACTION";
        return acc;
    }, {} as InsightActions));

    const createActionHander = (id: number) => {
        return (action: Action) => {
            setInsightAction(prevActions => ({
                ...prevActions,
                [id]: action
            }));
        }
    };

    const sideBarProps: SidebarProps = useMemo(() => ({
        pageLinks: [
            {
                icon: Inbox,
                assetCount: insights.length,
                title: "Inbox",
                selected: true,
                onClick: () => { console.log("Inbox clicked"); }
            },
            {
                icon: ListCheck,
                assetCount: tasks.length,
                title: "Tasks",
                selected: false,
                onClick: () => { console.log("Tasks clicked"); }
            },
            {
                icon: Trash2,
                assetCount: dismissed.length,
                title: "Trash",
                selected: false,
                onClick: () => { console.log("Trash clicked"); }
            }
        ],
        title: "Arrakis"
    }), [insights, tasks, dismissed]);

    return (

        <div className="flex h-full p-[8px]">
            {/* Sidebar we're not implementing changes here so i'll leave it as is*/}
            <SideBar {...sideBarProps} />
            <main className="main-content grow">
                <div className="mx-auto w-9/10 pt-4">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl">Insights</h1>
                        <Button variant={"outline"} className="rounded-none" onClick={() => {
                            const new_insights = [...insights];
                            const new_tasks = [...tasks];
                            const new_lightSnoozed = [...lightSnoozed];
                            const new_dismissed = [...dismissed];
                            const new_deepSnoozed = [...deepSnoozed];

                            for (const insight of insights) {
                                const action = insightActions[insight.id];

                                if (action === "NO_ACTION") {
                                    continue;
                                }

                                new_insights.splice(new_insights.indexOf(insight), 1);
                                switch (action) {
                                    case "DISMISS":
                                        new_dismissed.push(insight);
                                        break;
                                    case "SNOOZE":
                                        new_lightSnoozed.push(insight);
                                        break;
                                    case "LONG_SNOOZE":
                                        new_deepSnoozed.push(insight);
                                        break;
                                    case "ADD_TO_LIST":
                                        new_tasks.push(insight);
                                        break;
                                    default:
                                        // This should never happen
                                        console.error(`Unknown action: ${action}`);
                                        new_insights.push(insight);
                                        break;
                                }

                                setInsights(new_insights);
                                setLightSnoozed(new_lightSnoozed);
                                setDismissed(new_dismissed);
                                setDeepSnoozed(new_deepSnoozed);
                                setTasks(new_tasks);
                            }
                            // Reset the action is un nessary because users can't access submitted suggestions
                            setInsightAction(prevActions => {
                                const newActions: InsightActions = {};
                                for (const key in prevActions) {
                                    if (prevActions[key] == "NO_ACTION") {
                                        newActions[key] = "NO_ACTION";
                                    }
                                }
                                return { ...newActions };
                            });
                        }} disabled={Object.entries(insightActions).reduce((acc, curr) => { return acc && curr[1] === "NO_ACTION" }, true)}>Submit All Actions</Button>
                    </div>
                    {insights.map((insight: InsightData, index: number) => {
                        return (
                            <Insight
                                key={index}
                                title={insight.title}
                                category={insight.category}
                                confidence={insight.confidence}
                                suggestedAction={insight.suggestedAction}
                                priority={insight.priority}
                                action={insightActions[insight.id]}
                                actionHandler={createActionHander(insight.id)}
                                open={open === insight.id}
                                onClick={() => {
                                    if (open === insight.id) {
                                        setOpen(-1);
                                    } else {
                                        setOpen(insight.id);
                                    }
                                }}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}