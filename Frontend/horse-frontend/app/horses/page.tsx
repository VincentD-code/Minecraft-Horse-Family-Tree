import { getAllHorses } from '@/lib/horses';
import HorseTreeView from '@/components/HorseTreeView';
import { getLayoutedElements } from '@/lib/layout';
import { Horse } from '@/types/horse';
import { HorseNode } from '@/components/HorseNode';
import { Edge } from '@xyflow/react';

export default async function HomePage() {
  const horses: Horse[] = await getAllHorses();
  // console.log(horses)
  
  const initialNodes: HorseNode[] = horses.map((h) => ({
  id: h.id,
  type: 'horseNode',
  data: { 
    horse: h,
    label: h.name 
  },
  position: { x: 0, y: 0 },
}));

  const initialEdges: Edge[] = horses.flatMap((h) => {
  const connections: Edge[] = [];
  
  if (h.sireName) {
    connections.push({
      id: `e-${h.sireName}-${h.id}`,
      source: h.sireId,
      target: h.id,
      animated: true,
    });
  }
  
  if (h.damName) {
    connections.push({
      id: `e-${h.damName}-${h.id}`,
      source: h.damId,
      target: h.id,
    });
  }
  
  return connections;
});

  const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);

  const dataKey = `tree-${horses.length}`;

  return (
    <main className="h-screen w-full">
      <HorseTreeView initialNodes={nodes} initialEdges={edges} key={dataKey}/>
    </main>
  );
}