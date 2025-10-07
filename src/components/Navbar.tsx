import { useSelector } from 'react-redux';
import type { RootState } from '../store/store'; // adjust path to your store
import { useState } from 'react';
import { ButtonSelector } from './ButtonSelector/ButtonSelector';

export default function Navbar() {
  const activeFlowTitle = useSelector((state: RootState) => {
    const present = state.flows.present;
    const activeId = present.activeFlowId;
    return activeId ? present.byId[activeId]?.title : null;
  });
  const [selected, setSelected] = useState("Flow");

  return (
    <header className="w-full h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 ">
      <h3 className="ml-3 text-lg">
        {activeFlowTitle || 'No Flow Selected'}
      </h3>
      <ButtonSelector
        options={["Flow", "Data", "Execution"]}
        color="green"
        value={selected}
        onChange={setSelected}
        size="sm"
      />
      <h3 className="ml-3 text-lg">
        {activeFlowTitle || 'No Flow Selected'}
      </h3>
    </header>
  );
}
