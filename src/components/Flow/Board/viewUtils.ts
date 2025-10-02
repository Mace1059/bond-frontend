import { type ReactFlowInstance } from '@xyflow/react';

interface ZoomToNodeOptions {
  nodeX: number;
  nodeY: number;
  nodeWidth: number;
  nodeHeight: number;
  reactFlow: ReactFlowInstance;
  withAnimation?: boolean;
}

/**
 * Smoothly zooms and centers the viewport on a node.
 * Accounts for viewport size and applies a horizontal offset for right modals.
 */
export function zoomToNode({
  nodeX,
  nodeY,
  nodeWidth,
  nodeHeight,
  reactFlow,
  withAnimation = true,
}: ZoomToNodeOptions) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const zoomMargin = 1.5;
  const zoomX = viewportWidth / (nodeWidth * zoomMargin);
  const zoomY = viewportHeight / (nodeHeight * zoomMargin);
  const zoom = Math.min(zoomX, zoomY) / 2; // same as your dblclick

  const nodeCenterX = nodeX + nodeWidth / 2;
  const nodeCenterY = nodeY + nodeHeight / 2;
  // const horizontalOffset = (viewportWidth) * 0.25;
  const horizontalOffset = 0;

  reactFlow.setCenter(nodeCenterX + horizontalOffset, nodeCenterY, {
    zoom,
    duration: withAnimation ? 500 : 0,
  });
}
