import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './KanbanBoard.css';

const API_URL = 'http://localhost:5000/api/tasks';

const columns = [
  { id: 'todo', title: 'To Do', color: '#ebecf0' },
  { id: 'inprogress', title: 'In Progress', color: '#fff3cd' },
  { id: 'done', title: 'Done', color: '#d4edda' }
];

const KanbanBoard = ({ tasks, setTasks, onLogout }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [addingToColumn, setAddingToColumn] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const inputRef = useRef(null);
  const { user } = useAuth();

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status).sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    const updatedTasks = tasks.map(task => {
      if (task._id === draggedTask._id) {
        return { ...task, status: newStatus };
      }
      return task;
    });

    setTasks(updatedTasks);
    setDraggedTask(null);

    try {
      await axios.put(`${API_URL}/${draggedTask._id}/status`, {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      setTasks(tasks);
    }
  };

  const handleAddTask = async (status) => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(API_URL, {
        title: newTaskTitle,
        status: status,
        priority: newTaskPriority
      });
      
      setTasks([response.data.data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setAddingToColumn(null);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId) => {
    if (!editTitle.trim()) {
      setEditingTask(null);
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/${taskId}`, {
        title: editTitle,
        priority: editPriority
      });
      
      setTasks(tasks.map(t => t._id === taskId ? response.data.data : t));
      setEditingTask(null);
      setEditTitle('');
      setEditPriority('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') {
      callback();
    } else if (e.key === 'Escape') {
      setAddingToColumn(null);
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setEditTitle('');
      setEditPriority('');
    }
  };

  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <div className="header-left">
          <div className="logo">TM</div>
          <h1>Task Manager</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span>👤 {user?.name}</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="kanban-board">
        {columns.map(column => (
          <div
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header" style={{ backgroundColor: column.color }}>
              <h3>{column.title}</h3>
              <span className="task-count">{getTasksByStatus(column.id).length}</span>
            </div>

            <div className="column-content">
              {getTasksByStatus(column.id).map(task => (
                <div
                  key={task._id}
                  className="task-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                >
                  {editingTask === task._id ? (
                    <div className="task-edit">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateTask(task._id)}
                        onKeyDown={(e) => e.key === 'Escape' && setEditingTask(null)}
                        autoFocus
                        className="edit-input"
                      />
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="priority-select"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <div className="edit-actions">
                        <button onClick={() => handleUpdateTask(task._id)} className="save-btn">
                          Save
                        </button>
                        <button onClick={() => setEditingTask(null)} className="cancel-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="task-title" onClick={() => {
                        setEditingTask(task._id);
                        setEditTitle(task.title);
                        setEditPriority(task.priority);
                      }}>
                        {task.title}
                      </div>
                      <div className="task-meta">
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="delete-btn"
                        >
                          🗑️
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {addingToColumn === column.id ? (
                <div className="add-task-form">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                    onKeyDown={(e) => e.key === 'Escape' && setAddingToColumn(null)}
                    placeholder="Enter task title..."
                    className="add-input"
                    autoFocus
                  />
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="priority-select"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <div className="add-actions">
                    <button onClick={() => handleAddTask(column.id)} className="add-confirm">
                      Add
                    </button>
                    <button onClick={() => setAddingToColumn(null)} className="add-cancel">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingToColumn(column.id);
                    setTimeout(() => inputRef.current?.focus(), 100);
                  }}
                  className="add-task-btn"
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
