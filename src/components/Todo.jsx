import { useState,useEffect } from 'react';
import Swal from 'sweetalert2';
import '/src/styles/app.css'

function Todo() {

  const [todos,setTodos] = useState([]);
  const [input,setInput] = useState('');
  const [editId,setEditId] = useState(null);
  const [editText,setEditText] = useState('');
  const [error,setError]=useState('')
  const [isLoaded, setIsLoaded] = useState(false);





const validateInput = (value, todos) => {
   if (value === "null" || value === "undefined") return "Task cannot be null or  undefined.";
   const text = value.trim();
   if (!text) return "Task cannot be empty."; 
  const isDuplicate = todos.some(
    (todo) => todo.text.toLowerCase() === text.toLowerCase()
  );

  if (isDuplicate) return "This task already exists.";

  return "";

};

useEffect(() => {
  const saved = JSON.parse(localStorage.getItem("todos"));
  if (Array.isArray(saved)) {
    setTodos(saved);
  }
  setIsLoaded(true);   
}, []);



useEffect(() => {
  if (isLoaded) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}, [todos, isLoaded]);



  const addTodo = () => {
    const err = validateInput(input, todos);
    if (err) {
    setError(err);
    return;
  }

  setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
  setInput('');
  setError('');
  
  Swal.fire({
  title: "Added new  task",
  icon: "success",
  draggable: true
});
};


const deleteTodo = (id) => {
  Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    setTodos(todos.filter(todo => todo.id !== id));
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success"
    });
  }
});
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {

  setEditId(id);
  setEditText(text);
  setError('');
};

const saveEdit = () => {
  const err = validateInput(editText, todos.filter(t => t.id !== editId));
  if (err) {
    setError(err);
    return;
  }

  Swal.fire({
  title: "Edited task",
  icon: "success",
  draggable: true
});
  setTodos(todos.map(todo =>
    todo.id === editId ? { ...todo, text: editText.trim() } : todo
  ));

  setEditId(null);
  setEditText('');
  setError('');
};


  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  return (
    <>
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">My To-Do List</h1>
          <p className="subtitle">Organize your tasks and boost productivity</p>
        </div>
         {error && <p className="error-msg">{error}</p>}

        <div className="input-card">
          <input
            type="text"
            className="input"
            placeholder="What do you need to do today?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <button className="btn-add" onClick={addTodo}>
            Add Task
          </button>
        </div>

        <div className="tasks-card">
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p className="empty-text">No tasks yet</p>
              <p className="empty-subtext">Add your first task to get started</p>
            </div>
          ) : (
            <div className="task-list">
              {todos.map((todo, index) => (
                <div key={todo.id}>
                  {editId === todo.id ? (
                    <div className="task-item editing">
                      <input
                        type="text"
                        className="edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        autoFocus
                      />
                      <div className="edit-actions">
                        <button className="btn-save" onClick={saveEdit}>
                          <span className="btn-icon">✓</span> Save
                        </button>
                        <button className="btn-cancel" onClick={cancelEdit}>
                          <span className="btn-icon">✕</span> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`task-item ${todo.completed ? 'completed' : ''}`}>
                      <div className="task-content">
                        <label className="checkbox-wrapper">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo.id)}
                            />
                          <span className="checkbox"></span>
                        </label>
                        <span className="task-text">{todo.text}</span>
                      </div>
                      
                      <div className="task-actions">
                        <button  
                          className="btn-action btn-edit" 
                          onClick={() => startEdit(todo.id, todo.text)}
                          title="Edit task"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.3879 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button 
                          className="btn-action btn-delete" 
                          onClick={() => deleteTodo(todo.id)}
                          title="Delete task"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H3.33333H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.33301 4.00004V2.66671C5.33301 2.31309 5.47348 1.97395 5.72353 1.7239C5.97358 1.47385 6.31272 1.33337 6.66634 1.33337H9.33301C9.68663 1.33337 10.0258 1.47385 10.2758 1.7239C10.5259 1.97395 10.6663 2.31309 10.6663 2.66671V4.00004M12.6663 4.00004V13.3334C12.6663 13.687 12.5259 14.0261 12.2758 14.2762C12.0258 14.5262 11.6866 14.6667 11.333 14.6667H4.66634C4.31272 14.6667 3.97358 14.5262 3.72353 14.2762C3.47348 14.0261 3.33301 13.687 3.33301 13.3334V4.00004H12.6663Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                  {index < todos.length - 1 && <div className="divider"></div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Todo