// conditionalNode.js — Routes data along true or false branch
import { BaseNode } from './BaseNode';

export const ConditionalNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="Conditional"
    icon="🔀"
    accentColor="#a855f7"
    tag="IF"
    inputs={[{ id: 'input', label: 'input' }]}
    outputs={[
      { id: 'true', label: '✓ true' },
      { id: 'false', label: '✗ false' },
    ]}
    fields={[
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        defaultValue: data?.condition || '',
        placeholder: 'e.g. value > 10',
      },
      {
        name: 'mode',
        label: 'Evaluation Mode',
        type: 'select',
        defaultValue: data?.mode || 'expression',
        options: [
          { value: 'expression', label: 'JS Expression' },
          { value: 'truthy', label: 'Truthy Check' },
          { value: 'regex', label: 'Regex Match' },
          { value: 'json_path', label: 'JSONPath' },
        ],
      },
    ]}
  />
);
