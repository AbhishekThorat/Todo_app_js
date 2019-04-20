const API_BASE_PATH = 'http://localhost:3000/';
const TODOS = 'todos/';
const NO_TO_DO_MESSAGE = 'Look like you have completed all today\'s To-Do :)';

/**
 * To keep track of number of todos.
 * @TODO - Need to check for some cleaner way.
 */
let lengthOfToDos = 0;

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
      .then(() => {
        inputElement.value = '';
        document.getElementById("toDoList").innerHTML += createToDoLi(toDoTitle, lengthOfToDos);
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
    lengthOfToDos = todos.length;
    const todoWrapper = document.getElementById('todos');
    // Generate the li list w.r.t. available todos
    const liListForToDOs = todos.reduce((prev, next, index) => `${prev}${createToDoLi(todos[index].title, index)}`, '');
    if (lengthOfToDos > 0) {
        todoWrapper.innerHTML = `<ul id="toDoList">${liListForToDOs}</ul>`;
    } else {
        todoWrapper.innerHTML = NO_TO_DO_MESSAGE; 
    }
}

/**
 * Function to create a li element.
 *
 * @param {*} title Title of To-Do item
 * @param {*} index Index of To-Do item - using it to generate uniq identifier.
 * @returns string - which we will use to as inner html
 */
function createToDoLi(title, index) {
    return `<li>${title} <button class="remove" id="${title}_${index}">x</button></li>`;
}
 
document.getElementById('addToDo').addEventListener('click', addToDo);
renderToDoList();
