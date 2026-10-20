import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { todoApi } from '../services/todoApi';

export const fetchTodos = createAsyncThunk('todos/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await todoApi.list();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createTodo = createAsyncThunk('todos/create', async (payload, { rejectWithValue }) => {
  try {
    return await todoApi.create(payload);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateTodo = createAsyncThunk(
  'todos/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      return await todoApi.update(id, payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk('todos/delete', async (id, { rejectWithValue }) => {
  try {
    await todoApi.remove(id);
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    actionStatus: 'idle',
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load todos';
      })
      .addCase(createTodo.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload || 'Failed to create todo';
      })
      .addCase(updateTodo.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        const index = state.items.findIndex((todo) => todo._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload || 'Failed to update todo';
      })
      .addCase(deleteTodo.pending, (state) => {
        state.actionStatus = 'loading';
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded';
        state.items = state.items.filter((todo) => todo._id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.actionStatus = 'failed';
        state.error = action.payload || 'Failed to delete todo';
      });
  },
});

export const { clearError } = todosSlice.actions;
export default todosSlice.reducer;
