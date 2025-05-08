// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-button");

let oldInputValue; // Corrigido nome da variável

// Funções
const saveTodo = (text, done =0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

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

  //Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
  }
  if (save) {
    saveTodosToStorage({text,done});
  }

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;

      updatedTodosLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchedTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    if (todoTitle.includes(search)) {
      todo.style.display = "flex";
    } else {
      todo.style.display = "none";
    }
  });
};

const filterTodoss = (filterValue) => {

  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {

    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

      case "done":
        todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
        break;

        case "todo":
          todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none"));
          break;

          default:
            break;
  }
};


// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;

  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest(".todo");
  let todoTitle;

  if (parentEl) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodosStatusInStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle; // Corrigido nome da variável
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value.toLowerCase();
  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup")); // dispara novamente com string vazia
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
 
  filter(filterValue);

});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodosToStorage = (todo) => {
  const todos = getTodosLocalStorage();

  todos.push(todo);
  
  localStorage.setItem("todos", JSON.stringify(todos));

};

const removeTodoFromStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const filteredTodos = todos.filter((todo) => todo.text !== todoText);

  localStorage.setItem("todos", JSON.stringify(filteredTodos));

};

const updateTodosStatusInStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const updatedTodos = todos.map((todo) => {
    if (todo.text === todoText) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });

  localStorage.setItem("todos", JSON.stringify(updatedTodos));
}

const updatedTodosLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  const updatedTodos = todos.map((todo) => {
    if (todo.text === todoText) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  });

  localStorage.setItem("todos", JSON.stringify(updatedTodos));

}


loadTodos();


