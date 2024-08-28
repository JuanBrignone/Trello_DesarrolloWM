document.addEventListener('DOMContentLoaded',()=>{

    console.log("todoList initial state:", document.getElementById('todoList').innerHTML);
    initializeApp();
});

function initializeApp(){
    const addTaskButton = document.getElementById('addTaskButton');
    const saveTaskButton = document.getElementById('saveTaskButton');
    const closeModalButtons = document.querySelectorAll('.delete, .modal-card-foot .button');

    console.log("save button founded")

    addTaskButton.addEventListener('click', openTaskModal);
        closeModalButtons.forEach(button => button.addEventListener('click', closeTaskModal));
        saveTaskButton.addEventListener('click', saveTask);
}

function openTaskModal(){
    const taskModal = document.getElementById('taskModal');
    taskModal.classList.add('is-active');
}

function closeTaskModal(){
    const taskModal = document.getElementById('taskModal');
    clearModalFields();
    taskModal.classList.remove('is-active');
}

function saveTask(){
    console.log("saveTask funcionando")
    const taskTitle = document.getElementById('taskTitle').value.trim();
    const taskDescription = document.getElementById('taskDescription').value.trim();
    const taskAsigned = document.getElementById('taskAsigned').value.trim();

    if (taskTitle !== '') {
        addTaskTodoList(taskTitle, taskDescription, taskAsigned);
        closeTaskModal();
    }
}

function addTaskTodoList(title, description, asigned){
    console.log("Añadiendo task:", title, description, asigned);
    const todoList = document.getElementById('todoList');

    const taskItem = document.createElement('div');
    taskItem.className = 'box box-add';
    taskItem.innerHTML = `
    <h3 class="title is-6">${title}</h3>
    <p>${description}</p>
    <p>${asigned}</p>
    `;

todoList.appendChild(taskItem);
}

function clearModalFields() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskAsigned').value = '';
}