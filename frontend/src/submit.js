// submit.js — Part 4: backend integration with pipeline analysis modal
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (s) => ({ nodes: s.nodes, edges: s.edges });

// ── Result Modal ──────────────────────────────────────────
const ResultModal = ({ result, onClose }) => {
  const { num_nodes, num_edges, is_dag } = result;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon">📊</div>
          <div>
            <div className="modal-title">Pipeline Analysis</div>
            <div className="modal-subtitle">Submitted successfully</div>
          </div>
        </div>

        <div className="modal-stats">
          <div className="stat-card">
            <div className="stat-value">{num_nodes}</div>
            <div className="stat-label">Nodes</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{num_edges}</div>
            <div className="stat-label">Edges</div>
          </div>
        </div>

        <div className={`dag-badge ${is_dag ? 'valid' : 'invalid'}`}>
          <span className="dag-badge-icon">{is_dag ? '✅' : '⚠️'}</span>
          <div className="dag-badge-text">
            <div className="dag-badge-title">
              {is_dag ? 'Valid DAG' : 'Not a DAG'}
            </div>
            <div className="dag-badge-desc">
              {is_dag
                ? 'No cycles detected — this pipeline can be executed.'
                : 'Cycle detected — pipelines must be acyclic to execute.'}
            </div>
          </div>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// ── Submit Button ─────────────────────────────────────────
export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState(null);

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      setError('Add at least one node before submitting.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error ${response.status}: ${text}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to reach backend. Is it running?');
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-bar">
        <span className="node-count-badge">
          {nodes.length} node{nodes.length !== 1 ? 's' : ''} ·{' '}
          {edges.length} edge{edges.length !== 1 ? 's' : ''}
        </span>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          <span className="submit-btn-icon">{loading ? '⏳' : '🚀'}</span>
          {loading ? 'Analysing…' : 'Submit Pipeline'}
        </button>
      </div>

      {result && (
        <ResultModal result={result} onClose={() => setResult(null)} />
      )}

      {error && <div className="error-toast">⚠ {error}</div>}
    </>
  );
};
