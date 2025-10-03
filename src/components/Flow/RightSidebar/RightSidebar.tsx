// RightSidebar.tsx
import { X } from "lucide-react";
import { useState } from "react";

type RightSidebarProps = {
  open: boolean;
  onClose: () => void;
  nodeId: string | null;
  onTransitionEnd?: () => void;
  width: number;
  onResize: (w: number) => void;
  onResizingChange?: (resizing: boolean) => void; // NEW
};

export default function RightSidebar({
  open,
  onClose,
  nodeId,
  onTransitionEnd,
  width,
  onResize,
  onResizingChange,
}: RightSidebarProps) {
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    onResizingChange?.(true); // NEW

    const startX = e.clientX;
    const startWidth = width;
    const minWidth = startWidth === 0 ? 0 : 500;

    const oldCursor = document.body.style.cursor;
    const oldSelect = (document.body.style as any).userSelect;
    document.body.style.cursor = "col-resize";
    (document.body.style as any).userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      const delta = startX - ev.clientX; // drag left to increase width
      const next = Math.max(minWidth, startWidth + delta);
      onResize(next);
    };

    const onUp = () => {
      setIsResizing(false);
      onResizingChange?.(false); // NEW
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = oldCursor;
      (document.body.style as any).userSelect = oldSelect;
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <aside
      onTransitionEnd={onTransitionEnd}
      className="relative h-full bg-white border-l border-gray-300 shadow-xl flex flex-col overflow-hidden"
      style={{
        width: open ? width : 0,
        transition: isResizing ? "none" : "width 0.2s ease",
      }}
    >
      {open && (
        <div
          onMouseDown={startResizing}
          className="absolute top-0 left-0 h-full w-3 cursor-ew-resize z-20 hover:bg-blue-400/20"
        />
      )}

      <div className={`flex items-center justify-between h-14 px-4 border-b border-gray-200 ${open ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}>
        <span className="text-lg font-semibold">Node Details</span>
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 ${open ? "opacity-100" : "opacity-0"} transition-opacity duration-200 delay-75`}>
        {nodeId ? (
          <>
            <p className="text-sm text-gray-600 mb-2">Focused node:</p>
            <p className="font-mono bg-gray-800 rounded p-2 break-all">{nodeId}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">No node selected</p>
        )}
      </div>
    </aside>
  );
}
