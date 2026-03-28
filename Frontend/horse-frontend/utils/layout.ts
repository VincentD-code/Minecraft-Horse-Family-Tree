import dagre from 'dagre';
import { Edge } from '@xyflow/react';
import { HorseNode } from '@/components/HorseNode/HorseNode';

const VISUAL_WIDTH = 150;
const VERTICAL_SPACING = 200;
const HORIZONTAL_GAP = 20;

export const getBaseLayout = (nodes: HorseNode[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  
  dagreGraph.setGraph({ 
    rankdir: 'TB', 
    nodesep: HORIZONTAL_GAP, 
    ranksep: VERTICAL_SPACING,
    ranker: 'network-simplex', // Best ranker for strict vertical leveling
  });
  
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Create a quick lookup map for generations
  const genMap = new Map(nodes.map(n => [n.id, n.data.horse.generation || 0]));

  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: 200, height: 70 }));

  // Apply the minlen magic to the edges
  edges.forEach((edge) => {
    const sourceGen = genMap.get(edge.source) || 0;
    const targetGen = genMap.get(edge.target) || 0;

    // Calculate how many generations this edge skips
    // Math.max(1, ...) ensures we never pass 0 or a negative number, which would crash dagre
    const generationDiff = Math.max(1, targetGen - sourceGen);

    dagreGraph.setEdge(edge.source, edge.target, { minlen: generationDiff });
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    const gen = node.data.horse.generation || 0;
    
    return {
      ...node,
      data: { ...node.data, activeView: 'base' as const },
      position: {
        x: dagreNode.x - (VISUAL_WIDTH / 2),
        // Because X is now perfectly optimized for the generation gaps, 
        // we can safely snap Y to your strict grid without tangling the lines!
        y: gen * VERTICAL_SPACING, 
      },
    };
  });
};

export const getSortLayout = (nodes: HorseNode[], sortBy: 'speed' | 'jump' | 'health') => {
  const generations: Record<number, HorseNode[]> = {};
  
  nodes.forEach((node) => {
    const gen = node.data.horse.generation ?? 0;
    if (!generations[gen]) generations[gen] = [];
    generations[gen].push(node);
  });

  Object.keys(generations).forEach((key) => {
    generations[Number(key)].sort((a, b) => {
      const valA = a.data.horse[sortBy] || 0;
      const valB = b.data.horse[sortBy] || 0;
      return valB - valA; // Highest to Lowest (Left to Right)
    });
  });

  return nodes.map((node) => {
    const gen = node.data.horse.generation ?? 0;
    const row = generations[gen];
    const indexInRow = row.findIndex((n) => n.id === node.id);
    const rowWidth = (row.length * (VISUAL_WIDTH + HORIZONTAL_GAP));
    const centeringOffset = -rowWidth / 2;

    return {
      ...node,
      position: {
        x: centeringOffset + (indexInRow * (VISUAL_WIDTH + HORIZONTAL_GAP)),
        y: gen * VERTICAL_SPACING,
      },
      data: { ...node.data, activeView: sortBy }
    };
  });
};