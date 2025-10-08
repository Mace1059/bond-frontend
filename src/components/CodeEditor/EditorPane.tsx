import React from "react";
import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  language: string;
  onChange: (val: string) => void;
  className?: string;
};

export const EditorPane: React.FC<Props> = ({ code, language, onChange, className = "" }) => {
  return (
    <div className={`flex-1 min-w-0 min-h-0 overflow-hidden ${className}`}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{ automaticLayout: true }}
      />
    </div>
  );
};
