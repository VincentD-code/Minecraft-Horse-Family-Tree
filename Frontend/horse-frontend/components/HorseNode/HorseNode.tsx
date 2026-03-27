import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Horse } from '@/types/horse';
import { translateStatsForDisplay } from '@/utils/translateRawStats';

export type HorseNodeData = {
  horse: Horse;
  label?: string;
  activeView?: 'speed' | 'jump' | 'health' | 'base';
};

// 2. Define the specialized Node type for this component
export type HorseNode = Node<HorseNodeData, 'horseNode'>;

export default function CustomHorseNode({ data }: NodeProps<HorseNode>) {
  const { horse, activeView } = data;
  const {jump, health, speed, variant} = horse;
  const processedStats = translateStatsForDisplay({jump, health, speed, variant})

// Determine what label and value to show
  const getDisplayStat = () => {
    switch (activeView) {
      case 'jump':
        return { label: 'Jump', value: `${processedStats.jump?.toFixed(2)} [blocks]` };
      case 'health':
        return { label: 'Health', value: `${processedStats.health?.toFixed(2)} [HP]` };
      case 'speed':
      case 'base':
      default:
        return { label: 'Speed', value: `${processedStats.speed?.toFixed(2)} [b/s]` };
    }
  };

  const display = getDisplayStat();

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-400 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      
      <div className="flex flex-col items-center">
        <div className="text-sm font-bold text-gray-800 whitespace-nowrap">
          {horse.name}
        </div>
        <div className="text-[10px] text-gray-500 italic normal-case">
          {display.label}: {display.value}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
    </div>
  );
}