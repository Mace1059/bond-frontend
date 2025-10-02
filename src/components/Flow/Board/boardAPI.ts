import axios from 'axios';
import type { Node, Edge } from '@xyflow/react';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function saveFlowToServer(nodes: Node[], edges: Edge[], flowId: string | undefined, userEmail: string) {
  const saveFlowData = new FormData();
  saveFlowData.append('nodes', JSON.stringify(nodes));
  saveFlowData.append('edges', JSON.stringify(edges));
  saveFlowData.append('flow_id', flowId ?? '');
  saveFlowData.append('user_email', userEmail);

  return axios.post(`${API_URL}api/save-flow`, saveFlowData);
}
