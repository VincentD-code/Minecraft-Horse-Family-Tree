import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Horse } from '@/types/horse';
import { translateStatsForDisplay } from '@/utils/translateRawStats';
import * as styles from './HorseNode.css';

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
    <div className={styles.nodeContainer}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handleStyle} 
      />
      
      <div className={styles.contentWrapper}>
        <div className={styles.horseName}>
          {horse.name}
        </div>
        <div className={styles.statText}>
          {display.label}: {display.value}
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={styles.handleStyle} 
      />
    </div>
  );
}