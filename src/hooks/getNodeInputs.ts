// hooks/useNodeInputs.ts
import { useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import type { FlowNode } from "../types/types";

export function useNodeInputs(nodeId: string | null) {
  const reactFlow = useReactFlow();

  return useMemo(() => {
    if (!nodeId) return {};

    const edges = reactFlow.getEdges();
    const incoming = edges.filter((e) => e.target === nodeId);

    const inputs: Record<string, [string, Record<string, any>]> = {};

    for (const edge of incoming) {
      const sourceNode = reactFlow.getNode(edge.source) as FlowNode | null;
      if (sourceNode?.data?.outputs) {
        inputs[sourceNode.id] = [
          sourceNode.data.label ?? sourceNode.id,
          sourceNode.data.outputs,
        ];
      }
    }

    return inputs;
  }, [nodeId, reactFlow.getNodes(), reactFlow.getEdges()]);
}
