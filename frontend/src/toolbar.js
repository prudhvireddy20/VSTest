// toolbar.js — Node palette with all node types
import { DraggableNode } from './draggableNode';

const NODE_PALETTE = [
  // Core
  { type: 'customInput',  label: 'Input',       icon: '📥', accent: '#10b981' },
  { type: 'customOutput', label: 'Output',      icon: '📤', accent: '#f59e0b' },
  { type: 'llm',          label: 'LLM',         icon: '🤖', accent: '#8b5cf6' },
  { type: 'text',         label: 'Text',        icon: '📝', accent: '#ec4899' },
  // New nodes
  { type: 'filter',       label: 'Filter',      icon: '🔍', accent: '#06b6d4' },
  { type: 'api',          label: 'API Call',    icon: '🌐', accent: '#f97316' },
  { type: 'math',         label: 'Math',        icon: '🔢', accent: '#14b8a6' },
  { type: 'conditional',  label: 'Conditional', icon: '🔀', accent: '#a855f7' },
  { type: 'merge',        label: 'Merge',       icon: '⛙',  accent: '#e11d48' },
];

export const PipelineToolbar = () => (
  <div className="toolbar">
    <div className="toolbar-brand">
      Vector<em>Shift</em>
    </div>
    <div className="toolbar-divider" />
    <span className="toolbar-section-label">Nodes</span>
    <div className="toolbar-nodes">
      {NODE_PALETTE.map((n) => (
        <DraggableNode
          key={n.type}
          type={n.type}
          label={n.label}
          icon={n.icon}
          accentColor={n.accent}
        />
      ))}
    </div>
  </div>
);
