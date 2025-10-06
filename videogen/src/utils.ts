import { DbRow } from "./db/types";

export function generateVTTFromDbRow(dbrs: DbRow[]): string {
  let vttContent = "WEBVTT\n\n";
  let currentTime = 0;

  dbrs.forEach((dbr, index) => {

    const { gap, duration} = parseTimingString(dbr.timing);

    // Add gap if specified
    currentTime += gap;

    const startTime = currentTime;
    const endTime = currentTime + duration;

    // Format time as HH:MM:SS.mmm
    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0')}`;
    };

    vttContent += `${index + 1}\n`;
    vttContent += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    vttContent += `${dbr.text}\n\n`;

    currentTime = endTime;
  });

  return vttContent;
}

export function parseTimingString(timing: string): { gap: number; duration: number } {
  const regex = /(?:gap=([0-9]+(?:\.[0-9]+)?);)?duration=([0-9]+(?:\.[0-9]+)?)/;
  const match = timing.match(regex);

  const gap = match?.[1] ? parseFloat(match[1]) : 0;
  const duration = match?.[2] ? parseFloat(match[2]) : 0;

  return { gap, duration };
}
