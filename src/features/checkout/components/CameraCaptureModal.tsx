"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { Button } from "@/components/ui/Button";

interface Props {
  // "environment" = rear camera (ID document), "user" = front camera (selfie).
  facingMode: "environment" | "user";
  fileName: string;
  onCapture: (file: File) => void;
  onClose: () => void;
}

// Live in-browser capture via getUserMedia → a single JPEG frame off a canvas.
// Requires HTTPS (the dev server already runs with --experimental-https).
export const CameraCaptureModal = ({ facingMode, fileName, onCapture, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const supported = typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  const [error, setError] = useState<string | null>(
    supported ? null : "Your browser doesn’t support in-browser capture. Please use Select Photo instead.",
  );

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      })
      .catch(() => {
        setError(
          "We couldn't access your camera. Allow camera access in your browser, or use Select Photo instead.",
        );
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, supported]);

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) onCapture(new File([blob], fileName, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-[640px] rounded-2xl bg-white p-4 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex items-center justify-center rounded-full bg-black/40 p-1 text-white transition-colors hover:bg-black/60"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        {error ? (
          <div className="flex flex-col items-center gap-5 px-4 py-12 text-center">
            <p className="text-sm leading-relaxed text-text-primary">{error}</p>
            <Button variant="coral" size="lg" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl bg-black">
              <video ref={videoRef} playsInline muted className="h-auto max-h-[70vh] w-full" />
            </div>
            <Button variant="coral" size="lg" fullWidth onClick={capture} className="mt-4">
              Capture Photo
            </Button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};
