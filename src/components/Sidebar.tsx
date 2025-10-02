import { Menu, Home, User, Settings } from "lucide-react";

type SidebarProps = {
  open: boolean;
  onToggle?: () => void;
};

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <aside
      className={`flex-shrink-0 h-full bg-gray-900 border-r border-gray-800
                  overflow-hidden
                  transition-[width] duration-300 ease-in-out
                  ${open ? "w-64" : "fit-content"}`}
    >
      <div className="flex items-center justify-between h-14 px-3 border-b border-gray-800">
        {open && <span className="text-lg font-semibold">Bond</span>}
        <button onClick={onToggle} className="p-2 rounded hover:bg-gray-800" aria-label={open ? "Collapse sidebar" : "Expand sidebar"}>
          <Menu size={18} />
        </button>
      </div>

      <nav className="p-2 space-y-1">
        <NavItem icon={<Home size={20} />} label="Home" open={open} />
        <NavItem icon={<User size={20} />} label="Profile" open={open} />
        <NavItem icon={<Settings size={20} />} label="Settings" open={open} />
      </nav>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  open,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <button
      className={[
        "w-full h-10 rounded-md flex items-center transition-colors hover:bg-gray-800/80",
        "overflow-hidden",                         // clip while animating
        open ? "gap-2" : "gap-0",                 // no extra gap when closed
      ].join(" ")}
    >
      {/* ICON RAIL: fixed width, never shrinks */}
      <span
        className={[
          "w-10 h-full shrink-0 flex items-center transition-all justify-center", // fixed rail
        ].join(" ")}
      >
        <span className="grid place-items-center w-6 h-6">{icon}</span>
      </span>

      {/* LABEL: grows from 0 to full without moving the icon */}
      <span
        className={[
          "overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-in-out",
          open ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}

