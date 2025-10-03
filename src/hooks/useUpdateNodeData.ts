// hooks/useUpdateNodeData.ts
import { useReactFlow } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { updateNode } from "../store/nodesSlice";
import type { FlowNode, FlowNodeData } from "../types/types";

export function useUpdateNodeData() {
  const rf = useReactFlow();
  const dispatch = useDispatch();

  return (nodeId: string, newData: Partial<FlowNodeData>) => {
    const freshNode = rf.getNode(nodeId) as FlowNode | undefined;
    if (!freshNode) return;

    dispatch(
      updateNode({
        ...freshNode,
        data: {
          ...freshNode.data,
          ...newData,
        },
      })
    );
  };
}
