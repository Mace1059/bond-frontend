import React from "react";

export type ResizablePanelProps = {
  width: number;                // controlled width
  collapsed: boolean;           // controlled collapse
  isResizing: boolean;          // controlled "drag in progress"
  onResizeStart: () => void;    // parent sets isResizing + installs listeners
  onResizeMove: (deltaX: number) => void; // panel -> parent (deltaX since mousedown)
  onResizeEnd: () => void;      // parent removes listeners + cleanup
  children: React.ReactNode;
  className?: string;
};

export function ResizablePanel({
  width,
  collapsed,
  isResizing,
  onResizeStart,
  onResizeMove,
  onResizeEnd,
  children,
  className = "",
}: ResizablePanelProps) {
  // Don’t participate in flex if collapsed
  if (collapsed) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    // Lock cursor & selection here (panel knows UX details)
    const oldCursor = document.body.style.cursor;
    const oldSelect = (document.body.style as any).userSelect;
    document.body.style.cursor = "col-resize";
    (document.body.style as any).userSelect = "none";

    const startX = e.clientX;
    onResizeStart();

    const onMove = (ev: MouseEvent) => {
      onResizeMove(ev.clientX - startX);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = oldCursor;
      (document.body.style as any).userSelect = oldSelect;
      onResizeEnd();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className={`relative bg-gray-950 border-r border-gray-800 overflow-hidden flex-shrink-0 ${className}`}
      style={{ width, transition: isResizing ? "none" : "width 0.2s ease" }}
    >
      {children}

      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 h-dvh w-3 cursor-ew-resize hover:bg-blue-400/20 z-20"
        aria-label="Resize sidebar"
      />
    </div>
  );
}
