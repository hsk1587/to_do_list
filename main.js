const STORAGE_KEY = 'todos';

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function initApp() {
  let todos = loadTodos();
  let nextId = todos.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  let currentFilter = 'all';

  const input = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const list = document.getElementById('todo-list');
  const countDisplay = document.getElementById('todo-count');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  function renderCount() {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    countDisplay.textContent = `전체 ${total}개, 완료 ${completed}개`;
  }

  function getFilteredTodos() {
    if (currentFilter === 'active') {
      return todos.filter((t) => !t.completed);
    }
    if (currentFilter === 'completed') {
      return todos.filter((t) => t.completed);
    }
    return todos;
  }

  function render() {
    list.innerHTML = '';

    const filtered = getFilteredTodos();

    if (filtered.length === 0) {
      const emptyMessage = document.createElement('li');
      emptyMessage.className = 'empty-message';
      emptyMessage.textContent = '할 일이 없습니다.';
      list.appendChild(emptyMessage);
    } else {
      filtered.forEach((todo) => {
        const item = document.createElement('li');
        item.className = 'todo-item' + (todo.completed ? ' completed' : '');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        item.appendChild(checkbox);
        item.appendChild(text);
        item.appendChild(deleteBtn);
        list.appendChild(item);
      });
    }

    renderCount();
  }

  function persistAndRender() {
    saveTodos(todos);
    render();
  }

  function addTodo() {
    const value = input.value.trim();

    if (value === '') {
      alert('할 일을 입력하세요');
      return;
    }

    const isDuplicate = todos.some((t) => t.text === value);
    if (isDuplicate) {
      alert('이미 등록된 할 일입니다');
      return;
    }

    todos.push({ id: nextId++, text: value, completed: false });
    input.value = '';
    persistAndRender();
  }

  function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      persistAndRender();
    }
  }

  function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    persistAndRender();
  }

  function clearCompleted() {
    todos = todos.filter((t) => !t.completed);
    persistAndRender();
  }

  function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    render();
  }

  addBtn.addEventListener('click', addTodo);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  });

  clearCompletedBtn.addEventListener('click', clearCompleted);

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  render();
}

initApp();
