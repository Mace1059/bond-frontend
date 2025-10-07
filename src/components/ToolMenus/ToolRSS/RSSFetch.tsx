import React, { useEffect, useState } from "react";
import DragTextInput from "../../DragTextInput/DragTextInput";
import type { FlowNode } from "../../../types/types";
import { useNodeInputs } from "../../../hooks/getNodeInputs";
import { updateNodeData } from "../../Flow/Nodes/flowNode";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { apiFetch } from "../../../utils/client";


interface RSSFetchProps {
  selectedNode: FlowNode;
}


const RSSFetch: React.FC<RSSFetchProps> = ({ selectedNode }) => {
  const [inputValue, setInputValue] = useState(selectedNode.data.toolConfig?.rss_url || "");
  const inputs = useNodeInputs(selectedNode.id);
  const [sampleData, setSampleData] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setInputValue(selectedNode.data.toolConfig?.rss_url || "");
  }, [selectedNode]);

  const fetchSampleRSSFeed = async (url: string) => {

    try {
      const data = await apiFetch(`/rss/fetch?url=${encodeURIComponent(url.trim())}`);
      setSampleData(data);
      updateNodeData(dispatch, selectedNode, {
        outputs: data
      });
    }
    catch (error) {
      console.error("Error fetching sample RSS feed:", error);
    }
  };

  const handleUrlChange = (value: string) => {
    setInputValue(value);
    updateNodeData(dispatch, selectedNode, {
      toolConfig: {
        ...selectedNode.data.toolConfig,
        rss_url: value
      }
    });
  };


  return (
    <div className="p-6 space-y-4">
      <DragTextInput
        json={inputs}
        placeholder="RSS URL"
        onChange={handleUrlChange}
        value={inputValue}
      />

      {Object.keys(inputs).length > 0 && <div className="text-gray-300">
        <strong>Parsed URL:</strong> {inputValue}
      </div>}

      <button onClick={() => fetchSampleRSSFeed(inputValue)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded z-10">
        Fetch Sample RSS Feed
      </button>

      {sampleData && (
        <pre className="bg-gray-800 p-3 rounded text-xs overflow-auto">
          {JSON.stringify(sampleData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default RSSFetch;
