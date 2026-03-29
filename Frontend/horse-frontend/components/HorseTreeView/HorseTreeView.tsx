"use client";
import {
  ReactFlow,
  useReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  NodeChange,
} from "@xyflow/react";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";import { getBaseLayout, getSortLayout } from "@/utils/layout";
import "@xyflow/react/dist/style.css";
import CustomHorseNode, { HorseNode } from "../HorseNode/HorseNode";
import * as styles from "./HorseTreeView.css";
import Button from "../Button/Button";

const nodeTypes = { horseNode: CustomHorseNode };
type ViewMode = 'base' | 'speed' | 'jump' | 'health';

interface HorseTreeViewProps {
  initialNodes: HorseNode[];
  initialEdges: Edge[];
}

function TreeContent({ initialNodes, initialEdges }: HorseTreeViewProps) {
  const router = useRouter();
  const { fitView } = useReactFlow();

 // 1. Initialize state from Cookie (falling back to 'base')
  const [view, setView] = useState<ViewMode>(() => {
    const savedView = getCookie("horse-tree-view") as ViewMode;
    return savedView || "base";
  });

  const [nodes, setNodes] = useState<HorseNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // 2. Update layout when the view state changes
  useEffect(() => {
    const newNodes = view === 'base' 
      ? getBaseLayout(initialNodes, initialEdges) 
      : getSortLayout(initialNodes, view);
    
    setNodes(newNodes);
    setEdges(initialEdges);
  }, [view, initialNodes, initialEdges]);

  // 3. Update state AND cookie when toggling
  const toggleView = (mode: ViewMode) => {
    setView(mode);
    setCookie("horse-tree-view", mode, { maxAge: 60 * 60 * 24 * 30 }); // Save for 30 days
    
    // Smooth transition
    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds) as HorseNode[]),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

return (
    <div className={styles.container}>
      {/* Floating Menu */}
      <div className={styles.menuWrapper}>
        <p className={styles.menuLabel}>Layout Mode</p>
        
        <button 
          onClick={() => toggleView('base')}
          className={view === 'base' ? styles.baseButtonActive : styles.baseButtonInactive}
        >
          Traditional Lineage Tree
        </button>

        <p className={styles.menuLabel} style={{ marginTop: '8px' }}>Rank by Stat (Left to Right)</p>
        <div className={styles.statGrid}>
          {(['speed', 'jump', 'health'] as const).map((stat) => (
            <button
              key={stat}
              onClick={() => toggleView(stat)}
              className={view === stat ? styles.statButtonActive : styles.statButtonInactive}
            >
              {stat}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => fitView({ duration: 800, padding: 0.2 })}
          className={styles.resetButton}
        >
          🔍 Reset Zoom
        </button>
      </div>

      <Button onClick={()=>{router.push(`/horses/create`)}} text="Add Horse" />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_event, node) => router.push(`/horses/${node.id}`)}
        fitView
        minZoom={0.1}
        maxZoom={2.0}
      />
    </div>
  );
}

// 4. Wrap with Suspense to prevent build errors with searchParams
export default function HorseTreeView(props: HorseTreeViewProps) {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<div className={styles.loadingFallback}>Loading lineage...</div>}>
        <TreeContent {...props} />
      </Suspense>
    </ReactFlowProvider>
  );
}
