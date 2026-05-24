// draggableNode.js
export const DraggableNode = ({ type, label, icon = '⚙️', accentColor = '#3b82f6' }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({ nodeType: type })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      draggable
      onDragStart={onDragStart}
      style={{ '--accent': accentColor }}
      title={`Drag to add ${label} node`}
    >
      <span className="draggable-node-icon">{icon}</span>
      <span>{label}</span>
      <span className="draggable-node-accent" />
    </div>
  );
};
