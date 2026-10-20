import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TodoForm from '../components/TodoForm.jsx';
import TodoItem from '../components/TodoItem.jsx';
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from '../store/todosSlice';

function TodoPage() {
  const dispatch = useDispatch();
  const { items, status, error, actionStatus } = useSelector((state) => state.todos);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const busy = actionStatus === 'loading';

  const handleCreate = async ({ title }) => {
    const result = await dispatch(createTodo({ title, completed: false }));
    if (createTodo.fulfilled.match(result)) {
      setEditingTodo(null);
    }
  };

  const handleUpdate = async ({ title }) => {
    if (!editingTodo) return;
    const result = await dispatch(updateTodo({ id: editingTodo._id, title }));
    if (updateTodo.fulfilled.match(result)) {
      setEditingTodo(null);
    }
  };

  const handleToggle = (todo) => {
    dispatch(updateTodo({ id: todo._id, completed: !todo.completed }));
  };

  const handleDelete = (id) => {
    if (editingTodo?._id === id) {
      setEditingTodo(null);
    }
    dispatch(deleteTodo(id));
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <h1>This MERN Stack | DevOPs PRoject with CI/CD Pipeline</h1>
        <p>Create, update, and track simple tasks through the API.</p>
      </header>

      <section className="panel">
        <TodoForm
          key={editingTodo?._id || 'create'}
          initialValues={editingTodo}
          onSubmit={editingTodo ? handleUpdate : handleCreate}
          onCancel={editingTodo ? () => setEditingTodo(null) : undefined}
          submitting={busy}
          submitLabel={editingTodo ? 'Save changes' : 'Add todo'}
        />

        {status === 'loading' && <p className="status status-info">Loading todos…</p>}
        {error && <p className="status status-error">{error}</p>}

        {status === 'succeeded' && items.length === 0 && (
          <p className="empty-state">No todos yet. Add your first one above.</p>
        )}

        {items.length > 0 && (
          <ul className="todo-list">
            {items.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={handleToggle}
                onEdit={setEditingTodo}
                onDelete={handleDelete}
                busy={busy}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default TodoPage;
