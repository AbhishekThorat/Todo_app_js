const API_BASE_PATH = 'http://localhost:3000/';
const TODOS = 'todos/';
const NO_TO_DO_MESSAGE = 'Look like you have completed all today\'s To-Do :)';

/**
 * Function to get the To-Do list. 
 *
 * @returns To-Do list
 */
async function getToDoList() {
    return await fetch(`${API_BASE_PATH}${TODOS}`).then(res => res.json());
}
 
/**
 * Function to add To-Do to the list
 *
 */
async function addToDo() {
    const inputElement = document.getElementById('taskInput');
    const toDoTitle = inputElement.value;
    await fetch(`${API_BASE_PATH}${TODOS}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: inputElement.value })
      })
      .then(res => res.json())
      .then(res => {
        inputElement.value = '';
        if (!document.getElementById("toDoList")) {
            setupToDoList();
            setupClickListeners();
        }
        document.getElementById("toDoList").innerHTML += createToDoLi(toDoTitle, res.id);
      })
      .catch(() => {
          // Need to add error handling.
      });
}

/**
 * Function to render To-Do list
 *
 */
async function renderToDoList() {
    const todos = await getToDoList();
    const todoWrapper = document.getElementById('todos');
    // Generate the li list w.r.t. available todos
    const liListForToDOs = todos.reduce((prev, next, index) => {
        const todo = todos[index];
        return `${prev}${createToDoLi(todo.title, todo.id)}`
    }, '');
    if (todos.length > 0) {
        todoWrapper.innerHTML = `<ul id="toDoList">${liListForToDOs}</ul>`;
        setupClickListeners();
    } else {
        todoWrapper.innerHTML = NO_TO_DO_MESSAGE; 
    }
}

function setupToDoList() {
    document.getElementById('todos').innerHTML = '<ul id="toDoList"></ui>'
}

function setupClickListeners() {
    const toDoListElement = document.getElementById("toDoList");
    document.getElementById("toDoList").addEventListener("click", function(e) {
        if (!e.target) { return; }
        const itemToUpdate = e.target.parentNode;
        let itemID = e.target.getAttribute('id');
        if (e.target.matches("button.delete-to-do")) {
            // Get the only id from list
            itemID = itemID.replace("delete_", "");
            fetch(`${API_BASE_PATH}${TODOS}${parseInt(itemID)}`, {
                method: 'DELETE',
            })
            .then(res => {
                toDoListElement.removeChild(itemToUpdate);
                if (toDoListElement.childNodes.length == 0) {
                    const todoWrapper = document.getElementById('todos');
                    todoWrapper.innerHTML = NO_TO_DO_MESSAGE; 
                }
            })
            .catch(err => {
                // Need to add error handling
            })
        }
        else if (e.target.matches("button.complete-to-do")) {
            itemToUpdate.classList.toggle("lineThrough")
        }
      });
}

/**
 * Function to create a li element.
 *
 * @param {*} title Title of To-Do item
 * @param {*} index Index of To-Do item - using it to generate uniq identifier.
 * @returns string - which we will use to as inner html
 */
function createToDoLi(title, index) {
    return `<li class="item">${title} <button class="complete-to-do" id="complete_${index}">Complete</button> <button class="delete-to-do" id="delete_${index}">Delete</button></li>`;
}
 
document.getElementById('addToDo').addEventListener('click', addToDo);

renderToDoList();
