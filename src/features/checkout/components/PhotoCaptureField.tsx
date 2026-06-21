"use client";

import { useRef, useState, ChangeEvent } from "react";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];

interface Props {
  // "environment" = rear camera (ID document), "user" = front camera (selfie).
  capture: "environment" | "user";
  prompt: string;
  onSelect: (file: File | null) => void;
}

export const PhotoCaptureField = ({ capture, prompt, onSelect }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const open = () => inputRef.current?.click();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Please choose a JPG, PNG, or HEIC image.");
      onSelect(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is too large (max 10MB).");
      onSelect(null);
      return;
    }
    setError(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    onSelect(file);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={capture}
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="overflow-hidden rounded-2xl border border-border-default bg-black/5">
          {/* Object-URL preview of the just-captured file — next/image can't optimize blob: URLs. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Selected photo preview" className="mx-auto max-h-72 w-full object-contain" />
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-border-default bg-bg-input py-12 text-text-muted transition-colors hover:border-primary"
        >
          <span className="text-sm font-medium text-text-primary">{prompt}</span>
          <span className="text-xs">Tap to take a photo or upload</span>
        </button>
      )}

      {preview && (
        <button
          type="button"
          onClick={open}
          className="mt-3 cursor-pointer text-sm font-medium text-link-blue underline transition-opacity hover:opacity-80"
        >
          Retake or choose another
        </button>
      )}

      {error && <p className="mt-2 text-sm text-text-error">{error}</p>}
    </div>
  );
};
