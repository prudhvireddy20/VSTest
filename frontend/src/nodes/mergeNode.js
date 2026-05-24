// mergeNode.js — Merges / combines multiple data streams
import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="Merge"
    icon="⛙"
    accentColor="#e11d48"
    tag="MERGE"
    inputs={[
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b' },
      { id: 'c', label: 'c' },
    ]}
    outputs={[{ id: 'merged', label: 'merged' }]}
    fields={[
      {
        name: 'strategy',
        label: 'Merge Strategy',
        type: 'select',
        defaultValue: data?.strategy || 'concat',
        options: [
          { value: 'concat', label: 'Concatenate' },
          { value: 'deep_merge', label: 'Deep Merge (objects)' },
          { value: 'zip', label: 'Zip (arrays)' },
          { value: 'first_defined', label: 'First Defined' },
          { value: 'custom', label: 'Custom Template' },
        ],
      },
      {
        name: 'separator',
        label: 'Separator (concat)',
        type: 'text',
        defaultValue: data?.separator || ' ',
        placeholder: 'space, comma, newline…',
      },
    ]}
  />
);
