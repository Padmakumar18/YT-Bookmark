document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const clearAllButton = document.getElementById("clearAll");

    function saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function getTasks() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    function renderTasks() {
        taskList.innerHTML = "";
        getTasks().forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
                <button class="toggle" data-index="${index}">✔</button>
            `;
            taskList.appendChild(li);
        });
    }

    function addTask() {
        const tasks = getTasks();
        if (taskInput.value.trim()) {
            tasks.push({ text: taskInput.value, completed: false });
            saveTasks(tasks);
            taskInput.value = "";
            renderTasks();
        }
    }

    function editTask(index) {
        const tasks = getTasks();
        const newText = prompt("Edit your task", tasks[index].text);
        if (newText) {
            tasks[index].text = newText;
            saveTasks(tasks);
            renderTasks();
        }
    }

    function deleteTask(index) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    }

    function toggleComplete(index) {
        const tasks = getTasks();
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks();
    }

    clearAllButton.addEventListener("click", function () {
        localStorage.removeItem("tasks");
        renderTasks();
    });

    addTaskButton.addEventListener("click", addTask);

    taskList.addEventListener("click", function (event) {
        const index = event.target.dataset.index;
        if (event.target.classList.contains("edit")) editTask(index);
        if (event.target.classList.contains("delete")) deleteTask(index);
        if (event.target.classList.contains("toggle")) toggleComplete(index);
    });

    renderTasks();
});