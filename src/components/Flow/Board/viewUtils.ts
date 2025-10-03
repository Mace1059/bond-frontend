import { type ReactFlowInstance } from '@xyflow/react';

// viewUtils.ts
interface ZoomToNodeOptions {
  nodeX: number;
  nodeY: number;
  nodeWidth: number;
  nodeHeight: number;
  reactFlow: ReactFlowInstance;
  withAnimation?: boolean;
  viewportOverride?: { width: number; height: number };
  durationMs?: number; // 👈 NEW
}

export function zoomToNode({
  nodeX,
  nodeY,
  nodeWidth,
  nodeHeight,
  reactFlow,
  withAnimation = true,
  viewportOverride,
  durationMs = 500, // 👈 default duration
}: ZoomToNodeOptions) {
  const containerEl: HTMLElement | undefined = (reactFlow as any).container || undefined;
  const viewportWidth = viewportOverride?.width ?? containerEl?.clientWidth ?? window.innerWidth;
  const viewportHeight = viewportOverride?.height ?? containerEl?.clientHeight ?? window.innerHeight;

  const zoomMargin = 1;
  const zoomX = viewportWidth / (nodeWidth * zoomMargin);
  const zoomY = viewportHeight / (nodeHeight * zoomMargin);
  const zoom = Math.min(zoomX, zoomY) / 2;

  const nodeCenterX = nodeX + nodeWidth / 2;
  const nodeCenterY = nodeY + nodeHeight / 2;

  reactFlow.setCenter(nodeCenterX, nodeCenterY, {
    zoom,
    duration: withAnimation ? durationMs : 0, // 👈 use your value
  });
}
