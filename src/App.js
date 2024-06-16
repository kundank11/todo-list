import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null); // State to track the ID of the task being edited
  const [editedTaskText, setEditedTaskText] = useState(''); // State to hold the edited task text
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('none');

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (taskInput.trim() === '') return;
    const newTask = { id: uuidv4(), text: taskInput, completed: false };
    setTasks([...tasks, newTask]);
    setTaskInput('');
  };

  const handleRemoveTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    if (editingTaskId === id) {
      // Clear the editing state if the task being edited is removed
      setEditingTaskId(null);
      setEditedTaskText('');
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleEditTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (!taskToEdit) return;
    setEditingTaskId(id);
    setEditedTaskText(taskToEdit.text);
  };

  const handleSaveTask = () => {
    if (editedTaskText.trim() === '') return;
    setTasks(tasks.map(task => 
      task.id === editingTaskId ? { ...task, text: editedTaskText } : task
    ));
    setEditingTaskId(null);
    setEditedTaskText('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditedTaskText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editingTaskId !== null) {
        handleSaveTask();
      } else {
        handleAddTask();
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sort === 'asc') return a.text.localeCompare(b.text);
    if (sort === 'desc') return b.text.localeCompare(a.text);
    return 0;
  });

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new task"
      />
      <div>
        <button className="filter" onClick={() => setFilter('all')}>All</button>
        <button className="filter" onClick={() => setFilter('completed')}>Completed</button>
        <button className="filter" onClick={() => setFilter('incomplete')}>Incomplete</button>
        <button className="sort" onClick={() => setSort('none')}>No Sort</button>
        <button className="sort" onClick={() => setSort('asc')}>Sort Asc</button>
        <button className="sort" onClick={() => setSort('desc')}>Sort Desc</button>
      </div>
      <ul>
        {sortedTasks.map(task => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editedTaskText}
                onChange={(e) => setEditedTaskText(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            ) : (
              <span
                className={task.completed ? 'completed' : ''}
                onClick={() => handleToggleComplete(task.id)}
              >
                {task.text}
              </span>
            )}
            <div>
              {editingTaskId === task.id ? (
                <>
                  <button className="save-task" onClick={handleSaveTask}>Save</button>
                  <button className="cancel-edit" onClick={handleCancelEdit}>Cancel</button>
                </>
              ) : (
                <>
                  <button className="edit-task" onClick={() => handleEditTask(task.id)}>Edit</button>
                  <button className="remove-task" onClick={() => handleRemoveTask(task.id)}>Remove</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
