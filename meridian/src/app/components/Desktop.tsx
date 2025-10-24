import "./Desktop.css"
import { Badge } from "@/components/ui/badge";
import { Inbox, ListCheck, Trash2 } from "lucide-react";
import React, { } from "react";
import { promises as fs } from "fs";
import { ClientApp } from "./ClientApp";
import { sortByPriorityAndConfidence } from "@/lib/utils";
import { SideBar } from "./SideBar";


export type Priority = "HIGH" | "MID" | "LOW";
export type InsightData = {
    id: number;
    title: string;
    priority: Priority;
    category: string;
    confidence: number;
    date: string;
    evidence: string;
    suggestedAction: string;
}

export default async function Desktop() {
    const raw_insights = await fs.readFile(process.cwd() + "/src/app/data/ChatGPT_Data.json");
    const json_insights: InsightData[] = JSON.parse(raw_insights.toString());
    const sortedInsights = json_insights.sort(sortByPriorityAndConfidence);

    return (
        <ClientApp data={sortedInsights} />
    )
}
