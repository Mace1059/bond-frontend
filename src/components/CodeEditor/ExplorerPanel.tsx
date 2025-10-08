import React from "react";
import Editor from "@monaco-editor/react";

interface EditorPaneProps {
  code: string;
  language: string;
  onChange: (val: string) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({ code, language, onChange }) => {
  return (
    <div className="flex-1 min-w-0">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
      />
    </div>
  );
};
