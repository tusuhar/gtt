const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("theme-toggle");
const progressCircle = document.getElementById("progress");
const totalCount = document.getElementById("total-count");
const doneCount = document.getElementById("done-count");
const pendingCount = document.getElementById("pending-count");
const dateTime = document.getElementById("date-time");

// 🎵 Sonidos
const soundAdd = document.getElementById("sound-add");
const soundDone = document.getElementById("sound-done");
const soundDelete = document.getElementById("sound-delete");

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  applyTheme();
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

addBtn.addEventListener("click", addTask);
themeToggle.addEventListener("click", toggleTheme);

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("Por favor, escribe una tarea.");
  soundAdd.play();

  const li = createTaskElement(text);
  taskList.appendChild(li);
  taskInput.value = "";
  saveTasks();
  updateStats();
}

function createTaskElement(text, completed = false) {
  const li = document.createElement("li");
  li.textContent = text;
  if (completed) li.classList.add("completed");

  li.addEventListener("click", (e) => {
    if (e.target.tagName !== "BUTTON") {
      li.classList.toggle("completed");
      soundDone.play();
      saveTasks();
      updateStats();
    }
  });

  const delBtn = document.createElement("button");
  delBtn.classList.add("delete-btn");
  delBtn.textContent = "✖";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    soundDelete.play();
    li.style.opacity = "0";
    li.style.transform = "translateX(40px)";
    setTimeout(() => {
      li.remove();
      saveTasks();
      updateStats();
    }, 300);
  });

  li.appendChild(delBtn);
  return li;
}

function saveTasks() {
  const tasks = [...document.querySelectorAll("#task-list li")].map((li) => ({
    text: li.firstChild.textContent,
    completed: li.classList.contains("completed"),
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((t) => taskList.appendChild(createTaskElement(t.text, t.completed)));
  updateStats();
}

filters.forEach((f) =>
  f.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    f.classList.add("active");
    filterTasks(f.dataset.filter);
  })
);

function filterTasks(type) {
  const tasks = document.querySelectorAll("#task-list li");
  tasks.forEach((t) => {
    if (type === "all") t.style.display = "flex";
    else if (type === "pending") t.style.display = t.classList.contains("completed") ? "none" : "flex";
    else t.style.display = t.classList.contains("completed") ? "flex" : "none";
  });
}

function updateStats() {
  const tasks = document.querySelectorAll("#task-list li");
  const total = tasks.length;
  const completed = [...tasks].filter((t) => t.classList.contains("completed")).length;
  const pending = total - completed;

  totalCount.textContent = total;
  doneCount.textContent = completed;
  pendingCount.textContent = pending;

  const percent = total === 0 ? 0 : (completed / total) * 100;
  progressCircle.style.strokeDashoffset = 100 - percent;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  themeToggle.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
}

function applyTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
  }
}

function updateDateTime() {
  const now = new Date();
  dateTime.textContent = now.toLocaleString("es-ES", {
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
