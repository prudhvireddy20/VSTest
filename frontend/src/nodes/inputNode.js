// inputNode.js — Refactored using BaseNode abstraction
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="Input"
    icon="📥"
    accentColor="#10b981"
    tag="IN"
    inputs={[]}
    outputs={[{ id: 'value', label: 'value' }]}
    fields={[
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        defaultValue: data?.inputName || id.replace('customInput-', 'input_'),
        placeholder: 'input_name',
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: data?.inputType || 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
          { value: 'Number', label: 'Number' },
          { value: 'Boolean', label: 'Boolean' },
        ],
      },
    ]}
  />
);
