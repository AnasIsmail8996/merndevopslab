import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getTodos = async (_req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (title === undefined || title === null || String(title).trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = await Todo.create({
      title: String(title).trim(),
      completed: Boolean(completed),
    });

    return res.status(201).json(todo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Failed to create todo', error: error.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid todo id' });
    }

    const updates = {};
    if (req.body.title !== undefined) {
      const trimmed = String(req.body.title).trim();
      if (trimmed === '') {
        return res.status(400).json({ message: 'Title cannot be empty' });
      }
      updates.title = trimmed;
    }
    if (req.body.completed !== undefined) {
      updates.completed = Boolean(req.body.completed);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const todo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.status(200).json(todo);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid todo id' });
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    return res.status(200).json({ message: 'Todo deleted', todo });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
};
