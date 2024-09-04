const tasksArray = [];

document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "todoList initial state:",
    document.getElementById("todoList").innerHTML
  );
  initializeApp();
  setupDragAndDrop();
});

function initializeApp() {
  const addTaskButton = document.getElementById("addTaskButton");
  const saveTaskButton = document.getElementById("saveTaskButton");
  const closeModalButtons = document.querySelectorAll(
    ".delete, .modal-card-foot .button"
  );

  console.log("save button founded");

  addTaskButton.addEventListener("click", openTaskModal);
  closeModalButtons.forEach((button) =>
    button.addEventListener("click", closeTaskModal)
  );
  saveTaskButton.addEventListener("click", saveTask);

  setupDragAndDrop();
}

function openTaskModal() {
  const taskModal = document.getElementById("taskModal");
  taskModal.classList.add("is-active");
}

function closeTaskModal() {
  const taskModal = document.getElementById("taskModal");
  clearModalFields();
  taskModal.classList.remove("is-active");
}

function saveTask() {
  console.log("saveTask funcionando");
  const taskTitle = document.getElementById("taskTitle").value.trim();
  const taskDescription = document.getElementById("taskDescription").value.trim();
  const taskAsigned = document.getElementById("taskAsigned").value.trim();

  if (taskTitle !== "") {
    const task = {
      id: "task-" + Date.now(), // ID único
      title: taskTitle,
      description: taskDescription,
      asigned: taskAsigned,
      state: "To Do" //asigno el state de To Do como predeterminado al crear una nueva task
    };
    tasksArray.push(task); // Guardar en el array de tareas 
    console.log("Tareas guardadas:", tasksArray); // Mostrar las tareas en consola para verificar

    addTaskTodoList(task.title, task.description, task.asigned, task.state, task.id); //añade las tareas
    saveTaskToServer(task); //Guarda las tareas creadas en el archivo .json
    closeTaskModal();
  }
}

function setupDragAndDrop() {
  console.log("Setting up drag and drop");
  document.addEventListener("dragstart", dragStart);
  document.addEventListener("dragover", dragOver);
  document.addEventListener("drop", drop);
}

function dragStart(e) { //esta funcion se activa cuando empezamos a arrastrar una tarea
  console.log("Drag started", e.target);
  if (e.target.classList.contains("box-add")) {
    e.dataTransfer.setData("text/plain", e.target.id); //almacena el id de la tarea para usarlo cuando suelte
    setTimeout(() => {
      e.target.classList.add("hide");
    }, 0);
  }
}

function dragOver(e) {
  e.preventDefault(); //permite soltar la tarea en la columna 
  if (e.target.classList.contains("dropzone")) {
    console.log("Dragging over dropzone", e.target);
    e.target.classList.add("drag-over");
  }
}

function drop(e) {
    e.preventDefault();
    console.log("Drop event triggered", e.target);
    const dropzone = e.target.closest(".dropzone");
    if (dropzone) {
        console.log("Valid dropzone found", dropzone);
        dropzone.classList.remove("drag-over");
        const id = e.dataTransfer.getData("text/plain"); //recupera el id de la tarea que se arrastro
        const draggable = document.getElementById(id); //encuentra el elemento arrastrado
  
    if (draggable) {
        console.log("Moving task", draggable);
        draggable.classList.remove("hide"); //muestra la tarea
        dropzone.appendChild(draggable); //añade la tarea a la columna
  
    //actualiza el estado de la tarea segun la columna que se encuentre
    const newState = dropzone.id === "todoList" ? "To Do" :
                        dropzone.id === "doingList" ? "Doing" :
                        dropzone.id === "reviewList" ? "Under Review" :
                        "Done";
  
    updateTaskState(id, newState); //llama a la funcion para actualizar el state de la tarea y lo guarda en el .json
      }
    }
}

function addTaskTodoList(title, description, asigned, state, id) {
    const todoList = document.getElementById('todoList');
    const doingList = document.getElementById('doingList');
    const reviewList = document.getElementById('reviewList');
    const doneList = document.getElementById('doneList');
  
    const taskItem = document.createElement('div');
    taskItem.className = 'box box-add';
    taskItem.draggable = true;
    taskItem.id = id;
    taskItem.innerHTML = `
      <h3 class="title is-6">${title}</h3>
      <p>${description}</p>
      <p>${asigned}</p>
    `;
  
    //segun el state, agrega la task a la columna que pertenece
    switch (state) {
      case 'To Do':
        todoList.appendChild(taskItem);
        break;
      case 'Doing':
        doingList.appendChild(taskItem);
        break;
      case 'Under Review':
        reviewList.appendChild(taskItem);
        break;
      case 'Done':
        doneList.appendChild(taskItem);
        break;
      default:
        todoList.appendChild(taskItem);
        break;
    }
  }

function clearModalFields() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskAsigned").value = "";
}

tasksArray.forEach((task) => {
  console.log(task.title, task.description, task.asigned);
});

let url = "http://localhost:3000/tasks";

async function fetchDataAW() {
  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json(); // extract JSON from response
    // console.log(data);
    return data;
  } catch (error) {
    console.log("Error fetching data: ", error);
  }
}

tasks = fetchDataAW().then((tasksResponse) => {
  tasksResponse.forEach((taskResponse) => {
    console.log(taskResponse.title);
    tasksArray.push(taskResponse);
  });

  console.log("Tareas cargadas:", tasksArray);

  loadTasks(); //carga las tareas en el .json cuando se inicia la pagina
});

function loadTasks() {
    tasksArray.forEach(task => {
      addTaskTodoList(task.title, task.description, task.asigned, task.state, task.id);
    });
  }

loadTasks();

function saveTaskToServer(task) {
    fetch(url , { method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify(task), //añade las tasks que creemos al archivo .json, asi quedan guardadas
    })
        .then(response => response.json())
        .then(data => {
            console.log("Tarea guardada en el servidor:", data);
        })
        .catch((error) => {
            console.error("Error al guardar la tarea en el servidor:", error);
        });
}

function updateTaskState(taskId, newState) {
    const task = tasksArray.find(t => t.id === taskId); //encuentra la tarea en el array
    if (task) {
      task.state = newState; //actualiza el estado de la tarea
      console.log(`Task ${taskId} state updated to ${newState}`);
      updateTaskOnServer(task);   //actualiza el estado en el servidor y los guarda
    }
}
  
function updateTaskOnServer(task) {
    fetch(`${url}/${task.id}`, {
      method: "PUT", //usar PUT para actualizar una tarea existente
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
    })
    .then(response => response.json())
    .then(data => {
      console.log("Tarea actualizada en el servidor:", data);
    })
    .catch((error) => {
      console.error("Error al actualizar la tarea en el servidor:", error);
    });
  }