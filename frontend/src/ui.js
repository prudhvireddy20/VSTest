// ui.js — Pipeline canvas
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode }       from './nodes/inputNode';
import { LLMNode }         from './nodes/llmNode';
import { OutputNode }      from './nodes/outputNode';
import { TextNode }        from './nodes/textNode';
import { FilterNode }      from './nodes/filterNode';
import { ApiNode }         from './nodes/apiNode';
import { MathNode }        from './nodes/mathNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { MergeNode }       from './nodes/mergeNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  filter:       FilterNode,
  api:          ApiNode,
  math:         MathNode,
  conditional:  ConditionalNode,
  merge:        MergeNode,
};

const selector = (s) => ({
  nodes:         s.nodes,
  edges:         s.edges,
  getNodeID:     s.getNodeID,
  addNode:       s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect:     s.onConnect,
});

export const PipelineUI = () => {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      const bounds = wrapperRef.current?.getBoundingClientRect();
      const raw = e.dataTransfer.getData('application/reactflow');
      if (!raw || !bounds) return;

      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;

      const position = rfInstance.project({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });

      const id = getNodeID(type);
      addNode({ id, type, position, data: { id, nodeType: type } });
    },
    [rfInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        defaultViewport={{ x: 80, y: 80, zoom: 1 }}
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1}
          color="#1e2a3a"
        />
        <Controls />
        <MiniMap
          nodeColor={() => '#1e2a3a'}
          maskColor="rgba(7,9,15,0.7)"
        />
      </ReactFlow>
    </div>
  );
};
