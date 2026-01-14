const today = new Date().toISOString().slice(0, 10);
const savedDate = localStorage.getItem("date");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Mudança de dia
if (savedDate !== today) {
  tasks.forEach(task => {
    task.history = task.history || {};
    if (savedDate) task.history[savedDate] = task.done;
    task.done = false;
  });

  localStorage.setItem("date", today);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Data no topo
document.getElementById("date").innerText =
  new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

const tasksEl = document.getElementById("tasks");
const input = document.getElementById("newTask");
const addBtn = document.getElementById("addBtn");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  tasksEl.innerHTML = "";

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task" + (task.done ? " done" : "");

    div.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.done ? "checked" : ""}>
        <span contenteditable="false">${task.text}</span>
      </div>
      <div class="actions">
        <button class="edit">✏️</button>
        <button class="delete">🗑️</button>
      </div>
    `;

    const checkbox = div.querySelector("input");
    const text = div.querySelector("span");
    const editBtn = div.querySelector(".edit");
    const deleteBtn = div.querySelector(".delete");

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      save();
      render();
    });

    editBtn.addEventListener("click", () => {
      if (text.isContentEditable) {
        text.contentEditable = "false";
        task.text = text.innerText.trim();
        editBtn.innerText = "✏️";
        save();
      } else {
        text.contentEditable = "true";
        text.focus();
        editBtn.innerText = "💾";
      }
    });

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      save();
      render();
    });

    tasksEl.appendChild(div);
  });
}

addBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;

  tasks.push({
    text: input.value,
    done: false,
    createdAt: today,
    history: {}
  });

  input.value = "";
  save();
  render();
});

function weeklyStats() {
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });

  let done = 0;
  let notDone = 0;

  tasks.forEach(task => {
    last7Days.forEach(day => {
      if (task.history?.[day] === true) done++;
      if (task.history?.[day] === false) notDone++;
    });
  });

  alert(`📊 Estatísticas (7 dias)\n\n✅ Feitos: ${done}\n❌ Não feitos: ${notDone}`);
}

render();
