const today = new Date().toISOString().slice(0, 10);
const savedDate = localStorage.getItem("date");

if (savedDate !== today) {
  localStorage.setItem("tasks", JSON.stringify([]));
  localStorage.setItem("date", today);
}

const dateEl = document.getElementById("date");
dateEl.innerText = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long"
});

const tasksEl = document.getElementById("tasks");
const input = document.getElementById("newTask");
const addBtn = document.getElementById("addBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  tasksEl.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task" + (task.done ? " done" : "");

    div.innerHTML = `
      <label>
        <input type="checkbox" ${task.done ? "checked" : ""}>
        <span>${task.text}</span>
      </label>
    `;

    div.querySelector("input").addEventListener("change", () => {
      tasks[index].done = !tasks[index].done;
      save();
      render();
    });

    tasksEl.appendChild(div);
  });
}

addBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;

  tasks.push({ text: input.value, done: false });
  input.value = "";
  save();
  render();
});

render();
