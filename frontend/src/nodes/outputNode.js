// outputNode.js — Refactored using BaseNode abstraction
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="Output"
    icon="📤"
    accentColor="#f59e0b"
    tag="OUT"
    inputs={[{ id: 'value', label: 'value' }]}
    outputs={[]}
    fields={[
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        defaultValue: data?.outputName || id.replace('customOutput-', 'output_'),
        placeholder: 'output_name',
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: data?.outputType || 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
          { value: 'File', label: 'File' },
          { value: 'JSON', label: 'JSON' },
        ],
      },
    ]}
  />
);
