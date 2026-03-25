import React from 'react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in progress':
        return 'status-progress';
      default:
        return 'status-pending';
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-card ${getStatusClass(task.status)}`}>
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`status-badge ${getStatusClass(task.status)}`}>
          {task.status}
        </span>
        <span className="task-date">
          Created: {formatDate(task.createdAt)}
        </span>
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          onClick={() => onEdit(task)}
          className="btn btn-edit"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="btn btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
