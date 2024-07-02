import React from 'react';

const TaskItem = ({ name, description, onEdit, onDelete, id }) => {
  return (
    <div className="task-item">
      <h2>{name}</h2>
      <p>{description}</p>
      <div className="task-item-actions">
        <button onClick={() => onEdit(id)}>Modifier</button>
        <button onClick={() => onDelete(id)}>Supprimer</button>
      </div>
    </div>
  );
};

// TaskItem.defaultProps = {
//   name: '',
//   description: '',
// };

export default TaskItem;

