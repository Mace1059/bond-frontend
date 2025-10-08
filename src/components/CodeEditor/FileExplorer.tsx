import React, { useCallback, useMemo, useState } from "react";

export interface FileNode {
  name: string;
  kind: "file" | "directory";
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  children?: FileNode[];
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = useCallback((path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  }, []);

  const openDirectory = useCallback(async () => {
    const dirHandle = await (window as any).showDirectoryPicker();
    const tree = await readDirectoryRecursively(dirHandle);
    setFiles(tree);
    setExpanded({}); // reset expansion when a new folder is opened
  }, []);

  const tree = useMemo(() => files, [files]);

  return (
    <div className="bg-gray-900 text-white p-2 h-dvh overflow-y-auto">
      <button
        onClick={openDirectory}
        className="mb-2 w-full bg-gray-700 hover:bg-gray-600 py-1 rounded"
      >
        📁 Open Folder
      </button>

      {tree.length === 0 ? (
        <div className="text-gray-400 text-sm px-1">No folder open</div>
      ) : (
        <ul className="space-y-0.5">
          {tree.map((node) => (
            <TreeNode
              key={node.name}
              node={node}
              path={node.name}
              expanded={expanded}
              onToggle={toggle}
              onFileSelect={onFileSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

function TreeNode({
  node,
  path,
  expanded,
  onToggle,
  onFileSelect,
  depth = 0,
}: {
  node: FileNode;
  path: string;
  expanded: Record<string, boolean>;
  onToggle: (path: string) => void;
  onFileSelect: (file: FileNode) => void;
  depth?: number;
}) {
  const isDir = node.kind === "directory";
  const isOpen = expanded[path] ?? true; // default open for root-level

  const paddingLeft = 8 + depth * 12;

  return (
    <li>
      <div
        className={`flex items-center gap-2 px-1 rounded hover:bg-gray-800 cursor-pointer`}
        style={{ paddingLeft }}
        onClick={() => {
          if (isDir) onToggle(path);
          else onFileSelect(node);
        }}
      >
        {isDir ? (isOpen ? "📂" : "📁") : "📄"}
        <span className="truncate">{node.name}</span>
      </div>

      {isDir && isOpen && node.children && node.children.length > 0 && (
        <ul className="mt-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={`${path}/${child.name}`}
              node={child}
              path={`${path}/${child.name}`}
              expanded={expanded}
              onToggle={onToggle}
              onFileSelect={onFileSelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// Recursive directory reader (kept local to FileExplorer)
async function readDirectoryRecursively(
  dirHandle: FileSystemDirectoryHandle
): Promise<FileNode[]> {
  const entries: FileNode[] = [];
  for await (const [name, handle] of dirHandle.entries()) {
    if (handle.kind === "file") {
      entries.push({ name, kind: "file", handle });
    } else if (handle.kind === "directory") {
      entries.push({
        name,
        kind: "directory",
        handle,
        children: await readDirectoryRecursively(handle),
      });
    }
  }
  // sort folders first, then files
  entries.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return entries;
}

export default FileExplorer;
