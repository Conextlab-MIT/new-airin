import { cn } from "@airin/ui/utils";
import { useEffect, useRef, useState } from "react";
import { useAuthenticatedImagePreview } from "@/components/chat/use-artifact-preview-content";
import type { ChatArtifactRef } from "@/lib/chat-artifacts";
import { FILE_PREVIEW_MAX_BYTES } from "@/lib/chat-artifacts";
import { formatBytes } from "@/lib/knowledge-base-files";

const MAX_INLINE_IMAGE_BYTES = FILE_PREVIEW_MAX_BYTES;

function InlineArtifactImageBody({
  artifact,
  error,
  shouldLoad,
  tooLarge,
  url,
}: {
  artifact: ChatArtifactRef;
  error: string | null;
  shouldLoad: boolean;
  tooLarge: boolean;
  url: string | null;
}) {
  if (tooLarge) {
    return (
      <p className="px-4 py-6 text-center text-muted-foreground text-sm">
        Preview skipped ({formatBytes(artifact.sizeBytes)}). Use Open in to
        view.
      </p>
    );
  }
  if (!shouldLoad) {
    return (
      <div
        aria-hidden
        className="mx-auto aspect-square w-full max-w-sm animate-pulse rounded-lg bg-muted/60"
      />
    );
  }
  if (error) {
    return (
      <p className="px-4 py-4 text-center text-destructive text-sm">{error}</p>
    );
  }
  if (!url) {
    return (
      <div
        aria-busy
        aria-label="Loading image preview"
        className="mx-auto aspect-square w-full max-w-sm animate-pulse rounded-lg bg-muted/60"
      />
    );
  }
  return (
    <img
      alt={artifact.filename}
      className="mx-auto max-h-80 w-full max-w-sm object-contain"
      decoding="async"
      height={320}
      loading="lazy"
      src={url}
      width={320}
    />
  );
}

/**
 * Sandboxed-style inline frame for profile image artifacts (same chrome as HTML
 * inline previews). Fetches lazily when near the viewport and caps payload size.
 */
export function InlineArtifactImageFrame({
  artifact,
  className,
  onOpen,
  profileId,
}: {
  artifact: ChatArtifactRef;
  className?: string;
  onOpen?: () => void;
  profileId: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;

    if (!host || shouldLoad) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "120px" }
    );

    observer.observe(host);

    return () => observer.disconnect();
  }, [shouldLoad]);

  const tooLarge =
    artifact.sizeBytes > 0 && artifact.sizeBytes > MAX_INLINE_IMAGE_BYTES;
  const active = shouldLoad && !tooLarge;

  const { error, url } = useAuthenticatedImagePreview(
    active ? profileId : null,
    active ? artifact.path : null
  );

  const body = (
    <InlineArtifactImageBody
      artifact={artifact}
      error={error}
      shouldLoad={shouldLoad}
      tooLarge={tooLarge}
      url={url}
    />
  );

  return (
    <div
      className={cn(
        "my-1 w-full overflow-hidden rounded-xl border border-border bg-muted/20 shadow-sm",
        className
      )}
      ref={hostRef}
    >
      {onOpen ? (
        <button
          aria-label={`Preview ${artifact.filename}`}
          className="flex w-full cursor-pointer items-center justify-center p-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          onClick={onOpen}
          type="button"
        >
          {body}
        </button>
      ) : (
        <div className="flex w-full items-center justify-center p-3">
          {body}
        </div>
      )}
    </div>
  );
}
