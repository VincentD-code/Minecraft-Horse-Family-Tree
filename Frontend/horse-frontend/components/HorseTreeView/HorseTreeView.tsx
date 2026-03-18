"use client";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  Background,
  NodeChange,
  NodeMouseHandler,
} from "@xyflow/react";
import { useState } from "react";
import "@xyflow/react/dist/style.css";
import { useRouter } from "next/navigation";
import CustomHorseNode, { HorseNode } from "../HorseNode/HorseNode";
import AddHorseButton from "../AddHorseButton/AddHorseButton";

const nodeTypes = {
  horseNode: CustomHorseNode,
};

interface HorseTreeViewProps {
  initialNodes: HorseNode[];
  initialEdges: Edge[];
}

export default function HorseTreeView({
  initialNodes,
  initialEdges,
}: HorseTreeViewProps) {
  const [nodes, setNodes] = useState<HorseNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const router = useRouter();

  const onNodesChange: OnNodesChange = (changes) =>
    setNodes((nds) =>
      applyNodeChanges<HorseNode>(changes as NodeChange<HorseNode>[], nds),
    );

  const onEdgesChange: OnEdgesChange = (changes) =>
    setEdges((eds) => applyEdgeChanges(changes, eds));

  const onNodeClick = (_event: React.MouseEvent, node: HorseNode) => {
    router.push(`/horses/${node.data.horse.id}`);
  };

  return (
    <div className="w-full h-full">
      <AddHorseButton />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        {/* <Background/> */}
      </ReactFlow>
    </div>
  );
}
