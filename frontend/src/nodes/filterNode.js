// filterNode.js — Filters/transforms data based on a condition
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="Filter"
    icon="🔍"
    accentColor="#06b6d4"
    tag="FILTER"
    inputs={[{ id: 'data', label: 'data' }]}
    outputs={[
      { id: 'pass', label: 'pass' },
      { id: 'fail', label: 'fail' },
    ]}
    fields={[
      {
        name: 'field',
        label: 'Field Path',
        type: 'text',
        defaultValue: data?.field || '',
        placeholder: 'e.g. user.age',
      },
      {
        name: 'operator',
        label: 'Operator',
        type: 'select',
        defaultValue: data?.operator || 'equals',
        options: [
          { value: 'equals', label: '= equals' },
          { value: 'not_equals', label: '≠ not equals' },
          { value: 'greater', label: '> greater than' },
          { value: 'less', label: '< less than' },
          { value: 'contains', label: '⊃ contains' },
          { value: 'exists', label: '∃ exists' },
        ],
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        defaultValue: data?.value || '',
        placeholder: 'comparison value',
      },
    ]}
  />
);
