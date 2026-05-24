// apiNode.js — Makes an HTTP API call
import { BaseNode } from './BaseNode';

export const ApiNode = ({ id, data }) => (
  <BaseNode
    id={id}
    title="API Call"
    icon="🌐"
    accentColor="#f97316"
    tag="HTTP"
    inputs={[
      { id: 'body', label: 'body' },
      { id: 'headers', label: 'headers' },
    ]}
    outputs={[
      { id: 'response', label: 'response' },
      { id: 'error', label: 'error' },
    ]}
    fields={[
      {
        name: 'url',
        label: 'URL',
        type: 'text',
        defaultValue: data?.url || '',
        placeholder: 'https://api.example.com/endpoint',
      },
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: data?.method || 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'PATCH', label: 'PATCH' },
          { value: 'DELETE', label: 'DELETE' },
        ],
      },
      {
        name: 'auth',
        label: 'Auth Type',
        type: 'select',
        defaultValue: data?.auth || 'none',
        options: [
          { value: 'none', label: 'None' },
          { value: 'bearer', label: 'Bearer Token' },
          { value: 'api_key', label: 'API Key' },
          { value: 'basic', label: 'Basic Auth' },
        ],
      },
    ]}
  />
);
