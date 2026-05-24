// BaseNode.js — Universal node abstraction for VectorShift pipeline builder
// All node types extend this component via configuration props.

import { useState, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

/**
 * BaseNode — the single source of truth for all pipeline nodes.
 *
 * Props:
 *   id          {string}   ReactFlow node ID
 *   title       {string}   Display name shown in the header
 *   icon        {string}   Emoji or character icon
 *   accentColor {string}   CSS color for the top border + handle accent
 *   tag         {string}   Short monospace label shown in the header (e.g. "LLM")
 *   inputs      {Array}    [{id, label, style?}] — target handles on the left
 *   outputs     {Array}    [{id, label, style?}] — source handles on the right
 *   fields      {Array}    Form fields rendered in the node body:
 *                            { name, label, type, defaultValue, options, placeholder, rows }
 *                          type: 'text' | 'number' | 'select' | 'textarea' | 'autoresize'
 *   extraContent {ReactNode} Custom JSX rendered below the fields section
 *   minWidth    {number}   Minimum node width in px (default 230)
 *   onFieldChange {fn}    Optional callback(name, value) when a field changes
 */
export const BaseNode = ({
  id,
  title = 'Node',
  icon = '⚙️',
  accentColor = '#3b82f6',
  tag,
  inputs = [],
  outputs = [],
  fields = [],
  extraContent = null,
  minWidth = 230,
  onFieldChange,
}) => {
  // Initialise state for all declared fields
  const [fieldValues, setFieldValues] = useState(() => {
    const init = {};
    fields.forEach((f) => {
      init[f.name] = f.defaultValue ?? '';
    });
    return init;
  });

  // Delete this node (and its connected edges) from the canvas
  const { deleteElements } = useReactFlow();
  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      deleteElements({ nodes: [{ id }] });
    },
    [id, deleteElements]
  );

  const handleChange = useCallback(
    (name, value) => {
      setFieldValues((prev) => ({ ...prev, [name]: value }));
      onFieldChange?.(name, value);
    },
    [onFieldChange]
  );

  // Evenly distribute handles when no custom style is provided
  const resolveHandleStyle = (list, index) =>
    list[index].style || {
      top: `${((index + 1) / (list.length + 1)) * 100}%`,
    };

  return (
    <div
      className="base-node"
      style={{ '--accent': accentColor, minWidth }}
    >
      {/* ── Input handles (left) ─────────────────────────────── */}
      {inputs.map((inp, i) => (
        <Handle
          key={`in-${inp.id}`}
          type="target"
          position={Position.Left}
          id={`${id}-${inp.id}`}
          style={resolveHandleStyle(inputs, i)}
          className="node-handle"
          title={inp.label}
        />
      ))}

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="node-header" style={{ borderColor: accentColor + '22' }}>
        <span className="node-icon">{icon}</span>
        <span className="node-title">{title}</span>
        {tag && (
          <span className="node-tag" style={{ color: accentColor }}>
            {tag}
          </span>
        )}
        <button className="node-delete-btn" onClick={handleDelete} title="Delete node">
          ✕
        </button>
      </div>

      {/* ── Input connector labels ────────────────────────────── */}
      {inputs.some((inp) => inp.label) && (
        <div className="connector-labels connector-labels-left">
          {inputs.map((inp, i) => (
            <div
              key={`ilabel-${inp.id}`}
              className="connector-label"
              style={{
                top: resolveHandleStyle(inputs, i).top,
                left: 10,
                transform: 'translateY(-50%)',
              }}
            >
              {inp.label}
            </div>
          ))}
        </div>
      )}

      {/* ── Standard form fields ─────────────────────────────── */}
      {fields.length > 0 && (
        <div className="node-body">
          {fields.map((field) => (
            <FieldRenderer
              key={field.name}
              field={field}
              value={fieldValues[field.name]}
              onChange={(val) => handleChange(field.name, val)}
            />
          ))}
        </div>
      )}

      {/* ── Custom / extra content ────────────────────────────── */}
      {extraContent}

      {/* ── Output connector labels ───────────────────────────── */}
      {outputs.some((out) => out.label) && (
        <div className="connector-labels connector-labels-right">
          {outputs.map((out, i) => (
            <div
              key={`olabel-${out.id}`}
              className="connector-label connector-label-right"
              style={{
                top: resolveHandleStyle(outputs, i).top,
                right: 10,
                transform: 'translateY(-50%)',
              }}
            >
              {out.label}
            </div>
          ))}
        </div>
      )}

      {/* ── Output handles (right) ────────────────────────────── */}
      {outputs.map((out, i) => (
        <Handle
          key={`out-${out.id}`}
          type="source"
          position={Position.Right}
          id={`${id}-${out.id}`}
          style={resolveHandleStyle(outputs, i)}
          className="node-handle"
          title={out.label}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────
   FieldRenderer — renders the correct input widget for a field type
───────────────────────────────────────────────────────────────── */
const FieldRenderer = ({ field, value, onChange }) => (
  <div className="node-field">
    <label className="field-label">{field.label}</label>

    {field.type === 'select' ? (
      <select
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {field.options?.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    ) : field.type === 'textarea' ? (
      <textarea
        className="field-input field-textarea"
        rows={field.rows || 3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    ) : (
      <input
        className="field-input"
        type={field.type || 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    )}
  </div>
);
