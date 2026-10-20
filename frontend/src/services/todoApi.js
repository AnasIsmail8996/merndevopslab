const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message = data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const todoApi = {
  list: () => request('/todos'),
  create: (payload) =>
    request('/todos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/todos/${id}`, {
      method: 'DELETE',
    }),
};
