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

    setupDragAndDrop();
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

function setupDragAndDrop(){
    console.log('Setting up drag and drop');
    document.addEventListener('dragstart', dragStart);
    document.addEventListener('dragover', dragOver);
    document.addEventListener('drop', drop);
}

function dragStart(e){
    console.log('Drag started', e.target);
    if (e.target.classList.contains('box-add')) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.classList.add('hide');
        }, 0);
    }
}

function dragOver(e) {
    e.preventDefault();
    if (e.target.classList.contains('dropzone')) {
        console.log('Dragging over dropzone', e.target);
        e.target.classList.add('drag-over');
    }
}

function drop(e){
    e.preventDefault();
    console.log('Drop event triggered', e.target);
    const dropzone = e.target.closest('.dropzone');
    if (dropzone) {
        console.log('Valid dropzone found', dropzone);
        dropzone.classList.remove('drag-over');
        const id = e.dataTransfer.getData('text/plain');
        console.log('Task ID:', id);
        const draggable = document.getElementById(id) || document.querySelector('.box-add.hide');
        
        if (draggable) {
            console.log('Moving task', draggable);
            draggable.classList.remove('hide');
            dropzone.appendChild(draggable);
        } else {
            console.log('No draggable element found');
        }
    } else {
        console.log('No valid dropzone found');
    }
}

function addTaskTodoList(title, description, asigned) {
    console.log("Añadiendo task:", title, description, asigned);
    const todoList = document.getElementById('todoList');

    const taskItem = document.createElement('div');
    taskItem.className = 'box box-add';
    taskItem.draggable = true;
    taskItem.id = 'task-' + Date.now(); // Asignar un ID único
    taskItem.innerHTML = `
    <h3 class="title is-6">${title}</h3>
    <p>${description}</p>
    <p>${asigned}</p>
    `;

    console.log('New task created:', taskItem);
    todoList.appendChild(taskItem);
}

function clearModalFields() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskAsigned').value = '';
}