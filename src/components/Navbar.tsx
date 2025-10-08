import { useSelector } from 'react-redux';
import type { RootState } from '../store/store'; // adjust path to your store
import { useState } from 'react';
import { ButtonSelector } from './ButtonSelector/ButtonSelector';
import { Zap } from 'lucide-react';

export default function Navbar() {
  const activeFlowTitle = useSelector((state: RootState) => {
    const present = state.flows.present;
    const activeId = present.activeFlowId;
    return activeId ? present.byId[activeId]?.title : null;
  });
  const [selected, setSelected] = useState("Flow");

  return (
    <header className="w-full h-12 bg-gray-900 border-b border-gray-800 grid grid-cols-3 items-center px-4">
      {/* Left */}
      <div className="flex items-center">
        <h3 className="ml-3 text-lg truncate">
          {activeFlowTitle || "No Flow Selected"}
        </h3>
      </div>

      {/* Center */}
      <div className="flex justify-center">
        <ButtonSelector
          options={["Flow", "Data", "Execution"]}
          color="green"
          value={selected}
          onChange={setSelected}
          size="sm"
        />
      </div>

      {/* Right */}
      <div className="flex justify-end">
        <button
          onClick={() => { }}
          className="flex items-center justify-center text-white hover:text-gray-500 rounded-full"
        >
          <Zap size={20} />
        </button>
      </div>
    </header>
  );
}
