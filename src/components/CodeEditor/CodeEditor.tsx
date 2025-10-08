import React, { useState } from "react";
import { Sidebar, type PanelType } from "./Sidebar";
import { ResizablePanel } from "./ResizablePanel";
import { EditorPane } from "./EditorPane";
import FileExplorer, { type FileNode } from "./FileExplorer";
import { detectLanguage, loadMainFile } from "./utils";

const COLLAPSE_THRESHOLD = 100;
const MIN_WIDTH = 180;
const MAX_WIDTH = 600;
const DEFAULT_WIDTH = 280;

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");

  const [activePanel, setActivePanel] = useState<PanelType>(null);

  // controlled layout state
  const [panelWidth, setPanelWidth] = useState(DEFAULT_WIDTH);
  const [previousWidth, setPreviousWidth] = useState(DEFAULT_WIDTH);
  const [collapsed, setCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Sidebar toggle
  const handlePanelToggle = async (panel: PanelType) => {
    if (panel === "nodeMainFile") {
      // Collapse the sidebar
      setActivePanel(null);
      setCollapsed(true);
      setPanelWidth(0);

      // Open the file associated with nodeMainFile
      await loadMainFile(setCode, setLanguage);
      return;
    }

    // Default behavior for other panels
    if (activePanel === panel && !collapsed) {
      setActivePanel(null);
      setCollapsed(false);
    } else {
      setActivePanel(panel);
      if (collapsed) {
        setPanelWidth(previousWidth || DEFAULT_WIDTH);
        setCollapsed(false);
      }
    }
  };
  // Resizing lifecycle controlled here (rules live here; mechanics in ResizablePanel)
  const onResizeStart = () => setIsResizing(true);

  const onResizeMove = (deltaX: number) => {
    const next = Math.min(Math.max(panelWidth + deltaX, 0), MAX_WIDTH);

    if (next < COLLAPSE_THRESHOLD) {
      setPreviousWidth(panelWidth > COLLAPSE_THRESHOLD ? panelWidth : DEFAULT_WIDTH);
      setCollapsed(true);
      setPanelWidth(0);
    } else {
      setCollapsed(false);
      const clamped = Math.max(next, MIN_WIDTH);
      setPanelWidth(clamped);
      setPreviousWidth(clamped);
    }
  };

  const onResizeEnd = () => setIsResizing(false);

  // File chosen from explorer
  const handleFileSelect = async (file: FileNode) => {
    const fileHandle = file.handle as FileSystemFileHandle;
    const fileData = await (await fileHandle.getFile()).text();
    setCode(fileData);
    setLanguage(detectLanguage(file.name));
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      {/* Sidebar (fixed) */}
      <Sidebar
        activePanel={activePanel}
        collapsed={collapsed}
        onToggle={handlePanelToggle}
      />

      {/* Left Resizable Panel */}
      <ResizablePanel
        width={panelWidth}
        collapsed={collapsed || !activePanel}
        isResizing={isResizing}
        onResizeStart={onResizeStart}
        onResizeMove={onResizeMove}
        onResizeEnd={onResizeEnd}
      >
        {activePanel === "explorer" && (
          <FileExplorer onFileSelect={handleFileSelect} />
        )}
        {activePanel === "search" && (
          <div className="p-4 text-gray-300">🔍 Search panel (todo)</div>
        )}
        {activePanel === "settings" && (
          <div className="p-4 text-gray-300">⚙️ Settings panel (todo)</div>
        )}
      </ResizablePanel>

      {/* Editor (fills remaining space) */}
      <EditorPane code={code} language={language} onChange={setCode} />
    </div>
  );
};

export default CodeEditor;
