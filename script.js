document.addEventListener("DOMContentLoaded", function() {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
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
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
                <button onclick="toggleComplete(${index})">✔</button>
            `;
            taskList.appendChild(li);
        });
    }

    window.addTask = function() {
        const tasks = getTasks();
        if (taskInput.value.trim()) {
            tasks.push({ text: taskInput.value, completed: false });
            saveTasks(tasks);
            taskInput.value = "";
            renderTasks();
        }
    };

    window.editTask = function(index) {
        const tasks = getTasks();
        const newText = prompt("Edit your task", tasks[index].text);
        if (newText) {
            tasks[index].text = newText;
            saveTasks(tasks);
            renderTasks();
        }
    };

    window.deleteTask = function(index) {
        const tasks = getTasks();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    };

    window.toggleComplete = function(index) {
        const tasks = getTasks();
        tasks[index].completed = !tasks[index].completed;
        saveTasks(tasks);
        renderTasks();
    };

    clearAllButton.addEventListener("click", function() {
        localStorage.removeItem("tasks");
        renderTasks();
    });

    addTaskButton.addEventListener("click", addTask);
    renderTasks();
});
