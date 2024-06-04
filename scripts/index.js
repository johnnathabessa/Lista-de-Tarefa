document.getElementById("task-form").addEventListener("submit", addTask);
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

function removeAccentAndApplyLowerCase(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}
function addTask(e) {
  e.preventDefault();
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();
  const allListItems = document.querySelectorAll("li");
  const allListItemsData = []

  allListItems.forEach((item) => {
    
    allListItemsData.push(removeAccentAndApplyLowerCase (item.textContent))
  })


  if (taskText === "") {
    alert("Por favor, digite uma tarefa.");
    return
  } else if (allListItemsData.includes(removeAccentAndApplyLowerCase(`${taskText}X`))) {
    alert("Essa tarefa ja existe.");
    taskInput.value = "";
    return

  } else {
    addTaskToDom(taskText.toUpperCase(), false);
    saveTaskToLocalStorage(taskText);
    taskInput.value = "";
  }
}

function addTaskToDom(taskText, completed = false) {
  const li = document.createElement("li");
  li.textContent = taskText;
  if (completed) {
    li.classList.add("completed");
  }
  li.addEventListener("click", toggleTaskCompletion);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.classList.add("delete");
  deleteButton.addEventListener("click", deleteTask);

  li.appendChild(deleteButton);
  document.getElementById("task-list").appendChild(li);
}

function toggleTaskCompletion(e) {
  e.target.classList.toggle("completed");
}

function deleteTask(e) {
  const li = e.target.parentElement;
  const taskText  = li.textContent.slice(0, -1);

  removeTaskFromLocalStorage(taskText);
  li.remove();
}

function getTskFromLocalStorage() {
  return localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [];
}
function saveTaskToLocalStorage(taskText) {
  const tasks = getTskFromLocalStorage();
  tasks.push({text: taskText, completed: false});
  localStorage.setItem("tasks", JSON.stringify(tasks));

}

function removeTaskFromLocalStorage(taskText) {
  const tasks = getTskFromLocalStorage();
  const taskIndex = tasks.findIndex(task => task.text === taskText);
  tasks.splice(taskIndex, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasks = getTskFromLocalStorage();
  tasks.forEach(tasks => {
    addTaskToDom(tasks.text, tasks.completed);})
}