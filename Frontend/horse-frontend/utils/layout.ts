import dagre from 'dagre';
import { Edge } from '@xyflow/react';
import { HorseNode } from '@/components/HorseNode/HorseNode';

const VERTICAL_SPACING = 200;

export const getBaseLayout = (nodes: HorseNode[], edges: Edge[], compactView: boolean = false) => {
  const dagreGraph = new dagre.graphlib.Graph();
  
  const horizontalGap = compactView ? 20 : 40;
  const nodeWidth = compactView ? 160 : 220;
  const nodeHeight = 80;

  dagreGraph.setGraph({ 
    rankdir: 'TB', 
    nodesep: horizontalGap, 
    ranksep: VERTICAL_SPACING,
    ranker: 'network-simplex', 
  });
  
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  const genMap = new Map(nodes.map(n => [n.id, n.data.horse.generation || 0]));

  edges.forEach((edge) => {
    if (dagreGraph.hasNode(edge.source) && dagreGraph.hasNode(edge.target)) {
      const sourceGen = genMap.get(edge.source) || 0;
      const targetGen = genMap.get(edge.target) || 0;
      const generationDiff = Math.max(1, targetGen - sourceGen);
      dagreGraph.setEdge(edge.source, edge.target, { minlen: generationDiff });
    }
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    const gen = node.data.horse.generation || 0;
    
    return {
      ...node,
      data: { ...node.data, activeView: 'base' as const },
      position: {
        x: dagreNode.x - (nodeWidth / 2),
        y: gen * VERTICAL_SPACING, 
      },
    };
  });
};

export const getSortLayout = (nodes: HorseNode[], sortBy: 'speed' | 'jump' | 'health', compactView: boolean = false) => {
  const horizontalGap = compactView ? 30 : 50;
  const nodeWidth = compactView ? 140 : 200;

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
      return valB - valA; 
    });
  });

  return nodes.map((node) => {
    const gen = node.data.horse.generation ?? 0;
    const row = generations[gen];
    const indexInRow = row.findIndex((n) => n.id === node.id);
    const rowWidth = (row.length * (nodeWidth + horizontalGap));
    const centeringOffset = -rowWidth / 2;

    return {
      ...node,
      position: {
        x: centeringOffset + (indexInRow * (nodeWidth + horizontalGap)),
        y: gen * VERTICAL_SPACING,
      },
      data: { ...node.data, activeView: sortBy }
    };
  });
};