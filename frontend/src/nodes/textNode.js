// textNode.js — Part 3: auto-resize textarea + dynamic variable handles
import { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

// Matches valid JS identifiers wrapped in {{ }}
const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

// Minimum width (px) and padding for width calculation
const MIN_WIDTH = 230;
const MAX_WIDTH = 500;
const CHAR_WIDTH = 8; // approximate px per character

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeWidth, setNodeWidth] = useState(MIN_WIDTH);
  const textareaRef = useRef(null);

  // Parse variables and resize whenever text changes
  useEffect(() => {
    // 1. Extract unique variable names
    const matches = [...text.matchAll(VARIABLE_REGEX)];
    const unique = [...new Set(matches.map((m) => m[1]))];
    setVariables(unique);

    // 2. Auto-resize height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }

    // 3. Auto-resize width based on longest line
    const lines = text.split('\n');
    const longestLine = Math.max(...lines.map((l) => l.length), 0);
    const computed = Math.min(
      Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH + 60),
      MAX_WIDTH
    );
    setNodeWidth(computed);
  }, [text]);

  const handleChange = useCallback((e) => setText(e.target.value), []);

  const { deleteElements } = useReactFlow();
  const handleDelete = useCallback(
    (e) => { e.stopPropagation(); deleteElements({ nodes: [{ id }] }); },
    [id, deleteElements]
  );

  return (
    <div
      className="base-node"
      style={{
        '--accent': '#ec4899',
        minWidth: nodeWidth,
        width: nodeWidth,
        transition: 'width 0.15s ease',
      }}
    >
      {/* Dynamic input handles — one per {{variable}} */}
      {variables.map((v, i) => (
        <Handle
          key={`var-${v}`}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{ top: `${((i + 1) / (variables.length + 1)) * 100}%` }}
          className="node-handle"
          title={v}
        />
      ))}

      {/* Variable labels pinned to left */}
      {variables.map((v, i) => (
        <div
          key={`vlabel-${v}`}
          className="connector-label"
          style={{
            top: `${((i + 1) / (variables.length + 1)) * 100}%`,
            left: 10,
            transform: 'translateY(-50%)',
          }}
        >
          {v}
        </div>
      ))}

      {/* Header */}
      <div
        className="node-header"
        style={{ borderColor: '#ec489922' }}
      >
        <span className="node-icon">📝</span>
        <span className="node-title">Text</span>
        <span className="node-tag" style={{ color: '#ec4899' }}>TEXT</span>
        <button className="node-delete-btn" onClick={handleDelete} title="Delete node">✕</button>
      </div>

      {/* Body */}
      <div className="node-body">
        <div className="node-field">
          <label className="field-label">Content</label>
          <textarea
            ref={textareaRef}
            className="field-input field-textarea text-node-textarea"
            value={text}
            onChange={handleChange}
            placeholder='Type text… use {{variable}} to add inputs'
          />
        </div>

        {/* Variable chips */}
        {variables.length > 0 && (
          <div className="variable-chips">
            {variables.map((v) => (
              <span key={v} className="variable-chip">
                {'{{'}
                {v}
                {'}}'}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ top: '50%' }}
        className="node-handle"
        title="output"
      />
    </div>
  );
};
