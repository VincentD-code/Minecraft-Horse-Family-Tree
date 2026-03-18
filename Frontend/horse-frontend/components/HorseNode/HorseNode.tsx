import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Horse } from '@/types/horse';

export type HorseNodeData = {
  horse: Horse;
  label?: string;
};

// 2. Define the specialized Node type for this component
export type HorseNode = Node<HorseNodeData, 'horseNode'>;

export default function CustomHorseNode({ data }: NodeProps<HorseNode>) {
  const { horse } = data;

  const borderColor = 'border-gray-400';

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${borderColor} min-w-[150px]`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      
      <div className="flex flex-col items-center">
        <div className="text-sm font-bold text-gray-800">{horse.name}</div>
        <div className="text-[10px] text-gray-500 italic">
            speed: {horse.speed_raw}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
    </div>
  );
}