import React, { useState } from "react";

interface JsonFieldSelectorProps {
  data: Record<string, any>;
  onChange?: (selected: Record<string, any>) => void;
}

export const JsonFieldSelector: React.FC<JsonFieldSelectorProps> = ({
  data,
  onChange,
}) => {
  const keys = Object.keys(data);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) => {
      const isSelected = prev.includes(key);
      const updated = isSelected
        ? prev.filter((k) => k !== key)
        : [...prev, key];

      if (onChange) {
        const filtered: Record<string, any> = {};
        for (const k of updated) filtered[k] = data[k];
        onChange(filtered);
      }

      return updated;
    });
  };

  const printSelectedJson = () => {
    const filtered: Record<string, any> = {};
    for (const key of selectedKeys) {
      filtered[key] = data[key];
    }
    console.log("📝 Filtered JSON:", filtered);
    alert(JSON.stringify(filtered, null, 2));
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-200 rounded-md">
      <div className="flex flex-wrap gap-2 mb-4">
        {keys.map((key) => {
          const active = selectedKeys.includes(key);
          return (
            <button
              key={key}
              onClick={() => toggleKey(key)}
              className={`px-3 py-1 rounded text-sm transition
                ${active ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* Original JSON */}
      <pre className="bg-gray-800 p-3 rounded text-xs max-h-60 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>

      <button
        onClick={printSelectedJson}
        className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm"
      >
        Print Selected JSON
      </button>
    </div>
  );
};
