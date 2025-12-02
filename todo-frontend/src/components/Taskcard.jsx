// TaskCard.jsx
import React from 'react';

const TaskCard = ({ task, toggleTask }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4 flex justify-between items-center">
      <div>
        <h2 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h2>
        {task.description && <p className="text-gray-500">{task.description}</p>}
        <p className="text-xs text-gray-400 mt-1">Created at: {new Date(task.created_at).toLocaleString()}</p>
      </div>
      <button
        onClick={() => toggleTask(task.id)}
        className={`px-3 py-1 rounded-md text-white ${task.completed ? 'bg-green-500' : 'bg-blue-500'}`}
      >
        {task.completed ? 'Completed' : 'Mark Done'}
      </button>
    </div>
  );
};

export default TaskCard;
