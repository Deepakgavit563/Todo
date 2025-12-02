// TaskList.jsx
import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token'); // assuming JWT auth
    const res = await axios.get('http://localhost:8000/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(res.data);
  };

  const toggleTask = async (id) => {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:8000/tasks/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks(); // refresh the list
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} toggleTask={toggleTask} />
      ))}
    </div>
  );
};

export default TaskList;
