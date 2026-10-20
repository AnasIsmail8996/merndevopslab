function TodoItem({ todo, onToggle, onEdit, onDelete, busy }) {
  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
        disabled={busy}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <p className="todo-title">{todo.title}</p>
      <div className="todo-actions">
        <button className="btn btn-secondary" type="button" onClick={() => onEdit(todo)} disabled={busy}>
          Edit
        </button>
        <button className="btn btn-danger" type="button" onClick={() => onDelete(todo._id)} disabled={busy}>
          Delete
        </button>
      </div>
    </li>
  );
}

export default TodoItem;
