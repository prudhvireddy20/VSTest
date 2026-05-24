// mathNode.js — Performs a math operation on two inputs
import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="Math"
    icon="🔢"
    accentColor="#14b8a6"
    tag="MATH"
    inputs={[
      { id: 'a', label: 'a' },
      { id: 'b', label: 'b' },
    ]}
    outputs={[{ id: 'result', label: 'result' }]}
    fields={[
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: data?.operation || 'add',
        options: [
          { value: 'add', label: '+ Add' },
          { value: 'subtract', label: '− Subtract' },
          { value: 'multiply', label: '× Multiply' },
          { value: 'divide', label: '÷ Divide' },
          { value: 'modulo', label: '% Modulo' },
          { value: 'power', label: '^ Power' },
          { value: 'min', label: 'min(a,b)' },
          { value: 'max', label: 'max(a,b)' },
        ],
      },
      {
        name: 'precision',
        label: 'Decimal Places',
        type: 'number',
        defaultValue: data?.precision || '2',
        placeholder: '2',
      },
    ]}
  />
);
