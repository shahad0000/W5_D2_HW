document.addEventListener("DOMContentLoaded", () => {
  let tasksGrid = document.getElementById("tasks-grid");
  let addTaskForm = document.getElementById("add-task-form");
  let deleteAllBtn = document.getElementById("delete-all");
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let talkCount = document.getElementById("task-count");

  // Load tasks to DOM
  const loadTasks = () => {
    tasksGrid.innerText = "";
    tasks.map((task) => renderTask(task));
    talkCount.innerText = ` ${tasks.length} task`;
    if (tasks.length > 0)  {
        deleteAllBtn.style.display = "block";
    } else {
        deleteAllBtn.style.display = "none";
    }
  };

  const renderTask = (task) => {
    let sticker = document.createElement("div");
    let taskTitle = document.createElement("div");
    let deleteBtn = document.createElement("button");
    let checkBtn = document.createElement("button");
    let stickerBottom = document.createElement("div");

    stickerBottom.classList.add("sticker-bottom");
    checkBtn.innerText = "Done";
    checkBtn.style.border = "none";
    checkBtn.style.padding = "0.4rem";
    checkBtn.style.backgroundColor = "transparent";

    checkBtn.onclick = () => {
      checkBtn.style.backgroundColor =
        checkBtn.style.backgroundColor === "rgb(77, 204, 166)"
          ? "transparent"
          : "rgb(77, 204, 166)";
      checkBtn.innerText = checkBtn.innerText === "Done" ? "Done✔️" : "Done";
    };

    sticker.classList.add("sticker", "p-3");
    deleteBtn.classList.add("delete-btn");
    taskTitle.classList.add("task-title");

    const randomColor = Math.floor(Math.random() * 8);
    const colors = [
      "#bed9ff",
      "#f7cdd3",
      "#f7f5cd",
      "#cdf7cd",
      "lightblue",
      "#b5b5e5",
      "#eef28a",
      "#84d4e0",
    ];
    sticker.style.backgroundColor = colors[randomColor];

    deleteBtn.innerText = "Remove 🗑️";
    // Handle delete
    deleteBtn.onclick = () => {
      let confirmDel = window.confirm(
        "Are you sure you want to delete this task?"
      );
      if (confirmDel) deleteTask(task.id);
    };

    // Handle delete all
    deleteAllBtn.onclick = () => {
      let confirmDel = window.confirm(
        "Are you sure you want to delete all tasks?"
      );
      if (confirmDel) {
        tasks.map((task) => deleteTask(task.id));
        tasks = [];
      }
    };


    taskTitle.innerText = task.title;
    sticker.appendChild(taskTitle);
    stickerBottom.appendChild(deleteBtn);
    stickerBottom.appendChild(checkBtn);
    sticker.appendChild(stickerBottom);
    tasksGrid.appendChild(sticker);
  };

  const addTask = async () => {
    let addTaskTitle = document.getElementById("add-task-title");

    // Send to API
    try {
      const res = await fetch(
        "https://68219a10259dad2655afc1c9.mockapi.io/task",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            title: addTaskTitle.value,
          }),
        }
      );
      // Save to local storage
      const data = await res.json();
      tasks.push(data);
      renderTask(data);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      talkCount.innerText = ` ${tasks.length} task`;

      // Reset form and close it
      addTaskTitle.value = "";
      bootstrap.Modal.getInstance(
        document.getElementById("add-task-modal")
      ).hide();

      if (tasks.length > 0)  {
        deleteAllBtn.style.display = "block";
    }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTask = async (taskId) => {
    // Delete from API
    try {
      const res = await fetch(
        `https://68219a10259dad2655afc1c9.mockapi.io/task/${taskId}`,
        {
          method: "DELETE",
        }
      );
      // remove from local storage
      const data = await res.json();
      tasks = tasks.filter((task) => task.id !== data.id);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  addTaskForm.onsubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  loadTasks();
});
