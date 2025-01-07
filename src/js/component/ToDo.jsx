import React, { useEffect, useState } from "react";

export const ToDo = () => {
  const baseURL = 'https://playground.4geeks.com/todo';
  const user = 'Natt-s';
  const [isEdit, setIsEdit] = useState(false);
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editTask, setEditTask] = useState({});
  const [labelEdit, setLabelEdit] = useState('');
  const [completeEdit, setCompleteEdit] = useState(false);

  // Obtener tareas
  const getTodos = async () => {
    const uri = `${baseURL}/users/${user}`;
    const options = { method: 'GET' };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log('Error:', response.status, response.statusText);
      return;
    }
    const data = await response.json();
    setTodos(data.todos);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Añadir tarea
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!task.trim()) return; // Evita tareas vacías

    const dataToSend = {
      label: task,
      is_done: false,
    };

    const uri = `${baseURL}/todos/${user}`;
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    };

    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log('Error:', response.status, response.statusText);
      return;
    }

    getTodos();
    setTask(""); // Limpiar el input
  };

  // Editar tarea
  const handleEdit = (taskEdit) => {
    setIsEdit(true);
    setEditTask(taskEdit);
    setLabelEdit(taskEdit.label);
    setCompleteEdit(taskEdit.is_done);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      label: labelEdit,
      is_done: completeEdit,
    };

    const uri = `${baseURL}/todos/${editTask.id}`;
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    };

    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log('Error:', response.status, response.statusText);
      return;
    }

    getTodos();
    setIsEdit(false);
    setLabelEdit('');
    setCompleteEdit(false);
    setEditTask({});
  };

  // Eliminar tarea
  const handleDelete = async (taskId) => {
    const uri = `${baseURL}/todos/${taskId}`;
    const options = { method: 'DELETE' };
    const response = await fetch(uri, options);
    if (!response.ok) {
      console.log('Error:', response.status, response.statusText);
      return;
    }
    getTodos();
  };

  // Capturar tecla Enter en el input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text">Todo List</h1>
      {isEdit ? (
        <form onSubmit={handleEditSubmit}>
          <div className="text-start mb-3">
            <label htmlFor="editTask" className="form-label">Edit task</label>
            <input 
              type="text" 
              className="form-control" 
              value={labelEdit} 
              onChange={(event) => setLabelEdit(event.target.value)} 
            />
          </div>
          <div className="text-start mb-3 form-check">
            <input 
              type="checkbox" 
              className="form-check-input" 
              checked={completeEdit} 
              onChange={(event) => setCompleteEdit(event.target.checked)} 
            />
            <label className="form-check-label">Completed</label>
          </div>
          <button type="submit" className="btn btn-primary me-2">Submit</button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="text-start mb-3">
            <label htmlFor="exampleTask" className="form-label">Add Task</label>
            <input 
              type="text" 
              className="form-control" 
              id="exampleTask"
              value={task} 
              onChange={(event) => setTask(event.target.value)}
              onKeyPress={handleKeyPress} // Captura Enter
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Task</button>
        </form>
      )}

      <h2 className="text">List</h2>
      <ul className="text-start list-group">
        {todos.map((item) => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            <div>
              {item.is_done ? (
                <span className="text-success fw-bold me-2">✓</span>
              ) : (
                <span className="text-danger fw-bold me-2">⊗</span>
              )}
              {item.label}
            </div>
            <div>
              <span 
                onClick={() => handleEdit(item)} 
                className="text-primary fw-bold me-2"
                style={{ cursor: 'pointer' }}
              >
                🖉
              </span>
              <span 
                onClick={() => handleDelete(item.id)} 
                className="text-danger fw-bold"
                style={{ cursor: 'pointer' }}
              >
                X
              </span>
            </div>
          </li>
        ))}
        <li className="list-group-item text-end">
          {todos.length === 0
            ? 'No tasks, please add a new task'
            : `${todos.length} task${todos.length > 1 ? 's' : ''}`}
        </li>
      </ul>
    </div>
  );
};
