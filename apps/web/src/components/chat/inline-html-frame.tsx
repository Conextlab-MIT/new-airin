import { cn } from "@airin/ui/utils";
import { useEffect, useRef, useState } from "react";
import {
  ARTIFACT_FRAME_READY,
  ARTIFACT_FRAME_URL,
  ARTIFACT_HTML_IFRAME_SANDBOX,
  htmlForArtifactPreview,
} from "@/lib/artifact-html-preview";

/**
 * Renders agent HTML (with inline CSS/JS) in a sandboxed artifact frame so
 * scripts cannot touch the host app origin.
 */
export function InlineHtmlFrame({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(240);
  const prepared = `${htmlForArtifactPreview(html)}<script>(()=>{const report=()=>parent.postMessage({airinArtifactHeight:Math.ceil(document.documentElement.scrollHeight)},"*");new ResizeObserver(report).observe(document.documentElement);addEventListener("load",report);report();})();</script>`;

  useEffect(() => {
    const frame = iframeRef.current;

    if (!frame) {
      return;
    }

    function onMessage(event: MessageEvent) {
      if (event.source !== frame?.contentWindow) {
        return;
      }

      if (event.data === ARTIFACT_FRAME_READY) {
        frame.contentWindow?.postMessage({ airinArtifactHtml: prepared }, "*");
        return;
      }

      if (
        event.data &&
        typeof event.data === "object" &&
        typeof event.data.airinArtifactHeight === "number"
      ) {
        setHeight(Math.min(720, Math.max(120, event.data.airinArtifactHeight)));
      }
    }

    window.addEventListener("message", onMessage);

    return () => window.removeEventListener("message", onMessage);
  }, [prepared]);

  return (
    <div
      className={cn(
        "my-3 w-full overflow-hidden rounded-xl border border-border bg-background shadow-sm",
        className
      )}
    >
      <iframe
        className="w-full border-0"
        ref={iframeRef}
        sandbox={ARTIFACT_HTML_IFRAME_SANDBOX}
        src={ARTIFACT_FRAME_URL}
        style={{ height }}
        title="Interactive result"
      />
    </div>
  );
}
