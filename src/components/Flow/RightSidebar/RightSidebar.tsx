import { X } from "lucide-react";
import { useRef, useState } from "react";

type RightSidebarProps = {
  open: boolean;
  onClose: () => void;
  nodeId: string | null;
  onTransitionEnd?: () => void;
};

export default function RightSidebar({
  open,
  onClose,
  nodeId,
  onTransitionEnd,
}: RightSidebarProps) {
  const [width, setWidth] = useState(384); // default 96 * 4 = 384px
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const newWidth = Math.max(250, startWidth + delta);
      setWidth(newWidth); // ✅ instant, 1:1 with mouse
    };

    const stopResizing = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResizing);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  return (
    <aside
      ref={sidebarRef}
      onTransitionEnd={onTransitionEnd}
      className={`relative h-full bg-white border-l border-gray-300 shadow-xl flex flex-col overflow-hidden`}
      style={{
        width: open ? width : 0,
        transition: isDragging.current ? "none" : "width 0.3s ease-in-out",
      }}
    >
      {/* RESIZE HANDLE */}
      {open && (
        <div
          onMouseDown={startResizing}
          className="absolute top-0 left-0 w-3 cursor-ew-resize hover:bg-blue-400/30 active:bg-blue-500/50"
          style={{ transform: "translateX(-4px)", height: "100%" }}
        />
      )}

      {/* HEADER */}
      <div
        className={`flex items-center justify-between h-14 px-4 border-b border-gray-200 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-lg font-semibold">Node Details</span>
        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* CONTENT */}
      <div
        className={`flex-1 overflow-y-auto p-4 transition-opacity duration-300 ${
          open ? "opacity-100 delay-150" : "opacity-0"
        }`}
      >
        {nodeId ? (
          <div>
            <p className="text-sm text-gray-600 mb-2">Focused node:</p>
            <p className="font-mono bg-gray-100 rounded p-2 break-all">{nodeId}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No node selected</p>
        )}
      </div>
    </aside>
  );
}
