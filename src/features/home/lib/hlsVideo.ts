import type Hls from "hls.js";

const CLOUDFRONT_HOST = "d3959x8cuku1ma.cloudfront.net";
const S3_HOST = "aum-videos.s3.us-west-1.amazonaws.com";

/**
 * Poster URL for a CloudFront-hosted HLS video, derived from the video URL.
 * CloudFront routes every image extension to the app origin, so posters are
 * fetched straight from the S3 bucket instead — same key, .m3u8 swapped for
 * -thumb.jpg. Shared by both video sections so posters are derived identically.
 */
export const thumbnailFor = (videoUrl: string): string =>
  videoUrl
    .replace(CLOUDFRONT_HOST, S3_HOST)
    .replace(/%20/g, "+")
    .replace(/\.m3u8$/, "-thumb.jpg");

/**
 * Attach an HLS source to a <video>, tuned for small in-page players.
 *
 * Why a shared helper: both the review carousel and the how-it-works player
 * need the exact same behaviour, and the legacy app drifted because two copies
 * diverged (one had error recovery, one didn't). Keep the config in one place.
 *
 * Behaviour: hls.js is imported lazily so it stays out of the initial bundle and
 * only downloads on first play; quality is capped to the rendered size so mobile
 * never pulls a rendition it can't display; look-ahead is bounded so pausing
 * wastes little data; and it self-recovers from transient errors.
 *
 * Returns the Hls instance (destroy it on cleanup), or null when the browser
 * plays HLS natively (Safari) so no instance was created.
 */
export const attachHls = async (video: HTMLVideoElement, src: string): Promise<Hls | null> => {
  // Safari plays HLS natively; everyone else needs hls.js.
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = src;
    return null;
  }
  const HlsCtor = (await import("hls.js")).default;
  if (!HlsCtor.isSupported()) {
    video.src = src;
    return null;
  }
  const hls = new HlsCtor({
    enableWorker: true,
    // Player renders small, so never pull a rendition larger than the box —
    // keeps mobile off the heavy top rungs it can't display.
    capLevelToPlayerSize: true,
    // Bound look-ahead so pausing/scrolling away wastes little data, and free
    // played buffer to stay light on low-end phones.
    maxBufferLength: 20,
    backBufferLength: 30,
  });
  // Recover from transient network/media errors instead of dying on the first blip.
  hls.on(HlsCtor.Events.ERROR, (_event, data) => {
    if (!data.fatal) return;
    if (data.type === HlsCtor.ErrorTypes.NETWORK_ERROR) hls.startLoad();
    else if (data.type === HlsCtor.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
    else hls.destroy();
  });
  hls.loadSource(src);
  hls.attachMedia(video);
  return hls;
};
