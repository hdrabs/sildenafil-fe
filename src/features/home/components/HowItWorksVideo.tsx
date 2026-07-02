"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { attachHls } from "@/features/home/lib/hlsVideo";
import type Hls from "hls.js";

interface HowItWorksVideoProps {
  /** HLS master playlist (.m3u8) for the how-it-works explainer. */
  src: string;
  /** Poster shown until the viewer presses play. */
  poster: string;
}

const PlayButton = () => (
  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
    <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden>
      <circle cx="40" cy="40" r="40" fill="rgba(0,0,0,0.7)" />
      <polygon points="32,24 56,40 32,56" fill="#fff" />
    </svg>
  </span>
);

export const HowItWorksVideo = ({ src, poster }: HowItWorksVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  // Show the thumbnail overlay only before the first play. Once started, a pause
  // leaves the current frame on screen with native controls — no thumbnail flash.
  const [started, setStarted] = useState(false);

  // Free the HLS decoder/buffers on unmount.
  useEffect(() => () => hlsRef.current?.destroy(), []);

  const handlePlayClick = async () => {
    const video = videoRef.current;
    if (!video) return;
    // Attach lazily on first play only — nothing downloads until intent.
    if (!hlsRef.current && !video.src) hlsRef.current = await attachHls(video, src);
    try {
      await video.play();
    } catch {
      // Gesture/autoplay rejections are non-fatal — the overlay simply stays up.
    }
  };

  return (
    <div className="group relative aspect-[16/9] w-full max-w-[520px] overflow-hidden rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-lg:mx-auto">
      <video
        ref={videoRef}
        preload="none"
        playsInline
        controls={started}
        controlsList="nodownload nopictureinpicture"
        disablePictureInPicture
        poster={poster}
        onPlay={() => setStarted(true)}
        className="h-full w-full object-cover"
      >
        Your browser does not support the video tag.
      </video>

      {!started && (
        <button
          type="button"
          onClick={handlePlayClick}
          aria-label="Play how it works video"
          className="absolute inset-0 cursor-pointer"
        >
          <Image
            src={poster}
            alt="How it works video"
            fill
            sizes="(max-width: 1024px) 100vw, 520px"
            className="object-cover transition-[filter] duration-300 group-hover:brightness-90"
          />
          <span className="absolute inset-0 bg-black/30" />
          <PlayButton />
        </button>
      )}
    </div>
  );
};
