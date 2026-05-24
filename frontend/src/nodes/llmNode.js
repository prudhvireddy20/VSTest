// llmNode.js — Refactored using BaseNode abstraction
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="LLM"
    icon="🤖"
    accentColor="#8b5cf6"
    tag="AI"
    inputs={[
      { id: 'system', label: 'system' },
      { id: 'prompt', label: 'prompt' },
    ]}
    outputs={[{ id: 'response', label: 'response' }]}
    fields={[
      {
        name: 'model',
        label: 'Model',
        type: 'select',
        defaultValue: data?.model || 'gpt-4o',
        options: [
          { value: 'gpt-4o', label: 'GPT-4o' },
          { value: 'gpt-4o-mini', label: 'GPT-4o mini' },
          { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
          { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
          { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        ],
      },
      {
        name: 'temperature',
        label: 'Temperature',
        type: 'number',
        defaultValue: data?.temperature || '0.7',
        placeholder: '0.0 – 2.0',
      },
    ]}
  />
);
