document.addEventListener('DOMContentLoaded',()=>{

    console.log("todoList initial state:", document.getElementById('todoList').innerHTML);
    initializeApp();
    setupDragAndDrop();
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
    taskItem.draggable = true;
    taskItem.innerHTML = `
    <h3 class="title is-6">${title}</h3>
    <p>${description}</p>
    <p>${asigned}</p>
    `;

    taskItem.addEventListener('dragstart', dragStart);
    todoList.appendChild(taskItem);
}

function setupDragAndDrop(){
    const draggables = document.querySelectorAll('.box-add');
    const dropzones = document.querySelectorAll('.dropzone');
    
    draggables.forEach(draggable =>{
        draggable.addEventListener('dragstart', dragStart);
    })

    dropzones.forEach(dropzone =>{
        dropzone.addEventListener('dragover', dragOver);
        dropzone.addEventListener('drop', drop);
    })
}

function dragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function drop(e){
    e.preventDefault();
    e.target.classList.remove('drag-over');

    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id) || document.querySelector('.hide');

    if(draggable){
        draggable.classList.remove('.hide');
        e.target.appendChild(draggable);
    }
}

function clearModalFields() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskAsigned').value = '';
}