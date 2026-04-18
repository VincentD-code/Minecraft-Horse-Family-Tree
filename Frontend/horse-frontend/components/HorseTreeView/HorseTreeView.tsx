"use client";
import {
  ReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  Edge,
  OnNodesChange,
  OnEdgesChange,
} from "@xyflow/react";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { getBaseLayout, getSortLayout } from "@/utils/layout";
import "@xyflow/react/dist/style.css";
import CustomHorseNode, { HorseNode } from "../HorseNode/HorseNode";
import * as styles from "./HorseTreeView.css";
import Button from "../Button/Button";
import HorseCreateModal from "../Modals/HorseCreateModal/HorseCreateModal";
import { Horse } from "@/types/horse";
import ViewMenu from "./ViewMenu/ViewMenu";

const nodeTypes = { horseNode: CustomHorseNode };
export type ViewMode = "base" | "speed" | "jump" | "health";

interface HorseTreeViewProps {
  initialNodes: HorseNode[];
  initialEdges: Edge[];
  horses: Horse[];
}

function TreeContent({
  initialNodes,
  initialEdges,
  horses,
}: HorseTreeViewProps) {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [view, setView] = useState<ViewMode>(() => {
    const savedView = getCookie("horse-tree-view") as ViewMode;
    return savedView || "base";
  });

  const [statusView, setStatusView] = useState<boolean>(() => {
    const saved = getCookie("horse-status-view");
    return saved === "true";
  });

  const [nodes, setNodes] = useState<HorseNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  useEffect(() => {
    const layoutNodes =
      view === "base"
        ? getBaseLayout(initialNodes, initialEdges)
        : getSortLayout(initialNodes, view);

    // Update nodes with statusView data
    const newNodes = layoutNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        activeView: view,
        statusView: statusView
      }
    }));

    setNodes(newNodes);
    setEdges(initialEdges);
  }, [view, statusView, initialNodes, initialEdges]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => applyNodeChanges(changes, nds) as HorseNode[]),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  return (
    <div className={styles.container}>
      <ViewMenu 
        setView={setView} 
        view={view} 
        statusView={statusView} 
        setStatusView={setStatusView} 
      />

      <Button onClick={() => setCreateModalOpen(true)} text="Add Horse" className={styles.addHorseButton} />
      <HorseCreateModal
        isOpen={createModalOpen}
        setIsOpen={setCreateModalOpen}
        horses={horses}
      />

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

export default function HorseTreeView(props: HorseTreeViewProps) {
  return (
    <ReactFlowProvider>
      <Suspense
        fallback={
          <div className={styles.loadingFallback}>Loading lineage...</div>
        }
      >
        <TreeContent {...props} />
      </Suspense>
    </ReactFlowProvider>
  );
}
