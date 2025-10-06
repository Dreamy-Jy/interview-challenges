import { useEffect, useMemo, useState } from "react";
import { DbRow } from "./db/types";
import { useCaptions } from "./CaptionsProvider";
import { parseTimingString } from "./utils";

type CaptionSectionProps = {
    captionIndex: number;
    caption: DbRow;
    isActive: boolean;
}
function CaptionSection({ caption, isActive, captionIndex }: CaptionSectionProps) {
    const { updateCaptionText, updateCaptionTiming } = useCaptions();
    const timings = useMemo<{ gap: number; duration: number }>(() => parseTimingString(caption.timing), [caption.timing]);

    return (
        <div className={`px-2 py-5 ${isActive ? "bg-yellow-200" : ""}`}>
            <div className={"flex flex-col"}>
                <label className={"text-lg text-gray-800"} htmlFor={`caption-${caption.id}`}>Caption {captionIndex + 1}:</label>
                <textarea className={""} id={`caption-${caption.id}`} value={caption.text} onChange={(e) => {
                    updateCaptionText(caption.id, e.target.value);
                }} />
            </div>
            <div className={"flex flex-row gap-4"}>
                <div className={"flex flex-col"}>
                    <label className={"font-extrabold text-sm text-gray-500"} htmlFor={`duration-input-${caption.id}`}>Duration: </label>
                    <input className={"w-[90px]"} id={`duration-input-${caption.id}`} type="number" value={timings.duration} onChange={(e) => {
                        updateCaptionTiming(caption.id, `${timings.gap > 0 ? `gap=${timings.gap};` : ""}duration=${parseFloat(e.target.value)}`);
                    }} />
                </div>
                <div className={"flex flex-col"}>
                    <label className={"font-extrabold text-sm text-gray-500"} htmlFor={`gap-input-${caption.id}`}>Gap: </label>
                    <input className={"w-[90px]"} id={`gap-input-${caption.id}`} type="number" value={timings.gap} onChange={(e) => {
                        updateCaptionTiming(caption.id, `${parseFloat(e.target.value) > 0 ? `gap=${parseFloat(e.target.value)};` : ""}duration=${timings.duration}`);
                    }} />
                </div>
            </div>
        </div>
    );
}

type CaptionsSideBarProps = {
    captions: DbRow[];
    videoTime: number;
}
export function CaptionsSideBar({ captions, videoTime }: CaptionsSideBarProps) {
    const activeCaption = useActiveCaption(captions, videoTime);

    return (
        <aside className="flex-shrink-0 bg-gray-100 overflow-auto h-full">
            {captions.map((caption, index) => (
                <CaptionSection
                    key={caption.id}
                    caption={caption}
                    isActive={index === activeCaption}
                    captionIndex={index} />
            ))}
        </aside>
    );
}

function useActiveCaption(captions: DbRow[], videoTime: number) {
    const [activeCaption, setActiveCaption] = useState<number>(0);

    useEffect(() => { // update the active caption index based on the place in the video
        if (captions.length === 0) { setActiveCaption(0); return; }

        let currentTime = 0;
        const captionIndexAtTime = captions.findIndex((caption, index) => {
            const { gap, duration } = parseTimingString(caption.timing);

            // Check if video time falls within this caption's duration
            if (videoTime >= currentTime && videoTime <= currentTime + duration + gap) {
                return true;
            }

            // Move to end of this caption
            currentTime += duration + gap;

            // If this is the last caption and we're still within video bounds
            if (index === captions.length - 1 && videoTime >= currentTime - duration) {
                return true;
            }

            return false;
        });

        setActiveCaption(captionIndexAtTime === -1 ? 0 : captionIndexAtTime);
    }, [videoTime, captions]);


    return activeCaption;
}