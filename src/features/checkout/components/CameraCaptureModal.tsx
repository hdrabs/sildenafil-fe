"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

interface Props {
  // "environment" = rear camera (ID document), "user" = front camera (selfie).
  facingMode: "environment" | "user";
  fileName: string;
  onCapture: (file: File) => void;
  /** "Upload photo instead" — close and open the file picker. */
  onUploadInstead: () => void;
  onClose: () => void;
}

type Status = "requesting" | "streaming" | "blocked";

// Desktop live capture, mirroring the legacy aum flow: request the webcam → show
// "please grant permission" while the prompt is up → stream + capture if allowed,
// or a "can't access webcam" card (Upload / Try again) if denied or unsupported.
// Mobile skips this entirely and uses the OS camera via a file input (PhotoUploadStep).
export const CameraCaptureModal = ({ facingMode, fileName, onCapture, onUploadInstead, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("requesting");
  const [retryKey, setRetryKey] = useState(0);
  // The <video> stays transparent (over a light placeholder + spinner) until it
  // actually starts playing, so no black frame flashes and the height is fixed.
  const [ready, setReady] = useState(false);

  // Request the webcam on mount and on each retry; status only flips inside the
  // async resolve/reject (never synchronously in the effect). No getUserMedia
  // (old browser, insecure context, in-app webview) routes to the blocked card.
  useEffect(() => {
    let cancelled = false;
    const media = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    const request = media?.getUserMedia
      ? media.getUserMedia({ video: { facingMode }, audio: false })
      : Promise.reject(new Error("unsupported"));

    request
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setStatus("streaming");
      })
      .catch(() => {
        if (!cancelled) setStatus("blocked");
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [facingMode, retryKey]);

  const retry = () => {
    setReady(false);
    setStatus("requesting");
    setRetryKey((k) => k + 1);
  };

  // Attach the stream once the <video> is mounted (streaming state).
  useEffect(() => {
    const video = videoRef.current;
    if (status !== "streaming" || !video || !streamRef.current) return;
    video.srcObject = streamRef.current;
    void video.play().catch(() => {});
  }, [status]);

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

  // Closing/uploading unmounts the modal, whose effect cleanup releases the camera.

  // ── Blocked / unsupported: white instruction card (aum CameraInstructions) ──
  if (status === "blocked") {
    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-lg rounded-[5px] bg-white p-6 shadow-xl sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 cursor-pointer text-2xl leading-none text-text-muted transition-opacity hover:opacity-80"
          >
            &times;
          </button>

          <h5 className="pr-8 text-xl font-semibold text-text-primary">Unable to access webcam</h5>
          <p className="mt-2 text-sm leading-relaxed text-text-primary">
            To grant access to your webcam, click the video icon in your navigation bar and select allow
          </p>

          <div className="my-5 flex justify-center">
            <Image
              src="/images/camera-instructions.svg"
              alt=""
              width={326}
              height={201}
              unoptimized
              className="h-auto w-full max-w-[300px]"
            />
          </div>

          <p className="text-sm leading-relaxed text-text-primary">
            Once you have granted access try again. You may choose to upload a photo from your library by
            clicking upload photo.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onUploadInstead}
              className="flex-1 cursor-pointer rounded-full border border-coral bg-white py-3 text-sm font-normal uppercase tracking-wide text-coral transition-all hover:bg-coral hover:text-white hover:shadow-md"
            >
              Upload Photo
            </button>
            <Button
              variant="coral"
              onClick={retry}
              fullWidth
              className="flex-1 font-normal transition-all hover:shadow-md"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  // ── Requesting: dark overlay with the permission-prompt copy ──
  if (status === "requesting") {
    return createPortal(
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/80 px-6 text-center">
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        <h2 className="max-w-md text-2xl font-semibold leading-snug text-white">
          Please grant permission to access your webcam
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-sm text-white/80 underline transition-colors hover:text-white"
        >
          Cancel
        </button>
      </div>,
      document.body,
    );
  }

  // ── Streaming: live preview + capture inside a white modal card ──
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-[640px] rounded-2xl bg-white p-4 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-10 cursor-pointer text-[28px] leading-none text-white drop-shadow-md transition-opacity hover:opacity-80"
        >
          &times;
        </button>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-bg-input">
          <video
            ref={videoRef}
            playsInline
            muted
            onPlaying={() => setReady(true)}
            // Mirror the preview only (natural self-view); the canvas capture below
            // reads the raw video frame, so the saved photo stays un-mirrored.
            className={`h-full w-full -scale-x-100 object-cover transition-opacity duration-200 ${
              ready ? "opacity-100" : "opacity-0"
            }`}
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-coral" />
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Button
            variant="coral"
            size="lg"
            onClick={capture}
            className="mt-4 w-[240px] max-w-full font-normal transition-all hover:shadow-md"
          >
            Capture Photo
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
