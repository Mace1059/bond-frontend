// NumberNodeComponent.tsx
import { useCallback, useRef } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';

type NumberNode = Node<{ number: number }, 'number'>;

export default function NumberNodeComponent({
  id,
  data,
  positionAbsoluteX,
  positionAbsoluteY,
}: NodeProps<NumberNode>) {

  const nodeRef = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();
  const handleDoubleClick = useCallback(() => {
    const el = nodeRef.current;
    if (!el) return;

    // Save previous viewport to return to
    const viewport = reactFlow.getViewport();

    window.dispatchEvent(
      new CustomEvent('node-focus', { detail: { id, viewport } })
    );
    }, [id, positionAbsoluteX, positionAbsoluteY, reactFlow]);

  return (
    <div
      ref={nodeRef}
      onDoubleClick={handleDoubleClick}
      style={{
        background: '#2b2c4aff',
        border: '1px solid #ddd',
        padding: 10,
        borderRadius: 5,
        cursor: 'pointer',
        textAlign: 'center',
      }}
    >
      <h1>A special number: <strong>{data.number}</strong></h1>
    </div>
  );
}
