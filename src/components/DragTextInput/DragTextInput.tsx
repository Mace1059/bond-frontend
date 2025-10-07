import React, { useState, useRef, useEffect } from "react";

interface DragTextInputProps {
  json: Record<string, any>;
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
}

const DragTextInput: React.FC<DragTextInputProps> = ({ json, placeholder, onChange, value }) => {
  const [text, setText] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const keys = Object.keys(json);

  const updateText = (newText: string) => {
    setText(newText);
    onChange?.(newText);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: string) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const droppedText = e.dataTransfer.getData("text/plain");
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const placeholderText = `{{${droppedText}}}`;
    const newText = text.slice(0, start) + placeholderText + text.slice(end);
    updateText(newText);

    // Move cursor to after inserted text
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + placeholderText.length;
      textarea.focus();
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };



  useEffect(() => {
    if (value !== undefined) {
      setText(value);
    }
  }, [value]);

  return (
    <div className="space-y-4">
      {/* Draggable items */}
      <div className="flex flex-wrap gap-2">
        {keys.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="px-2 py-1 bg-blue-600 text-white rounded cursor-grab hover:bg-blue-500"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Auto-resizing Textarea */}
      <textarea
        ref={textareaRef}
        value={value !== undefined ? value : text}
        onChange={(e) => updateText(e.target.value)}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        placeholder={placeholder || "Type or drag items here..."}
        className="w-full p-2 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none overflow-hidden"
        style={{ fieldSizing: 'content' } as React.CSSProperties}
        rows={1}
      />

      {/* Raw text block */}
      {/* <div className="p-2 border border-gray-700 rounded bg-gray-800 font-mono text-sm whitespace-pre-wrap">
        {text}
      </div> */}
    </div>
  );
};

export default DragTextInput;
