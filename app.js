const task = document.querySelector(".task-input input");
filters = document.querySelectorAll(".filters span");
taskBox = document.querySelector(".task-box");
clearAll = document.querySelector(".clear-btn");

let tasks = JSON.parse(localStorage.getItem("tasks"));

let editId;
let isEdited = false;

task.addEventListener("keyup", (e) => {
  let oneTask = task.value.trim();
  if (e.key == "Enter" && oneTask) {
    if (!isEdited) {
      if (!tasks) {
        tasks = [];
      }
      let taskInfo = { name: oneTask, status: "pending" };
      tasks.push(taskInfo);
    } else {
      isEdited = false;
      tasks[editId].name = oneTask;
    }
    task.value = "";
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  showTask("all");
});

filters.forEach((e) => {
  e.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    e.classList.add("active");
    showTask(e.id);
  });
});

function showTask(filter) {
  let li = "";
  if (tasks) {
    tasks.forEach((task, id) => {
      let isCompleted = task.status == "completed" ? "checked" : "";
      if (filter == task.status || filter == "all") {
        li += `<li class="task">
                  <label for="${id}">
                      <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                      <p class="${isCompleted}">${task.name}</p>
                  </label>
                  <div class="settings">
                      <ion-icon onclick="showMenu(this)" name="ellipsis-vertical"></ion-icon>
                      <ul class="task-menu">
                          <li onclick="editTask(${id}, '${task.name}')"><ion-icon name="pencil"></ion-icon>Edit</li>
                          <li onclick="deleteTask(${id})"><ion-icon name="trash"></ion-icon>Delete</li>
                      </ul>
                  </div>
              </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}

showTask("all");

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    tasks[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    tasks[selectedTask.id].status = "pending";
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "ION-ICON" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function deleteTask(id) {
  tasks.splice(id, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showTask("all");
}

function editTask(id, taskName) {
  editId = id;
  isEdited = true;
  task.value = taskName;
}

clearAll.onclick = function () {
  tasks.splice(0, tasks.length);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  showTask("all");
};
