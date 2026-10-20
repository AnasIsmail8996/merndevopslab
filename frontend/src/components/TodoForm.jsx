import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

function TodoForm({ initialValues, onSubmit, onCancel, submitting, submitLabel = 'Add todo' }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialValues?.title || '',
    },
  });

  useEffect(() => {
    reset({
      title: initialValues?.title || '',
    });
  }, [initialValues, reset]);

  const submit = async (values) => {
    await onSubmit(values);
    if (!initialValues) {
      reset({ title: '' });
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit(submit)} noValidate>
      <label htmlFor="title">Todo title</label>
      <input
        id="title"
        type="text"
        placeholder="What needs doing?"
        maxLength={200}
        aria-invalid={Boolean(errors.title)}
        {...register('title', {
          required: 'Title is required',
          minLength: { value: 1, message: 'Title is required' },
          maxLength: { value: 200, message: 'Title must be at most 200 characters' },
        })}
      />
      {errors.title && <p className="status status-error">{errors.title.message}</p>}
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button className="btn btn-secondary" type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoForm;
