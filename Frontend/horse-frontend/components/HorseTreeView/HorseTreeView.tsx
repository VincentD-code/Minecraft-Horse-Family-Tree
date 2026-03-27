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
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getBaseLayout, getSortLayout } from "@/lib/layout";
import "@xyflow/react/dist/style.css";
import CustomHorseNode, { HorseNode } from "../HorseNode/HorseNode";
import AddHorseButton from "../AddHorseButton/AddHorseButton";

const nodeTypes = {
  horseNode: CustomHorseNode,
};

type ViewMode = 'base' | 'speed' | 'jump' | 'health';

interface HorseTreeViewProps {
  initialNodes: HorseNode[];
  initialEdges: Edge[];
}

function TreeContent({ initialNodes, initialEdges }: HorseTreeViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { fitView } = useReactFlow();

  // 1. Source the ViewMode from the URL, defaulting to 'base'
  const view = (searchParams.get("view") as ViewMode) || "base";

  const [nodes, setNodes] = useState<HorseNode[]>(() => {
    // Initial load logic matching the URL state
    if (view === 'base') return getBaseLayout(initialNodes, initialEdges);
    return getSortLayout(initialNodes, view as 'speed' | 'jump' | 'health');
  });
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // 2. Sync layout whenever the view (from URL) or initial data changes
  useEffect(() => {
    let newNodes: HorseNode[];
    if (view === 'base') {
      newNodes = getBaseLayout(initialNodes, initialEdges);
    } else {
      newNodes = getSortLayout(initialNodes, view as 'speed' | 'jump' | 'health');
    }
    setNodes(newNodes);
    setEdges(initialEdges);
  }, [view, initialNodes, initialEdges]);

  // 3. Instead of local state, we push the new mode to the URL
  const toggleView = (mode: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", mode);
    router.push(`${pathname}?${params.toString()}`);
    
    setTimeout(() => fitView({ duration: 800 }), 100);
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
    <div className="w-full h-full relative">
      {/* Floating Menu */}
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-white p-3 rounded-lg shadow-xl border border-gray-200 w-64">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Layout Mode</p>
        
        {/* Main Toggles */}
        <button 
          onClick={() => toggleView('base')}
          className={`w-full py-2 rounded-md text-xs font-bold transition-all mb-1 ${
            view === 'base' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Traditional Lineage Tree
        </button>

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Rank by Stat (Left to Right)</p>
        <div className="grid grid-cols-3 gap-1">
          {(['speed', 'jump', 'health'] as const).map((stat) => (
            <button
              key={stat}
              onClick={() => toggleView(stat)}
              className={`py-2 rounded text-[10px] font-bold capitalize transition-all ${
                view === stat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => fitView({ duration: 800, padding: 0.2 })}
          className="mt-4 w-full px-3 py-2 bg-gray-800 text-white text-xs font-bold rounded-md hover:bg-black flex items-center justify-center gap-2"
        >
          🔍 Reset Zoom
        </button>
      </div>

      <AddHorseButton />
      
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
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400 font-medium">Loading lineage...</div>}>
        <TreeContent {...props} />
      </Suspense>
    </ReactFlowProvider>
  );
}
