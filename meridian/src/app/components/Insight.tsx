import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InsightActions } from "./InsightActions";
import { Action } from "./ClientApp";
import { Priority } from "./Desktop";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function categoryToColorClass(category: string): string {
    switch (category) {
        case "Competitive Intelligence":
            return "text-red-700";
        case "Customer Service":
            return "text-blue-700";
        case "Fulfillment":
            return "text-green-700";
        case "Inventory":
            return "text-yellow-700";
        case "Marketing":
            return "text-purple-700";
        case "Pricing":
            return "text-pink-700";
        case "SEO":
            return "text-indigo-700";
        case "Technical":
            return "text-teal-700";
        default:
            return "text-gray-600";
    }
}

function priorityToColorClass(priority: Priority): string {
    switch (priority) {
        case "HIGH":
            return "text-red-950 bg-red-300";
        case "MID":
            return "text-red-800 bg-red-200";
        case "LOW":
            return "text-red-500 bg-red-100";
        default:
            return "";
    }
}

function convertToPercentage(value: string | number): string {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${Math.round(numValue * 100)}%`;
}

function actionToColorClasses(action: Action, priority: Priority, category: string): any {
    switch (action) {
        case "DISMISS":
            return {
                cardColors: "bg-red-50 text-red-800 border-red-100",
                priorityBadgeColors: "bg-red-50 text-red-800",
                categoryBadgeColors: "bg-red-50 text-red-800",
            };
        case "SNOOZE":
            return {
                cardColors: "bg-pink-50 text-pink-800 border-pink-100",
                priorityBadgeColors: "bg-pink-50 text-pink-800",
                categoryBadgeColors: "bg-pink-50 text-pink-800",
            };
        case "ADD_TO_LIST":
            return {
                cardColors: "bg-blue-50 text-blue-800 border-blue-100",
                priorityBadgeColors: "bg-blue-50 text-blue-800",
                categoryBadgeColors: "bg-blue-50 text-blue-800",
            };
        case "LONG_SNOOZE":
            return {
                cardColors: "bg-violet-50 text-violet-800 border-violet-100",
                priorityBadgeColors: "bg-violet-50 text-violet-800",
                categoryBadgeColors: "bg-violet-50 text-violet-800",
            };
        default:
            return {
                cardColors: "border-gray-300",
                priorityBadgeColors: priorityToColorClass(priority),
                categoryBadgeColors: categoryToColorClass(category),
            };
    }
}

type InsightProps = {
    title: string;
    category: string;
    confidence: string | number;
    suggestedAction: string;
    priority: "HIGH" | "MID" | "LOW";
    action: "DISMISS" | "SNOOZE" | "ADD_TO_LIST" | "LONG_SNOOZE" | "NO_ACTION";
    actionHandler: (action: Action) => void;
    open: boolean;
    onClick: () => void;
}
export function Insight({ title, category, confidence, suggestedAction, priority, action, actionHandler, open, onClick }: InsightProps) {
    const colors = actionToColorClasses(action, priority, category);
    return (
        <Card className={`flex flex-col rounded-none cursor-pointer px-3 py-4 ${colors.cardColors} shadow-none`} onClick={onClick}>
            <div className="flex flex-row items-center justify-between">
                {/* In the future set the column width dynamically */}
                <div style={{ display: "inline-grid", gridTemplateColumns: "210px max-content", gridTemplateRows: "max-content max-content", columnGap: "8px", rowGap: "1px" }}>
                    <div style={{ alignSelf: "center", display: "flex", gap: "6px", justifySelf: "end" }}>
                        <Badge variant={"outline"} className={`${colors.priorityBadgeColors} font-extrabold`}>
                            {priority}
                        </Badge>
                        <Badge variant={"outline"} className={`${colors.categoryBadgeColors} font-extrabold`}>{category}</Badge>
                    </div>
                    <h2 className="text-xl font-normal">{title}</h2>
                    <p style={{ justifySelf: "end" }}>{convertToPercentage(confidence)}</p>
                    <h2 className="text-base font-semibold" style={{ alignSelf: "center" }}>{suggestedAction}</h2>

                </div>
                <InsightActions action={action} actionHandler={actionHandler} />
            </div>
            {open && (
                <>
                    <Separator />
                    <Image className="self-center" src="/insight.svg" width={400} height={400} alt="Build UI from PDF" />
                </>
            )}
        </Card>
    );
}