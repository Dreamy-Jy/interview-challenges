import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { CaptionsSideBar } from './CaptionsSideBar';
import { useCaptions } from './CaptionsProvider';
import { generateVTTFromDbRow } from './utils';
import { DbRow } from './db/types';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state: { captions, isLoading: _ } } = useCaptions();
  const [videoTime, setVideoTime] = useState<number>(0);
  const vttUrl = useVTTFile(captions);

  const trackPlaceInVideo = useCallback(() => {
    if (!videoRef.current) return;

    setVideoTime(videoRef.current?.currentTime);
  }, []);

  /** 
   * TODO: add keyboard shortcuts for left arrow and right arrow 
   * to seek -5 and +5 seconds, respectively.
   *
   * SOLUTION:
   * Use react's native event handler to modify the video time.
   * - react manages focus, cleanup, and other details minimizing work.
   * 
   * ALTERNATIVE SOLUTION:
   * manually attach event listeners to the component, in a useEffect hook. 
   */
  const handleSeekingViaArrows = useCallback((event: React.KeyboardEvent<HTMLVideoElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, (videoRef.current?.currentTime || 0) - 5);
      }
    }
    else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min((videoRef.current?.duration || 0), (videoRef.current?.currentTime || 0) + 5);
      }
    }
  }, []);

  /**
   * TODO: make this page mobile friendly.
   * 
   * SOLUTION:
   * design mobile layout, reverse engineer layout, and reimplement with mobile-first design.
   */

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col lg:flex-row">
      {/** 
       * TODO: Show the captions rendered on top of the video. 
       * 
       * FINAL SOLUTION:
       * Use the browser's native caption rendering via the <track> element in the video tag.
       * Dynamically generate a subtitle file (e.g. .vtt) and load it into the video player.
       * - This approach allows for more flexibility and can support multiple languages.
       * - It would also allow users to toggle captions on and off.
       * - It would allow captions to work in fullscreen mode.
       * 
       * INITIAL SOLUTION:
       * Use absolute positioning to place a div at the bottom center of the video.
       */}
      <video
        ref={videoRef}
        src="/video.mp4"
        controls
        tabIndex={0}
        className='lg:m-auto'
        onKeyDown={handleSeekingViaArrows}
        onTimeUpdate={trackPlaceInVideo}>
        {vttUrl &&
          <track label="English" kind="subtitles" srcLang="en" src={vttUrl} default />
        }
      </video>

      <CaptionsSideBar captions={captions} videoTime={videoTime} />

    </div>
  );
}

export default App;

function useVTTFile(captions: DbRow[]) {
  const [vttUrl, setVttUrl] = useState<string>("");

  useEffect(() => {
    if (captions.length === 0) return;

    const vttContent = generateVTTFromDbRow(captions);
    console.log("vttContent: ", vttContent);
    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    setVttUrl(url);

    return () => {
      if (vttUrl) {
        URL.revokeObjectURL(vttUrl);
      }
    };
  }, [captions]);

  return vttUrl;
}