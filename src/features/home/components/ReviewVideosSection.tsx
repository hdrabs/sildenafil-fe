"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type Hls from "hls.js";

type ReviewTheme = "sildenafil" | "tadalafil";

interface ReviewVideosSectionProps {
  /** Drug drives the nav-arrow accent colour. Defaults to sildenafil. */
  theme?: ReviewTheme;
  className?: string;
}

const VIDEOS = [
  "https://d3959x8cuku1ma.cloudfront.net/review%20videos/cr-5/review-five-vid.m3u8",
  "https://d3959x8cuku1ma.cloudfront.net/review%20videos/cr-1/review-one-vid.m3u8",
  "https://d3959x8cuku1ma.cloudfront.net/review%20videos/cr-7/review-seven-vid.m3u8",
  "https://d3959x8cuku1ma.cloudfront.net/review%20videos/cr-2/review-two-vid.m3u8",
  "https://d3959x8cuku1ma.cloudfront.net/review%20videos/cr-3/review-three-vid.m3u8",
  "https://d3959x8cuku1ma.cloudfront.net/review%20videos/cr-4/review-four-vid.m3u8",
  "https://d3959x8cuku1ma.cloudfront.net/review%20videos/cr-6/review-six-vid.m3u8",
];

// Thumbnails mirror the video path on the S3 bucket: .../{folder}/{name}-thumb.jpg
const thumbnailFor = (videoUrl: string) => {
  const parts = videoUrl.split("/");
  const folder = parts[parts.length - 2];
  const name = parts[parts.length - 1].replace(".m3u8", "");
  return `https://aum-videos.s3.us-west-1.amazonaws.com/review+videos/${folder}/${name}-thumb.jpg`;
};

const PlayIcon = () => (
  <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
      <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.7)" />
      <polygon points="26,20 48,32 26,44" fill="#fff" />
    </svg>
  </span>
);

interface VideoCardProps {
  src: string;
  poster: string;
  index: number;
  isPlaying: boolean;
  onPlay: (i: number) => void;
  onPause: (i: number) => void;
}

const VideoCard = ({ src, poster, index, isPlaying, onPlay, onPause }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Free the HLS decoder/buffers on unmount.
  useEffect(() => () => hlsRef.current?.destroy(), []);

  // When another card starts playing, pause this one.
  useEffect(() => {
    if (!isPlaying) videoRef.current?.pause();
  }, [isPlaying]);

  const ensureSource = async () => {
    const video = videoRef.current;
    if (!video || hlsRef.current || video.src) return;

    // Safari plays HLS natively; everyone else needs hls.js — loaded lazily so
    // it stays out of the initial bundle and only downloads on first play.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    const HlsCtor = (await import("hls.js")).default;
    if (HlsCtor.isSupported()) {
      const hls = new HlsCtor({ enableWorker: true });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  };

  const handlePlayClick = async () => {
    await ensureSource();
    try {
      await videoRef.current?.play();
    } catch {
      // Gesture/autoplay rejections are non-fatal — the overlay simply stays up.
    }
  };

  return (
    <div data-review-card className="w-[270px] shrink-0 snap-start">
      <div className="group relative aspect-[9/16] overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          preload="none"
          playsInline
          controls={isPlaying}
          controlsList="nodownload nopictureinpicture"
          disablePictureInPicture
          onPlay={() => onPlay(index)}
          onPause={() => onPause(index)}
          className="h-full w-full rounded-xl object-contain"
        >
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <button
            type="button"
            onClick={handlePlayClick}
            aria-label={`Play patient review ${index + 1}`}
            className="absolute inset-0 cursor-pointer"
          >
            <Image src={poster} alt="" fill sizes="270px" className="rounded-xl object-cover" />
            <span className="absolute inset-0 rounded-xl bg-black/25" />
            <PlayIcon />
          </button>
        )}
      </div>
    </div>
  );
};

const ArrowButton = ({
  direction,
  disabled,
  accent,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  accent: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={direction === "prev" ? "Previous reviews" : "Next reviews"}
    style={disabled ? undefined : { backgroundColor: accent, borderColor: accent }}
    className={cn(
      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors",
      disabled
        ? "cursor-not-allowed border-[#BFD9E4] bg-white opacity-50"
        : "cursor-pointer hover:opacity-90",
    )}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={direction === "prev" ? "M10.5 13L6 8L10.5 3" : "M5.5 3L10 8L5.5 13"}
        stroke={disabled ? "#BFD9E4" : "#fff"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export const ReviewVideosSection = ({ theme = "sildenafil", className }: ReviewVideosSectionProps) => {
  const accent = theme === "tadalafil" ? "#CD8F24" : "#204AD7";
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.getBoundingClientRect().width + 16 : 286;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setAtStart(track.scrollLeft <= 5);
      setAtEnd(track.scrollLeft >= max - 5);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <section className={cn("bg-white", className)}>
      <div className="w-full pt-10 pb-12 md:pt-[100px] md:pb-[100px]">
        <div className="mx-auto mb-14 flex max-w-[1320px] items-center justify-between px-6">
          <h2 className="text-[32px] font-medium leading-[1.2] text-[#0e2836] md:text-[45px] md:leading-[142.5%]">
            Real Patients.<br className="min-[650px]:hidden" /> Real Results.
          </h2>
          <div className="flex items-center gap-2">
            <ArrowButton direction="prev" disabled={atStart} accent={accent} onClick={() => scrollByCard(-1)} />
            <ArrowButton direction="next" disabled={atEnd} accent={accent} onClick={() => scrollByCard(1)} />
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {VIDEOS.map((src, i) => (
            <VideoCard
              key={src}
              src={src}
              poster={thumbnailFor(src)}
              index={i}
              isPlaying={playingIndex === i}
              onPlay={(idx) => setPlayingIndex(idx)}
              onPause={(idx) => setPlayingIndex((p) => (p === idx ? null : p))}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
