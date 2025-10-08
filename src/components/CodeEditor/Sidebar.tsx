import React from "react";
import { FileCode, Folder, Search, Settings } from "lucide-react";

export type PanelType = "nodeMainFile" | "explorer" | "search" | "settings" | null;

interface SidebarProps {
  activePanel: PanelType;
  collapsed: boolean;
  onToggle: (panel: PanelType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePanel, collapsed, onToggle }) => {
  return (
    <aside className="w-12 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-2 space-y-2">
      <SidebarIcon
        icon={<FileCode size={20} />}
        active={activePanel === "nodeMainFile" && !collapsed}
        onClick={() =>
          onToggle("nodeMainFile")
        }
      />
      <SidebarIcon
        icon={<Folder size={20} />}
        active={activePanel === "explorer" && !collapsed}
        onClick={() => onToggle("explorer")}
      />
      <SidebarIcon
        icon={<Search size={20} />}
        active={activePanel === "search" && !collapsed}
        onClick={() => onToggle("search")}
      />
      <SidebarIcon
        icon={<Settings size={20} />}
        active={activePanel === "settings" && !collapsed}
        onClick={() => onToggle("settings")}
      />
    </aside>
  );
};

function SidebarIcon({
  icon,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-10 h-10 flex items-center justify-center rounded hover:bg-gray-800 transition-colors",
        active ? "bg-gray-800 text-blue-400" : "text-gray-400",
      ].join(" ")}
    >
      {icon}
    </button>
  );
}
