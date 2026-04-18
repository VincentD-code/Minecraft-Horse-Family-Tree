import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Horse } from '@/types/horse';
import { translateStatsForDisplay } from '@/utils/translateRawStats';
import * as styles from './HorseNode.css';
import { CSSProperties } from 'react';

export type HorseNodeData = {
  horse: Horse;
  label?: string;
  activeView?: 'speed' | 'jump' | 'health' | 'base';
  statusView?: boolean;
};

// 2. Define the specialized Node type for this component
export type HorseNode = Node<HorseNodeData, 'horseNode'>;

function getContrastColor(hex: string): string {
  if (!hex || hex.length < 7) return '#ffffff';
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

function darkenColor(hex: string, amount: number): string {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = Math.max(0, Math.floor(parseInt(hex.substring(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(parseInt(hex.substring(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.floor(parseInt(hex.substring(4, 6), 16) * (1 - amount)));
  
  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function CustomHorseNode({ data }: NodeProps<HorseNode>) {
  const { horse, activeView, statusView } = data;
  const {jump, health, speed, variant} = horse;
  const processedStats = translateStatsForDisplay({jump, health, speed, variant})
  const dnaColor = horse.hexColor || '#444444';
  
  const isDead = horse.status === 0;
  const useShade = statusView && isDead;

  // Calculate a darker version of the dnaColor for the background when dead
  const backgroundColor = useShade ? darkenColor(dnaColor, 0.7) : dnaColor;
  const textColor = getContrastColor(backgroundColor);

  const containerStyle: CSSProperties = {
    backgroundColor: backgroundColor,
    borderColor: dnaColor,
    borderStyle: 'solid',
    borderWidth: '2px',
  };

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
    <div className={styles.nodeContainer} style={containerStyle}>
      <Handle 
        type="target" 
        position={Position.Top} 
        className={styles.handleStyle} 
      />
      
      <div className={styles.contentWrapper}>
        {/* 3. Contrast applied directly to text elements */}
        <div className={styles.horseName} style={{ color: textColor }}>
          {horse.name}
        </div>
        <div className={styles.statText} style={{ color: textColor }}>
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