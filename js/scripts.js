const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchForm = document.querySelector("#search form");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterSelect = document.querySelector("#filter-select");

let editingId = null;

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const saveTodo = (text, done = false, save = true, id = generateId()) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  todo.dataset.id = id;

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  if (done) {
    todo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ id, text, done: false });
  }

  todoList.appendChild(todo);

  todoInput.value = "";

  applyFilters();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todo = todoList.querySelector(`.todo[data-id="${editingId}"]`);

  if (todo) {
    todo.querySelector("h3").innerText = text;
    updateTodoLocalStorage(editingId, text);
  }
};

const applyFilters = () => {
  const search = searchInput.value.trim().toLowerCase();
  const filterValue = filterSelect.value;

  document.querySelectorAll(".todo").forEach((todo) => {
    const title = todo.querySelector("h3").innerText.toLowerCase();
    const isDone = todo.classList.contains("done");

    const matchesSearch = title.includes(search);
    const matchesFilter =
      filterValue === "all" ||
      (filterValue === "done" && isDone) ||
      (filterValue === "todo" && !isDone);

    todo.style.display = matchesSearch && matchesFilter ? "flex" : "none";
  });
};


todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value.trim();

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const todoEl = targetEl.closest(".todo");

  if (!todoEl) return;

  const id = todoEl.dataset.id;
  const todoTitle = todoEl.querySelector("h3").innerText;

  if (targetEl.classList.contains("finish-todo")) {
    todoEl.classList.toggle("done");
    updateTodoStatusLocalStorage(id);
    applyFilters();
  }

  if (targetEl.classList.contains("remove-todo")) {
    todoEl.remove();
    removeTodoLocalStorage(id);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();

    editInput.value = todoTitle;
    editingId = id;
    editInput.focus();
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value.trim();

  if (editInputValue) {
    updateTodo(editInputValue);
    applyFilters();
  }

  toggleForms();
});

searchForm.addEventListener("submit", (e) => e.preventDefault());

searchInput.addEventListener("input", applyFilters);

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";
  applyFilters();
});

filterSelect.addEventListener("change", applyFilters);


const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  let changed = false;

  todos.forEach((todo) => {
    if (!todo.id) {
      todo.id = generateId();
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, false, todo.id);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);

  localStorage.setItem("todos", JSON.stringify(todos));
};

const removeTodoLocalStorage = (id) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.id !== id);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodoStatusLocalStorage = (id) => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.id === id) todo.done = !todo.done;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (id, newText) => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    if (todo.id === id) todo.text = newText;
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};

loadTodos();