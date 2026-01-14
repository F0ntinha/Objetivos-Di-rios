const today = new Date().toISOString().slice(0, 10);
const savedDate = localStorage.getItem("date");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Se mudou o dia
if (savedDate !== today) {
  tasks.forEach(task => {
    task.history = task.history || {};
    task.history[savedDate] = task.done;
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
      <label>
        <input type="checkbox" ${task.done ? "checked" : ""}>
        <span contenteditable="true">${task.text}</span>
      </label>
      <button class="delete">🗑️</button>
    `;

    // Marcar feito
    div.querySelector("input").addEventListener("change", () => {
      task.done = !task.done;
      save();
      render();
    });

    // Editar texto
    div.querySelector("span").addEventListener("blur", (e) => {
      task.text = e.target.innerText.trim();
      save();
    });

    // Apagar
    div.querySelector(".delete").addEventListener("click", () => {
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

render();
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

  alert(`📊 Últimos 7 dias:\n✅ Feitos: ${done}\n❌ Não feitos: ${notDone}`);
}
