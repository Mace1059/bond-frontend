// RightSidebar.tsx
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { ButtonSelector } from "../../ButtonSelector/ButtonSelector";
import { JsonFieldSelector } from "./JSON_selector";
import { useReactFlow } from "@xyflow/react";
import type { FlowNode, FlowNodeData } from "../../../types/types";
import { useNodeInputs } from "../../../hooks/getNodeInputs";
import NodeDetail from "./NodeDetail";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

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
  const [selected, setSelected] = useState("Node Details");

  // Node input/output display logic
  const reactFlow = useReactFlow();
  const nodeData = useMemo(() => {
    if (!nodeId) return null;
    const node = reactFlow.getNode(nodeId);
    return node?.data as FlowNodeData | null;
  }, [nodeId, reactFlow]);
  const outputsJson = nodeData?.outputs ?? {};
  const inputs = useNodeInputs(nodeId);

  // Resize logic
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

  const selectedNode = useSelector((state: RootState) =>
    nodeId ? state.nodes.byId[nodeId] : null
  );
  
  return (
    <aside
      onTransitionEnd={onTransitionEnd}
      className="relative h-full bg-gray-900 border-l border-gray-800 shadow-xl flex flex-col overflow-hidden box-border"
      style={{
        width: open ? width : 0,
        transition: isResizing ? "none" : "width 0.2s ease",
      }}
    >
      {open && (
        <div
          onMouseDown={startResizing}
          className="absolute top-0 left-[-1px] h-full w-3 cursor-ew-resize z-20 hover:bg-blue-400/20"/>
      )}

      <div className={`flex items-center justify-between h-11 px-4 border-b border-gray-800 ${open ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}>
        <ButtonSelector
          options={["Inputs", "Node Details", "Outputs"]}
          color="green"
          value={selected}
          onChange={setSelected}
          size="md"
        />
          
        <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close sidebar">
          <X size={18} />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto p-4 ${open ? "opacity-100" : "opacity-0"} transition-opacity duration-200 delay-75`}>


        {selected === "Inputs" &&
        Object.entries(inputs).map(([nodeId, [name, data]]) => (
          <div key={nodeId} className="mb-4">
            <h3 className="font-semibold text-sm mb-2 pl-4">
              From {name}
            </h3>
            <JsonFieldSelector
              data={data as Record<string, any>}
              onChange={(filtered) => {console.log(`Selected JSON changed for ${data}:`, filtered)}}
            />
          </div>
        ))}

        {selected === "Node Details" &&
           <NodeDetail selectedNode={selectedNode as FlowNode | null} />
        }
        
        {selected === "Outputs" &&
        <JsonFieldSelector
          data={outputsJson}
          onChange={(filtered) => {
            console.log("Selected JSON changed:", filtered);
          }}
        />
        }
        

      </div>
    </aside>
  );
}
